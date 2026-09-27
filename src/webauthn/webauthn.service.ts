import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {
    generateRegistrationOptions,
    generateAuthenticationOptions,
    RegistrationResponseJSON,
    verifyRegistrationResponse, verifyAuthenticationResponse
} from '@simplewebauthn/server';
import {InjectRepository} from "@nestjs/typeorm";
import {AttendanceTerminal} from "./attendance-terminals.entity";
import {DataSource, Repository} from "typeorm";
import {User} from "../core/users/users.entity";
import {Branch} from "../core/branches/branches.entity";
import {VerifyAuthenticationDto} from "./dto/verify-authentication.dto";
import {Attendance} from "../core/attendances/attendance.entity";

@Injectable()
export class WebauthnService {
    private readonly rpName = process.env.WEBAUTHN_RP_NAME!;
    private readonly rpID = process.env.WEBAUTHN_RP_ID!;
    private readonly origin = process.env.WEBAUTHN_ORIGIN!;

    private registrationChallenge: string | null = null;

    constructor(
        @InjectRepository(AttendanceTerminal)
        private attendanceTerminalRepository: Repository<AttendanceTerminal>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private dataSource: DataSource
    ) {}

    async generateRegistrationOptions() {
        const userId = `terminal-${Date.now()}`;

        const options = await generateRegistrationOptions({
            rpName: this.rpName,
            rpID: this.rpID,
            userName: userId,
            userDisplayName: 'Terminal de asistencia',
            attestationType: 'none',
            authenticatorSelection: {
                residentKey: 'required',
                userVerification: 'required',
            },
            supportedAlgorithmIDs: [-7, -257],
        });
        this.registrationChallenge = options.challenge;

        return { options };
    }

    async verifyRegistration(response: RegistrationResponseJSON, userId: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['branch']
        });
        if (!user) {
            throw new NotFoundException({
                message: ['Usuario no encontrado.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        if (user.branch.name === 'Sin sede asignada') {
            throw new BadRequestException({
                message: ['No tiene asignada una sucursal.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        if (!this.registrationChallenge) {
            throw new BadRequestException({
                message: ['No existe un registro activo.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        const attendanceTerminalExisting = await this.attendanceTerminalRepository.findOneBy({
             branch: { id: user.branch.id }
        });
        if (attendanceTerminalExisting) {
            throw new BadRequestException({
                message: ['Ya existe un terminal de asistencia asignado a la sucursal.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        const verification = await verifyRegistrationResponse({
            response,
            expectedRPID: this.rpID,
            expectedOrigin: this.origin,
            expectedChallenge: this.registrationChallenge,
        });
        if (!verification.verified) {
            throw new BadRequestException({
                message: ['No se pudo verificar la credencial.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        const registrationInfo = verification.registrationInfo;
        if (!registrationInfo) {
            throw new BadRequestException({
                message: ['No se obtuvo información de la credencial.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        const { credential } = registrationInfo;
        this.registrationChallenge = null;

        const savedAttendanceTerminal = await this.dataSource.transaction(async manager => {
            const attendanceTerminalRepository = manager.getRepository(AttendanceTerminal);
            const branchRepository = manager.getRepository(Branch);

            const newAttendanceTerminal = attendanceTerminalRepository.create({
                name: 'Terminal de asistencia',
                credentialId: credential.id,
                publicKey: Buffer.from(credential.publicKey).toString('base64'),
                counter: credential.counter,
                branch: user.branch
            });
            const savedAttendanceTerminal = await attendanceTerminalRepository.save(newAttendanceTerminal);

            await branchRepository.update(user.branch.id, {
                isRegistered: true
            });

            return savedAttendanceTerminal;
        });

        return { attendanceTerminal: savedAttendanceTerminal };
    }

    async generateAuthenticationOptions(userId: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['branch']
        });
        if (!user) {
            throw new NotFoundException({
                message: ['Usuario no encontrado.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        if (user.branch.name === 'Sin sede asignada') {
            throw new BadRequestException({
                message: ['No tiene asignada una sucursal.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        const attendanceTerminal = await this.attendanceTerminalRepository.findOne({
            where: {
                branch: { id: user.branch.id },
            },
        });
        if (!attendanceTerminal) {
            throw new BadRequestException({
                message: ['No existe una terminal registrada.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        const options = await generateAuthenticationOptions({
            rpID: this.rpID,
            userVerification: 'required',
            allowCredentials: [{
                id: attendanceTerminal.credentialId,
            }],
        });

        attendanceTerminal.authenticationChallenge = options.challenge;
        await this.attendanceTerminalRepository.save(
            attendanceTerminal
        );

        return { options };
    }

    async verifyAuthentication(verifyAuthenticationDto: VerifyAuthenticationDto, userId: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['branch']
        });
        if (!user) {
            throw new NotFoundException({
                message: ['Usuario no encontrado.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        if (user.branch.name === 'Sin sede asignada') {
            throw new BadRequestException({
                message: ['No tiene asignada una sucursal.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        const attendanceTerminal = await this.attendanceTerminalRepository.findOne({
            where: {
                branch: { id: user.branch.id },
            },
        });
        if (!attendanceTerminal) {
            throw new BadRequestException({
                message: ['Terminal no encontrada.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        if (!attendanceTerminal.authenticationChallenge) {
            throw new BadRequestException({
                message: ['No existe un challenge de autenticación activo.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        const verification = await verifyAuthenticationResponse({
            response: verifyAuthenticationDto.authenticationResponseJSON,
            expectedRPID: this.rpID,
            expectedOrigin: this.origin,
            expectedChallenge: attendanceTerminal.authenticationChallenge,
            credential: {
                id: attendanceTerminal.credentialId,
                publicKey: Buffer.from(attendanceTerminal.publicKey, 'base64'),
                counter: attendanceTerminal.counter,
            },
        });
        if (!verification.verified) {
            throw new BadRequestException({
                message: ['La autenticación WebAuthn no es válida.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        const savedAttendance = await this.dataSource.transaction(async manager => {
            const attendanceTerminalRepository = manager.getRepository(AttendanceTerminal);
            const attendanceRepository = manager.getRepository(Attendance);

            const newAttendance = attendanceRepository.create({
                latitude: verifyAuthenticationDto.attendance.latitude,
                longitude: verifyAuthenticationDto.attendance.longitude,
                accuracy: verifyAuthenticationDto.attendance.accuracy,
                branch: user.branch,
                user: user,
                attendanceTerminal: attendanceTerminal
            });
            const savedAttendance = await attendanceRepository.save(newAttendance);

            attendanceTerminal.authenticationChallenge = null;
            attendanceTerminal.counter = verification.authenticationInfo.newCounter;
            await attendanceTerminalRepository.save(
                attendanceTerminal,
            );

            return savedAttendance;
        });

        return { attendance: savedAttendance };
    }
}

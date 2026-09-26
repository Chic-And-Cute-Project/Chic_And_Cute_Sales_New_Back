import {BadRequestException, Injectable} from '@nestjs/common';
import {
    generateRegistrationOptions,
    generateAuthenticationOptions,
    RegistrationResponseJSON,
    verifyRegistrationResponse, verifyAuthenticationResponse, AuthenticationResponseJSON
} from '@simplewebauthn/server';
import {InjectRepository} from "@nestjs/typeorm";
import {AttendanceTerminal} from "./attendance-terminals.entity";
import {Repository} from "typeorm";

@Injectable()
export class WebauthnService {
    private readonly rpName = process.env.WEBAUTHN_RP_NAME!;
    private readonly rpID = process.env.WEBAUTHN_RP_ID!;
    private readonly origin = process.env.WEBAUTHN_ORIGIN!;

    private registrationChallenge: string | null = null;
    private authenticationChallenge: string | null = null;

    constructor(
        @InjectRepository(AttendanceTerminal)
        private attendanceTerminalRepository: Repository<AttendanceTerminal>
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

    async verifyRegistration(response: RegistrationResponseJSON) {
        if (!this.registrationChallenge) {
            throw new BadRequestException({
                message: ['No existe un registro activo.'],
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

        const newAttendanceTerminal = this.attendanceTerminalRepository.create({
            name: 'Terminal de prueba',
            credentialId: credential.id,
            publicKey: Buffer.from(credential.publicKey).toString('base64'),
            counter: credential.counter
        });
        const savedAttendanceTerminal = await this.attendanceTerminalRepository.save(newAttendanceTerminal);

        return { attendanceTerminal: savedAttendanceTerminal };
    }

    async generateAuthenticationOptions() {
        const attendanceTerminal = await this.attendanceTerminalRepository.findOne({
            where: {
                id: 1,
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

        this.authenticationChallenge = options.challenge;

        return { options };
    }

    async verifyAuthentication(response: AuthenticationResponseJSON) {
        if (!this.authenticationChallenge) {
            throw new BadRequestException({
                message: ['No existe un challenge de autenticación activo.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        const attendanceTerminal = await this.attendanceTerminalRepository.findOne({
            where: {
                id: 1,
            },
        });
        if (!attendanceTerminal) {
            throw new BadRequestException({
                message: ['Terminal no encontrada.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        const verification = await verifyAuthenticationResponse({
            response,
            expectedRPID: this.rpID,
            expectedOrigin: this.origin,
            expectedChallenge: this.authenticationChallenge,
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

        this.authenticationChallenge = null;

        attendanceTerminal.counter = verification.authenticationInfo.newCounter;
        const updatedAttendanceTerminal = await this.attendanceTerminalRepository.save(
            attendanceTerminal,
        );

        return { attendanceTerminal: updatedAttendanceTerminal };
    }
}

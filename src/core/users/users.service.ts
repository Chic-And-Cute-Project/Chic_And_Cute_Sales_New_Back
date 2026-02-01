import {BadRequestException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User, UserRole} from "./users.entity";
import {ILike, Repository} from "typeorm";
import {RegisterUserDto} from "./dto/register-user.dto";
import * as bcrypt from 'bcrypt';
import {LoginUserDto} from "./dto/login-user.dto";
import {JwtService} from "@nestjs/jwt";
import {ResetPasswordDto} from "./dto/reset-password.dto";
import {Branch} from "../branches/branches.entity";
import {UpdateUserDto} from "./dto/update-user.dto";

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Branch)
        private readonly branchRepository: Repository<Branch>,
        private jwtService: JwtService,
    ) {}

    async register(registerUserDto: RegisterUserDto) {
        const userExisting = await this.userRepository.findOneBy({
            username: registerUserDto.username
        });

        if (userExisting) {
            throw new BadRequestException({
                message: ['El usuario ya está en uso.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        const defaultBranch = await this.branchRepository.findOneBy({
            name: 'Sin sede asignada'
        });

        if (!defaultBranch) {
            throw new BadRequestException({
                message: ['La sede por defecto no existe.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);

        const newUser = this.userRepository.create({
            ...registerUserDto,
            password: hashedPassword,
            role: UserRole.BRANCH,
            branch: defaultBranch
        });
        const savedUser = await this.userRepository.save(newUser);

        return { user: savedUser };
    }

    async login(loginUserDto: LoginUserDto) {
        const user = await this.userRepository.findOne({
            where: { username: loginUserDto.username },
        });
        if (!user) {
            throw new UnauthorizedException({
                message: ['Correo o contraseña inválidos.'],
                error: "Unauthorized",
                statusCode: 401
            });
        }

        const passwordValid = await bcrypt.compare(loginUserDto.password, user.password);
        if (!passwordValid) {
            throw new UnauthorizedException({
                message: ['Correo o contraseña inválidos.'],
                error: "Unauthorized",
                statusCode: 401
            });
        }

        const payload = {
            sub: user.id
        }
        const token = this.jwtService.sign(payload);

        return {
            token: token,
            role: user.role,
        };
    }

    async findAll() {
        const users = await this.userRepository.find();

        if (users.length === 0) {
            throw new NotFoundException({
                message: ['Usuarios no encontrados.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        return { users };
    }

    async findById(id: number) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['branch']
        });
        if (!user) {
            throw new NotFoundException({
                message: ['Usuario no encontrado.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        return { user };
    }

    async findAllByBranchRole() {
        const users = await this.userRepository.find({
            where: { role: UserRole.BRANCH },
            relations: ['branch']
        });

        if (users.length === 0) {
            throw new NotFoundException({
                message: ['Usuarios no encontrados.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        return { users };
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        const user = await this.userRepository.findOneBy({
            id
        });
        if (!user) {
            throw new NotFoundException({
                message: ['Usuario no encontrado.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        const branch = await this.branchRepository.findOneBy({
            id: updateUserDto.branchId
        });
        if (!branch) {
            throw new BadRequestException({
                message: ['Sucursal no encontrada.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        await this.userRepository.update(id, { branch: branch });

        return this.findById(id);
    }

    async searchUserSales(name: string) {
        const users = await this.userRepository.find({
            where: { role: UserRole.BRANCH, name: ILike(`%${name}%`) },
            relations: ['branch']
        });

        if (users.length === 0) {
            throw new NotFoundException({
                message: ['Usuarios no encontrados.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        return { users };
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const user = await this.userRepository.findOne({
            where: { username: resetPasswordDto.username }
        });
        if (!user) {
            throw new NotFoundException({
                message: ['Usuario no encontrado.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 10);

        await this.userRepository.update(user.id, { password: hashedPassword });

        return this.findById(user.id);
    }
}

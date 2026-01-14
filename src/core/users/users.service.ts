import {BadRequestException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User, UserRole} from "./users.entity";
import {ILike, Repository} from "typeorm";
import {RegisterUserDto} from "./dto/register-user.dto";
import * as bcrypt from 'bcrypt';
import {LoginUserDto} from "./dto/login-user.dto";
import {JwtService} from "@nestjs/jwt";
import {ResetPasswordDto} from "./dto/reset-password.dto";

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
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

        const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);

        const newUser = this.userRepository.create({
            ...registerUserDto,
            password: hashedPassword,
            role: UserRole.BRANCH
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

    async findById(id: number) {
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

        return { user };
    }

    async findAll() {
        const users = await this.userRepository.find();
        if (!users.length) {
            throw new NotFoundException({
                message: ['Usuarios no encontrados.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        return users;
    }

    async findAllBySales() {
        const users = await this.userRepository.find({
            where: {
                role: UserRole.BRANCH
            }
        });
        if (!users.length) {
            throw new NotFoundException({
                message: ['Usuarios no encontrados.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        return users;
    }

    async searchUserSales(name: string) {
        const users = await this.userRepository.find({
            where: {
                role: UserRole.BRANCH,
                name: ILike(`%${name}%`)
            }
        });
        if (!users.length) {
            throw new NotFoundException({
                message: ['Usuarios no encontrados.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        return users;
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

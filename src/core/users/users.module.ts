import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./users.entity";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "../../security/jwt.strategy";
import {ConfigModule} from "@nestjs/config";
import {Branch} from "../branches/branches.entity";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forFeature([User, Branch]),
        JwtModule.register({
            secret: process.env.JWT_SECRET ?? 'Secret_Key_Chic_&_Cute_Back_022506',
            signOptions: { expiresIn: '1w' },
        }),
    ],
    controllers: [UsersController],
    providers: [UsersService, JwtStrategy]
})
export class UsersModule {}

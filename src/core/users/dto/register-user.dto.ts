import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, MinLength} from "class-validator";

export class RegisterUserDto {
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    @ApiProperty({ example: 'string' })
    name: string;

    @IsNotEmpty({ message: 'El apellido es obligatorio.' })
    @ApiProperty({ example: 'string' })
    lastName: string;

    @IsNotEmpty({ message: 'El usuario es obligatorio.' })
    @ApiProperty({ example: 'string' })
    username: string;

    @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
    @ApiProperty({ example: 'string' })
    password: string;
}
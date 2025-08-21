import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber} from "class-validator";

export class CreateProductDto {
    @IsNotEmpty({ message: 'El código es obligatorio.' })
    @ApiProperty({ example: 'string' })
    code: string;

    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    @ApiProperty({ example: 'string' })
    fullName: string;

    @IsNotEmpty({ message: 'El precio es obligatorio.' })
    @IsNumber({}, { message: "El precio debe ser un número." })
    @ApiProperty({ example: 10.00 })
    price: number;
}
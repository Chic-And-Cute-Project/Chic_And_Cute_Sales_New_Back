import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber} from "class-validator";

export class UpdateProductDto {
    @IsNotEmpty({ message: 'El precio es obligatorio.' })
    @IsNumber({}, { message: "El precio debe ser un número." })
    @ApiProperty({ example: 10.00 })
    price: number;
}
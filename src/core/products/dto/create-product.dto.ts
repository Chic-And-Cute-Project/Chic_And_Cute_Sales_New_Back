import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class CreateProductDto {
    @IsNotEmpty({ message: 'El código es obligatorio.' })
    @ApiProperty({ example: 'string' })
    code: string;

    @IsNotEmpty({ message: 'El precio es obligatorio.' })
    @IsNumber({}, { message: "El precio debe ser un número." })
    @ApiProperty({ example: 10.00 })
    @Type(() => Number)
    price: number;
}
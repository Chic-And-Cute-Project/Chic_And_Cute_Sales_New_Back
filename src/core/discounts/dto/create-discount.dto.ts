import {ApiProperty} from "@nestjs/swagger";
import {IsInt, IsNotEmpty, IsNumber, IsOptional} from "class-validator";
import {Type} from "class-transformer";

export class CreateDiscountDto {
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    @ApiProperty({ example: 'string' })
    name: string;

    @IsNotEmpty({ message: 'La cantidad de descuento es obligatoria.' })
    @IsInt({ message: "La cantidad de descuento debe ser entero." })
    @ApiProperty({ example: 10 })
    @Type(() => Number)
    quantity: number;

    @IsOptional()
    @IsNumber({}, { message: "El producto asociado debe ser un número." })
    @ApiProperty({ example: 1 })
    @Type(() => Number)
    productId: number;
}
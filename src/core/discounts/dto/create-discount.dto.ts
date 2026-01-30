import {ApiProperty} from "@nestjs/swagger";
import {IsInt, IsNotEmpty, IsOptional} from "class-validator";
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
    @IsNotEmpty({ message: 'El código de producto asociado es obligatorio.' })
    @ApiProperty({ example: 'string' })
    productCode: string;
}
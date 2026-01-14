import {ApiProperty} from "@nestjs/swagger";
import {IsInt, IsNotEmpty, IsNumber, IsOptional} from "class-validator";
import {Type} from "class-transformer";

export class CreateSaleDetailDto {
    @IsNotEmpty({ message: 'La cantidad es obligatoria.' })
    @IsInt({ message: "La cantidad debe ser entero." })
    @ApiProperty({ example: 2 })
    @Type(() => Number)
    quantity: number;

    @IsOptional()
    @IsInt({ message: "El descuento debe ser entero." })
    @ApiProperty({ example: 20 })
    @Type(() => Number)
    discount: number;

    @IsNotEmpty({ message: 'El ID del producto es obligatorio.' })
    @IsNumber({}, { message: 'El ID del producto debe ser un número.' })
    @Type(() => Number)
    @ApiProperty({ example: 1 })
    productId: number;
}
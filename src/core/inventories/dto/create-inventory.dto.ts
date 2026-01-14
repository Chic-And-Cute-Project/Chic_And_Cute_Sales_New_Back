import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class CreateInventoryDto {
    @IsNotEmpty({ message: 'El ID de la sucursal es obligatorio.' })
    @IsNumber({}, { message: 'El ID de la sucursal debe ser un número.' })
    @Type(() => Number)
    @ApiProperty({ example: 1 })
    branchId: number;

    @IsNotEmpty({ message: 'El ID del producto es obligatorio.' })
    @IsNumber({}, { message: 'El ID del producto debe ser un número.' })
    @Type(() => Number)
    @ApiProperty({ example: 1 })
    productId: number;
}
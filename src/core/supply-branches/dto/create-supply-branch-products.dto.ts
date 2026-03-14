import {ApiProperty} from "@nestjs/swagger";
import {IsInt, IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class CreateSupplyBranchProductsDto {
    @IsNotEmpty({ message: 'La cantidad es obligatoria.' })
    @IsInt({ message: "La cantidad debe ser entero." })
    @ApiProperty({ example: 2 })
    @Type(() => Number)
    quantity: number;

    @IsNotEmpty({ message: 'El ID del producto es obligatorio.' })
    @IsNumber({}, { message: 'El ID del producto debe ser un número.' })
    @Type(() => Number)
    @ApiProperty({ example: 1 })
    productId: number;
}
import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class CreateCloseSalesDaySalesDto {
    @IsNotEmpty({ message: 'El ID de la venta es obligatorio.' })
    @IsNumber({}, { message: 'El ID de la venta debe ser un número.' })
    @Type(() => Number)
    @ApiProperty({ example: 1 })
    saleId: number;
}
import {ApiProperty} from "@nestjs/swagger";
import {ArrayNotEmpty, IsArray, IsDate, IsNotEmpty, IsNumber, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {CreateCloseSalesDaySalesDto} from "./create-close-sales-day-sales.dto";

export class CreateCloseSalesDayDto {
    @IsNotEmpty({ message: 'La fecha es obligatorio.' })
    @IsDate({ message: 'La fecha debe ser correcta.' })
    @ApiProperty({ example: '2025-01-01T22:00:00.000Z' })
    @Type(() => Date)
    date: Date;

    @IsNotEmpty({ message: 'El ID de la sucursal es obligatorio.' })
    @IsNumber({}, { message: 'El ID de la sucursal debe ser un número.' })
    @Type(() => Number)
    @ApiProperty({ example: 1 })
    branchId: number;

    @IsNotEmpty({ message: 'La cantidad en efectivo es obligatoria.' })
    @IsNumber({}, { message: 'La cantidad en efectivo debe ser un número.' })
    @Type(() => Number)
    @ApiProperty({ example: 105 })
    cashAmount: number;

    @IsNotEmpty({ message: 'La cantidad en tarjeta es obligatoria.' })
    @IsNumber({}, { message: 'La cantidad en tarjeta debe ser un número.' })
    @Type(() => Number)
    @ApiProperty({ example: 90 })
    cardAmount: number;

    @IsArray({ message: 'Las ventas deben ser una lista.' })
    @ArrayNotEmpty({ message: 'Las ventas no pueden estar vacías.' })
    @ValidateNested({ each: true, message: 'Cada item debe ser válido.' })
    @ApiProperty({
        example: [
            { saleId: 1 }
        ]
    })
    @Type(() => CreateCloseSalesDaySalesDto)
    sales: CreateCloseSalesDaySalesDto[];
}
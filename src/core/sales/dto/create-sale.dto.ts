import {ApiProperty} from "@nestjs/swagger";
import {ArrayNotEmpty, IsArray, IsDate, IsNotEmpty, IsNumber, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {CreateSaleDetailDto} from "./create-sale-detail.dto";
import {CreateSalePaymentsDto} from "./create-sale-payments.dto";
import {PaymentType} from "../entities/sales-payment.entity";

export class CreateSaleDto {
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

    @IsArray({ message: 'El detalle debe ser una lista.' })
    @ArrayNotEmpty({ message: 'El detalle no puede estar vacío.' })
    @ValidateNested({ each: true, message: 'Cada item debe ser válido.' })
    @ApiProperty({
        example: [
            { productId: 1, quantity: 2, discount: 50 },
            { productId: 1, quantity: 10 }
        ]
    })
    @Type(() => CreateSaleDetailDto)
    detail: CreateSaleDetailDto[];

    @IsArray({ message: 'Los pagos deben ser una lista.' })
    @ArrayNotEmpty({ message: 'Los pagos no pueden estar vacíos.' })
    @ValidateNested({ each: true, message: 'Cada item debe ser válido.' })
    @ApiProperty({
        example: [
            { type: PaymentType.EFECTIVO, amount: 20 },
            { type: PaymentType.VISA, amount: 54 },
        ]
    })
    @Type(() => CreateSalePaymentsDto)
    paymentMethod: CreateSalePaymentsDto[];
}
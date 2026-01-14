import {ApiProperty} from "@nestjs/swagger";
import {IsEnum, IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";
import {PaymentType} from "../entities/sales-payment.entity";

export class CreateSalePaymentsDto {
    @IsNotEmpty({ message: 'El tipo de pago es obligatorio.' })
    @IsEnum(PaymentType, { message: 'El tipo de pago debe ser EFECTIVO o VISA.' })
    @ApiProperty({ enum: PaymentType, example: PaymentType.VISA })
    type: PaymentType;

    @IsNotEmpty({ message: 'La cantidad es obligatoria.' })
    @IsNumber({}, { message: 'La cantidad debe ser un número.' })
    @Type(() => Number)
    @ApiProperty({ example: 105 })
    amount: number;
}
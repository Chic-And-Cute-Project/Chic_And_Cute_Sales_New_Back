import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, IsOptional} from "class-validator";
import {Type} from "class-transformer";

export class CreateCustomReceiptDto {
    @IsNotEmpty({ message: 'El número de guía es obligatorio.' })
    @IsNumber({}, { message: 'El número de guía debe ser un número.' })
    @Type(() => Number)
    @ApiProperty({ example: 1 })
    sequence: number;

    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    @ApiProperty({ example: 'string' })
    name: string;

    @IsOptional()
    @IsNotEmpty({ message: 'El número de documento es obligatorio.' })
    @ApiProperty({ example: 'string' })
    documentNumber: string;

    @IsNotEmpty({ message: 'El teléfono es obligatorio.' })
    @ApiProperty({ example: 'string' })
    phoneNumber: string;

    @IsOptional()
    @IsNotEmpty({ message: 'La dirección es obligatoria.' })
    @ApiProperty({ example: 'string' })
    address: string;

    @IsOptional()
    @IsNotEmpty({ message: 'El distrito es obligatorio.' })
    @ApiProperty({ example: 'string' })
    district: string;

    @IsOptional()
    @IsNotEmpty({ message: 'La provincia es obligatoria.' })
    @ApiProperty({ example: 'string' })
    province: string;

    @IsNotEmpty({ message: 'El ID de la venta es obligatorio.' })
    @IsNumber({}, { message: 'El ID de la venta debe ser un número.' })
    @Type(() => Number)
    @ApiProperty({ example: 1 })
    saleId: number;
}
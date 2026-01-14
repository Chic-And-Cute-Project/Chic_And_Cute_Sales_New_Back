import {ApiProperty} from "@nestjs/swagger";
import {ArrayNotEmpty, IsArray, IsDate, IsNotEmpty, IsNumber, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {CreateRemissionGuideProductsDto} from "./create-remission-guide-products.dto";

export class CreateRemissionGuideDto {
    @IsNotEmpty({ message: 'El identificador es obligatorio.' })
    @ApiProperty({ example: 'string' })
    identifier: string;

    @IsNotEmpty({ message: 'La fecha es obligatorio.' })
    @IsDate({ message: 'La fecha debe ser correcta.' })
    @ApiProperty({ example: '2025-01-01T22:00:00.000Z' })
    @Type(() => Date)
    date: Date;

    @IsNotEmpty({ message: 'El ID de la sucursal de origen es obligatorio.' })
    @IsNumber({}, { message: 'El ID de la sucursal de origen debe ser un número.' })
    @Type(() => Number)
    @ApiProperty({ example: 1 })
    branchFromId: number;

    @IsNotEmpty({ message: 'El ID de la sucursal de destino es obligatorio.' })
    @IsNumber({}, { message: 'El ID de la sucursal de destino debe ser un número.' })
    @Type(() => Number)
    @ApiProperty({ example: 1 })
    branchToId: number;

    @IsArray({ message: 'Los productos deben ser una lista.' })
    @ArrayNotEmpty({ message: 'Los productos no pueden estar vacíos.' })
    @ValidateNested({ each: true, message: 'Cada item debe ser válido.' })
    @ApiProperty({
        example: [
            { productId: 1, quantity: 2 },
            { productId: 1, quantity: 10 }
        ]
    })
    @Type(() => CreateRemissionGuideProductsDto)
    products: CreateRemissionGuideProductsDto[];
}
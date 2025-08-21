import {IsInt, IsNotEmpty} from 'class-validator';
import {Type} from "class-transformer";

export class UpdateDiscountQueryDto {
    @IsNotEmpty({ message: 'El id es obligatorio.' })
    @IsInt({ message: "El id debe ser un número." })
    @Type(() => Number)
    id: number;
}
import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class UpdateUserDto {
    @IsNotEmpty({ message: 'El ID de la sucursal es obligatorio.' })
    @IsNumber({}, { message: 'El ID de la sucursal debe ser un número.' })
    @Type(() => Number)
    @ApiProperty({ example: 1 })
    branchId: number;
}
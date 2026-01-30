import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber} from "class-validator";

export class UpdateInventoryDto {
    @IsNotEmpty({ message: 'La cantidad es obligatoria.' })
    @IsNumber({}, { message: "La cantidad debe ser un número." })
    @ApiProperty({ example: 4 })
    quantity: number;
}
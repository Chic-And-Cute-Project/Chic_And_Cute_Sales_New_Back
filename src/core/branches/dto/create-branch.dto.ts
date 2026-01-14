import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class CreateBranchDto {
    @IsNotEmpty({ message: 'El nombre de la sucursal es obligatorio.' })
    @ApiProperty({ example: 'string' })
    name: string;
}
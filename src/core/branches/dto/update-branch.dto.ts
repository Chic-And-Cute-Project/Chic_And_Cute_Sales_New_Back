import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsOptional} from "class-validator";

export class UpdateBranchDto {
    @IsOptional()
    @IsNotEmpty({ message: 'El nombre de la sucursal es obligatorio.' })
    @ApiProperty({ example: 'string' })
    name: string;
}
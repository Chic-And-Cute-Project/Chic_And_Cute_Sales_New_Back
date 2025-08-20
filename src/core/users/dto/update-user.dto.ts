import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class UpdateUserDto {
    @IsNotEmpty({ message: 'La sede es obligatoria.' })
    @ApiProperty({ example: 'string' })
    branch: string;
}
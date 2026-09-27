import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class CreateAttendanceDto {
    @IsNotEmpty({ message: 'La latitud es obligatoria.' })
    @IsNumber({}, { message: 'La latitud debe ser un número.' })
    @Type(() => Number)
    @ApiProperty({ example: 1 })
    latitude: number;

    @IsNotEmpty({ message: 'La longitud es obligatoria.' })
    @IsNumber({}, { message: 'La longitud debe ser un número.' })
    @Type(() => Number)
    @ApiProperty({ example: 1 })
    longitude: number;

    @IsNotEmpty({ message: 'El radio de asistencia es obligatoria.' })
    @IsNumber({}, { message: 'El radio de asistencia debe ser un número.' })
    @Type(() => Number)
    @ApiProperty({ example: 1 })
    accuracy: number;
}
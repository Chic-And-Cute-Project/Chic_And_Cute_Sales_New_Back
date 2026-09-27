import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {CreateAttendanceDto} from "./create-attendance.dto";
import * as server from "@simplewebauthn/server";

export class VerifyAuthenticationDto {
    @IsNotEmpty({message: 'La asistencia es obligatoria.'})
    @ValidateNested({each: true, message: 'La asistencia debe ser válida.'})
    @Type(() => CreateAttendanceDto)
    @ApiProperty({type: () => CreateAttendanceDto})
    attendance: CreateAttendanceDto;

    @IsNotEmpty({message: 'La respuesta de autenticación es obligatoria.'})
    @ValidateNested({each: true, message: 'La respuesta de autenticación debe ser válida.'})
    authenticationResponseJSON: server.AuthenticationResponseJSON;
}
import {Controller, Get, Request, UseGuards} from '@nestjs/common';
import {AttendancesService} from "./attendances.service";
import {JwtAuthGuard} from "../../security/jwt-auth.guard";
import {ApiBearerAuth} from "@nestjs/swagger";

@Controller('attendances')
export class AttendancesController {

    constructor(private readonly attendancesService: AttendancesService) {}

    @Get('my')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('jwt-auth')
    getMyAttendances(@Request() req: any) {
        return this.attendancesService.findMyAttendances(req.user.id);
    }
}

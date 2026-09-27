import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Attendance} from "./attendance.entity";
import {Repository} from "typeorm";

@Injectable()
export class AttendancesService {

    constructor(
        @InjectRepository(Attendance)
        private readonly attendanceRepository: Repository<Attendance>,
    ) {}

    async findMyAttendances(userId: number) {
        const attendances = await this.attendanceRepository.find({
            where: { user: { id: userId } },
            relations: ['branch']
        });
        if (attendances.length === 0) {
            throw new NotFoundException({
                message: ['Asistencias no encontradas.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        return { attendances };
    }
}

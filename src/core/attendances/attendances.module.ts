import { Module } from '@nestjs/common';
import { AttendancesController } from './attendances.controller';
import { AttendancesService } from './attendances.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Attendance} from "./attendance.entity";

@Module({
  imports: [
      TypeOrmModule.forFeature([Attendance]),
  ],
  controllers: [AttendancesController],
  providers: [AttendancesService]
})
export class AttendancesModule {}

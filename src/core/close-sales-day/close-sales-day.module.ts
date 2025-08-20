import { Module } from '@nestjs/common';
import { CloseSalesDayController } from './close-sales-day.controller';
import { CloseSalesDayService } from './close-sales-day.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {CloseSalesDay} from "./entities/close-sales-day.entity";
import {CloseSalesDaySale} from "./entities/close-sales-day-sale.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([CloseSalesDay, CloseSalesDaySale])
    ],
    controllers: [CloseSalesDayController],
    providers: [CloseSalesDayService]
})
export class CloseSalesDayModule {}

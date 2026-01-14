import { Module } from '@nestjs/common';
import { CloseSalesDayController } from './close-sales-day.controller';
import { CloseSalesDayService } from './close-sales-day.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {CloseSalesDay} from "./entities/close-sales-day.entity";
import {CloseSalesDaySale} from "./entities/close-sales-day-sale.entity";
import {Branch} from "../branches/branches.entity";
import {User} from "../users/users.entity";
import {Sale} from "../sales/entities/sales.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([CloseSalesDay, CloseSalesDaySale, Branch, User, Sale])
    ],
    controllers: [CloseSalesDayController],
    providers: [CloseSalesDayService]
})
export class CloseSalesDayModule {}

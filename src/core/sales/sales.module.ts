import { Module } from '@nestjs/common';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Sale} from "./entities/sales.entity";
import {SaleDetail} from "./entities/sales-detail.entity";
import {SalePayment} from "./entities/sales-payment.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Sale, SaleDetail, SalePayment])
    ],
    controllers: [SalesController],
    providers: [SalesService]
})
export class SalesModule {}

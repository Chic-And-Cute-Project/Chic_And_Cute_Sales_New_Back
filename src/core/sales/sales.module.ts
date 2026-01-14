import { Module } from '@nestjs/common';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Sale} from "./entities/sales.entity";
import {SaleDetail} from "./entities/sales-detail.entity";
import {SalePayment} from "./entities/sales-payment.entity";
import {Branch} from "../branches/branches.entity";
import {User} from "../users/users.entity";
import {Product} from "../products/products.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Sale, SaleDetail, SalePayment, Branch, User, Product])
    ],
    controllers: [SalesController],
    providers: [SalesService]
})
export class SalesModule {}

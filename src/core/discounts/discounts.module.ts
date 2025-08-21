import { Module } from '@nestjs/common';
import { DiscountsController } from './discounts.controller';
import { DiscountsService } from './discounts.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Discount} from "./discounts.entity";
import {Product} from "../products/products.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Discount, Product])
    ],
    controllers: [DiscountsController],
    providers: [DiscountsService]
})
export class DiscountsModule {}

import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Product} from "./products.entity";
import {Branch} from "../branches/branches.entity";
import {Inventory} from "../inventories/inventories.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Product, Branch, Inventory])
    ],
    controllers: [ProductsController],
    providers: [ProductsService]
})
export class ProductsModule {}

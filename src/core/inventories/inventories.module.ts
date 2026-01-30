import { Module } from '@nestjs/common';
import { InventoriesController } from './inventories.controller';
import { InventoriesService } from './inventories.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Inventory} from "./inventories.entity";
import {Product} from "../products/products.entity";
import {Branch} from "../branches/branches.entity";
import {User} from "../users/users.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Inventory, Product, Branch, User])
    ],
    controllers: [InventoriesController],
    providers: [InventoriesService]
})
export class InventoriesModule {}

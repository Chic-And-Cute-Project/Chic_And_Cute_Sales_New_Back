import { Module } from '@nestjs/common';
import { InventoriesController } from './inventories.controller';
import { InventoriesService } from './inventories.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Inventory} from "./inventories.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Inventory])
    ],
    controllers: [InventoriesController],
    providers: [InventoriesService]
})
export class InventoriesModule {}

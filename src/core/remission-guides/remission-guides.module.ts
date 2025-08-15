import { Module } from '@nestjs/common';
import { RemissionGuidesController } from './remission-guides.controller';
import { RemissionGuidesService } from './remission-guides.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {RemissionGuide} from "./entities/remission-guides.entity";
import {RemissionGuideProduct} from "./entities/remission-guides-products.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([RemissionGuide, RemissionGuideProduct])
    ],
    controllers: [RemissionGuidesController],
    providers: [RemissionGuidesService]
})
export class RemissionGuidesModule {}

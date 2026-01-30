import { Module } from '@nestjs/common';
import { RemissionGuidesController } from './remission-guides.controller';
import { RemissionGuidesService } from './remission-guides.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {RemissionGuide} from "./entities/remission-guides.entity";
import {RemissionGuideProduct} from "./entities/remission-guides-products.entity";
import {Branch} from "../branches/branches.entity";
import {Product} from "../products/products.entity";
import {User} from "../users/users.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([RemissionGuide, RemissionGuideProduct, Branch, Product, User])
    ],
    controllers: [RemissionGuidesController],
    providers: [RemissionGuidesService]
})
export class RemissionGuidesModule {}

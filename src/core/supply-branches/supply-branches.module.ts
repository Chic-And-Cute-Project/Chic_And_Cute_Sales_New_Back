import { Module } from '@nestjs/common';
import { SupplyBranchesController } from './supply-branches.controller';
import { SupplyBranchesService } from './supply-branches.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {SupplyBranch} from "./entities/supply-branch.entity";
import {SupplyBranchProduct} from "./entities/supply-branch-products.entity";
import {Branch} from "../branches/branches.entity";
import {Product} from "../products/products.entity";
import {User} from "../users/users.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([SupplyBranch, SupplyBranchProduct, Branch, Product, User]),
  ],
  controllers: [SupplyBranchesController],
  providers: [SupplyBranchesService]
})
export class SupplyBranchesModule {}

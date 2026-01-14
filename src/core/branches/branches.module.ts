import { Module } from '@nestjs/common';
import { BranchesController } from './branches.controller';
import { BranchesService } from './branches.service';
import {Branch} from "./branches.entity";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forFeature([Branch]),
  ],
  controllers: [BranchesController],
  providers: [BranchesService]
})
export class BranchesModule {}

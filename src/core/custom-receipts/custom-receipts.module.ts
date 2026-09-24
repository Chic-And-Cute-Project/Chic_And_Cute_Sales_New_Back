import { Module } from '@nestjs/common';
import { CustomReceiptsController } from './custom-receipts.controller';
import { CustomReceiptsService } from './custom-receipts.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {CustomReceipt} from "./entities/custom-receipt.entity";
import {Sale} from "../sales/entities/sales.entity";

@Module({
  imports: [
      TypeOrmModule.forFeature([CustomReceipt, Sale])
  ],
  controllers: [CustomReceiptsController],
  providers: [CustomReceiptsService]
})
export class CustomReceiptsModule {}

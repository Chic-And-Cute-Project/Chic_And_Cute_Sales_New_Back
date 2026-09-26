import { Module } from '@nestjs/common';
import { WebauthnController } from './webauthn.controller';
import { WebauthnService } from './webauthn.service';
import {AttendanceTerminal} from "./attendance-terminals.entity";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [
      TypeOrmModule.forFeature([AttendanceTerminal]),
  ],
  controllers: [WebauthnController],
  providers: [WebauthnService]
})
export class WebauthnModule {}

import { Module } from '@nestjs/common';
import { WebauthnController } from './webauthn.controller';
import { WebauthnService } from './webauthn.service';
import {AttendanceTerminal} from "./attendance-terminals.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../core/users/users.entity";

@Module({
  imports: [
      TypeOrmModule.forFeature([AttendanceTerminal, User]),
  ],
  controllers: [WebauthnController],
  providers: [WebauthnService]
})
export class WebauthnModule {}

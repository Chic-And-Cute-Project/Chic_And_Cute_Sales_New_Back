import {Body, Controller, Post, Request, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import {CloseSalesDayService} from "./close-sales-day.service";
import {JwtAuthGuard} from "../../security/jwt-auth.guard";
import {ApiBearerAuth} from "@nestjs/swagger";
import {CreateCloseSalesDayDto} from "./dto/create-close-sales-day.dto";

@Controller('close-sales-day')
export class CloseSalesDayController {

  constructor(private readonly closeSalesDayService: CloseSalesDayService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createCloseSalesDayDto: CreateCloseSalesDayDto, @Request() req: any) {
    return this.closeSalesDayService.create(req.user.id, createCloseSalesDayDto);
  }
}

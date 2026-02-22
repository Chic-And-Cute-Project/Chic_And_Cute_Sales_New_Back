import {
  BadRequestException,
  Body,
  Controller, Delete,
  Get,
  Param, ParseDatePipe,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
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

  @Get('branch-date/:branchId/:minDate/:maxDate')
  getAllByBranchAndDate(@Param('branchId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) branchId: number, @Param('minDate', new ParseDatePipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser una fecha") })) minDate: Date, @Param('maxDate', new ParseDatePipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser una fecha") })) maxDate: Date) {
    return this.closeSalesDayService.findAllByBranchAndDate(branchId, minDate, maxDate);
  }

  @Get('my-branch-date/:minDate/:maxDate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  getAllByMyBranchAndDate(@Request() req: any, @Param('minDate', new ParseDatePipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser una fecha") })) minDate: Date, @Param('maxDate', new ParseDatePipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser una fecha") })) maxDate: Date) {
    return this.closeSalesDayService.findAllByMyBranchAndDate(req.user.id, minDate, maxDate);
  }

  @Delete(':id')
  delete(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.closeSalesDayService.delete(id);
  }
}

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param, ParseDatePipe,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {SalesService} from "./sales.service";
import {CreateSaleDto} from "./dto/create-sale.dto";
import {JwtAuthGuard} from "../../security/jwt-auth.guard";
import {ApiBearerAuth} from "@nestjs/swagger";

@Controller('sales')
export class SalesController {

  constructor(private readonly salesService: SalesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createSaleDto: CreateSaleDto, @Request() req: any) {
    return this.salesService.create(req.user.id, createSaleDto);
  }

  @Get('branch-date/:branchId/:date')
  getAllByBranchAndDate(@Param('branchId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) branchId: number, @Param('date', new ParseDatePipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser una fecha") })) date: Date) {
    return this.salesService.findAllByBranchAndDate(branchId, date);
  }

  @Get('my-branch-date/:date')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  getAllByMyBranchAndDate(@Request() req: any, @Param('date', new ParseDatePipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser una fecha") })) date: Date) {
    return this.salesService.findAllByMyBranchAndDate(req.user.id, date);
  }

  @Get('admin-report/:userId/:branchId/:minDate/:maxDate')
  getAllByAdminReport(@Param('userId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) userId: number, @Param('branchId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) branchId: number, @Param('minDate', new ParseDatePipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser una fecha") })) minDate: Date, @Param('maxDate', new ParseDatePipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser una fecha") })) maxDate: Date) {
    return this.salesService.findAllByAdminReport(userId, branchId, minDate, maxDate);
  }

  @Get('my-report/:minDate/:maxDate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  getAllByMyReport(@Request() req: any, @Param('minDate', new ParseDatePipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser una fecha") })) minDate: Date, @Param('maxDate', new ParseDatePipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser una fecha") })) maxDate: Date) {
    return this.salesService.findAllByMyReport(req.user.id, minDate, maxDate);
  }
}

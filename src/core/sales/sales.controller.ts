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
  @UsePipes(new ValidationPipe({ whitelist: true }))
  getAllByMyBranchAndDate(@Request() req: any, @Param('date', new ParseDatePipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser una fecha") })) date: Date) {
    return this.salesService.findAllByMyBranchAndDate(req.user.id, date);
  }
}

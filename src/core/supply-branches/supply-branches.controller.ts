import {
  BadRequestException,
  Body,
  Controller, Get,
  Param, ParseDatePipe,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {SupplyBranchesService} from "./supply-branches.service";
import {JwtAuthGuard} from "../../security/jwt-auth.guard";
import {ApiBearerAuth} from "@nestjs/swagger";
import {CreateSupplyBranchDto} from "./dto/create-supply-branch.dto";

@Controller('supply-branches')
export class SupplyBranchesController {

  constructor(private readonly supplyBranchesService: SupplyBranchesService) {}

  @Post('add')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  addInventory(@Body() createSupplyBranchDto: CreateSupplyBranchDto, @Request() req: any) {
    return this.supplyBranchesService.addInventory(req.user.id, createSupplyBranchDto);
  }

  @Post('take')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  takeInventory(@Body() createSupplyBranchDto: CreateSupplyBranchDto, @Request() req: any) {
    return this.supplyBranchesService.takeInventory(req.user.id, createSupplyBranchDto);
  }

  @Get('branch-dates/:branchId/:minDate/:maxDate')
  getAllByBranchAndDates(@Param('branchId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) branchId: number, @Param('minDate', new ParseDatePipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser una fecha") })) minDate: Date, @Param('maxDate', new ParseDatePipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser una fecha") })) maxDate: Date) {
    return this.supplyBranchesService.findAllByBranchAndDates(branchId, minDate, maxDate);
  }
}

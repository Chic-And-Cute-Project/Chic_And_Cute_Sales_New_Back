import {Body, Controller, Post, Request, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
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
}

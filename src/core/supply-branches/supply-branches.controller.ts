import {Body, Controller, Post, Request, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
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
}

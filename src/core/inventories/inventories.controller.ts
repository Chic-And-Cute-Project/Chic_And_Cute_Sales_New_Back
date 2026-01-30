import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post, Put, Request, UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {InventoriesService} from "./inventories.service";
import {CreateInventoryDto} from "./dto/create-inventory.dto";
import {UpdateInventoryDto} from "./dto/update-inventory.dto";
import {JwtAuthGuard} from "../../security/jwt-auth.guard";
import {ApiBearerAuth} from "@nestjs/swagger";

@Controller('inventories')
export class InventoriesController {

  constructor(private readonly inventoriesService: InventoriesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createBranchDto: CreateInventoryDto) {
    return this.inventoriesService.create(createBranchDto);
  }

  @Get('branch/:branchId/:page')
  getAllByBranchAndPage(@Param('branchId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) branchId: number, @Param('page', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) page: number) {
    return this.inventoriesService.findAllByBranchAndPage(branchId, page);
  }

  @Get('my-branch/:page')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  getAllByMyBranchAndPage(@Request() req: any, @Param('page', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) page: number) {
    return this.inventoriesService.findAllByMyBranchAndPage(req.user.id, page);
  }

  @Get('count/branch/:branchId')
  countByBranch(@Param('branchId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) branchId: number) {
    return this.inventoriesService.countInventoriesByBranch(branchId);
  }

  @Get('count/my-branch')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  countByMyBranch(@Request() req: any) {
    return this.inventoriesService.countInventoriesByMyBranch(req.user.id);
  }

  @Get('search/:code/:branchId/:page')
  searchInventoriesByBranchAndPage(@Param('code') code: string, @Param('branchId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) branchId: number, @Param('page', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) page: number) {
    return this.inventoriesService.searchInventoryByBranchAndPage(code, branchId, page);
  }

  @Get('my-search/:code/:page')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  searchInventoriesByMyBranchAndPage(@Request() req: any, @Param('code') code: string, @Param('page', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) page: number) {
    return this.inventoriesService.searchInventoryByMyBranchAndPage(code, req.user.id, page);
  }

  @Get('count/code/:code/:branchId')
  countByBranchAndProductCode(@Param('code') code: string, @Param('branchId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) branchId: number) {
    return this.inventoriesService.countInventoriesByBranchAndCode(code, branchId);
  }

  @Get('my-count/code/:code')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  countByMyBranchAndProductCode(@Request() req: any, @Param('code') code: string) {
    return this.inventoriesService.countInventoriesByMyBranchAndCode(code, req.user.id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number, @Body() updateInventoryDto: UpdateInventoryDto) {
    return this.inventoriesService.update(id, updateInventoryDto);
  }
}

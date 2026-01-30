import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param, ParseBoolPipe,
  ParseIntPipe,
  Post, Put, Query, Request, UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {InventoriesService} from "./inventories.service";
import {CreateInventoryDto} from "./dto/create-inventory.dto";
import {UpdateInventoryDto} from "./dto/update-inventory.dto";
import {JwtAuthGuard} from "../../security/jwt-auth.guard";
import {ApiBearerAuth, ApiQuery} from "@nestjs/swagger";

@Controller('inventories')
export class InventoriesController {

  constructor(private readonly inventoriesService: InventoriesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createBranchDto: CreateInventoryDto) {
    return this.inventoriesService.create(createBranchDto);
  }

  @Get('branch/:branchId/:page')
  @ApiQuery({ name: 'available', type: Boolean, required: false })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  getAllByBranchAndPage(@Param('branchId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) branchId: number, @Param('page', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) page: number, @Query('available', new ParseBoolPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un booleano"), optional: true })) available: boolean) {
    return this.inventoriesService.findAllByBranchAndPage(branchId, page, available);
  }

  @Get('my-branch/:page')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiQuery({ name: 'available', type: Boolean, required: false })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  getAllByMyBranchAndPage(@Request() req: any, @Param('page', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) page: number, @Query('available', new ParseBoolPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un booleano"), optional: true })) available: boolean) {
    return this.inventoriesService.findAllByMyBranchAndPage(req.user.id, page, available);
  }

  @Get('count/branch/:branchId')
  @ApiQuery({ name: 'available', type: Boolean, required: false })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  countByBranch(@Param('branchId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) branchId: number, @Query('available', new ParseBoolPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un booleano"), optional: true })) available: boolean) {
    return this.inventoriesService.countInventoriesByBranch(branchId, available);
  }

  @Get('count/my-branch')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiQuery({ name: 'available', type: Boolean, required: false })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  countByMyBranch(@Request() req: any, @Query('available', new ParseBoolPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un booleano"), optional: true })) available: boolean) {
    return this.inventoriesService.countInventoriesByMyBranch(req.user.id, available);
  }

  @Get('search/:code/:branchId/:page')
  @ApiQuery({ name: 'available', type: Boolean, required: false })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  searchInventoriesByBranchAndPage(@Param('code') code: string, @Param('branchId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) branchId: number, @Param('page', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) page: number, @Query('available', new ParseBoolPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un booleano"), optional: true })) available: boolean) {
    return this.inventoriesService.searchInventoryByBranchAndPage(code, branchId, page, available);
  }

  @Get('my-search/:code/:page')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiQuery({ name: 'available', type: Boolean, required: false })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  searchInventoriesByMyBranchAndPage(@Request() req: any, @Param('code') code: string, @Param('page', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) page: number, @Query('available', new ParseBoolPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un booleano"), optional: true })) available: boolean) {
    return this.inventoriesService.searchInventoryByMyBranchAndPage(code, req.user.id, page, available);
  }

  @Get('count/code/:code/:branchId')
  @ApiQuery({ name: 'available', type: Boolean, required: false })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  countByBranchAndProductCode(@Param('code') code: string, @Param('branchId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) branchId: number, @Query('available', new ParseBoolPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un booleano"), optional: true })) available: boolean) {
    return this.inventoriesService.countInventoriesByBranchAndCode(code, branchId, available);
  }

  @Get('my-count/code/:code')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiQuery({ name: 'available', type: Boolean, required: false })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  countByMyBranchAndProductCode(@Request() req: any, @Param('code') code: string, @Query('available', new ParseBoolPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un booleano"), optional: true })) available: boolean) {
    return this.inventoriesService.countInventoriesByMyBranchAndCode(code, req.user.id, available);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number, @Body() updateInventoryDto: UpdateInventoryDto) {
    return this.inventoriesService.update(id, updateInventoryDto);
  }
}

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post, Put,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {BranchesService} from "./branches.service";
import {CreateBranchDto} from "./dto/create-branch.dto";
import {UpdateBranchDto} from "./dto/update-branch.dto";

@Controller('branches')
export class BranchesController {

  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchesService.create(createBranchDto);
  }

  @Get(':id')
  getById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.branchesService.findById(id);
  }

  @Get()
  getAll() {
    return this.branchesService.findAll();
  }

  @Get('name/active')
  getAllByActive() {
    return this.branchesService.findAllByActive();
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchesService.update(id, updateBranchDto);
  }
}

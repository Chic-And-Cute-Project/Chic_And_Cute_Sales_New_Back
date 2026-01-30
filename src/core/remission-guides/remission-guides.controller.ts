import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post, Request, UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {RemissionGuidesService} from "./remission-guides.service";
import {CreateRemissionGuideDto} from "./dto/create-remission-guide.dto";
import {JwtAuthGuard} from "../../security/jwt-auth.guard";
import {ApiBearerAuth} from "@nestjs/swagger";

@Controller('remission-guides')
export class RemissionGuidesController {

  constructor(private readonly remissionGuidesService: RemissionGuidesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createRemissionGuideDto: CreateRemissionGuideDto) {
    return this.remissionGuidesService.create(createRemissionGuideDto);
  }

  @Get()
  getAll() {
    return this.remissionGuidesService.findAll();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  myObject(@Request() req: any) {
    return this.remissionGuidesService.findByMyBranch(req.user.id);
  }

  @Get('confirm/:id')
  confirm(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.remissionGuidesService.confirm(id);
  }
}

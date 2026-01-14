import {Body, Controller, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {RemissionGuidesService} from "./remission-guides.service";
import {CreateRemissionGuideDto} from "./dto/create-remission-guide.dto";

@Controller('remission-guides')
export class RemissionGuidesController {

  constructor(private readonly remissionGuidesService: RemissionGuidesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createRemissionGuideDto: CreateRemissionGuideDto) {
    return this.remissionGuidesService.create(createRemissionGuideDto);
  }
}

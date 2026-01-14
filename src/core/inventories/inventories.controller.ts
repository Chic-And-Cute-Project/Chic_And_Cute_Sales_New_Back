import {Body, Controller, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {InventoriesService} from "./inventories.service";
import {CreateInventoryDto} from "./dto/create-inventory.dto";

@Controller('inventories')
export class InventoriesController {

  constructor(private readonly inventoriesService: InventoriesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createBranchDto: CreateInventoryDto) {
    return this.inventoriesService.create(createBranchDto);
  }
}

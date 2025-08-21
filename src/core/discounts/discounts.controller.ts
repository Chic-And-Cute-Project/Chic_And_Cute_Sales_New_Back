import {Body, Controller, Get, Post, Put, Query, UsePipes, ValidationPipe} from '@nestjs/common';
import {DiscountsService} from "./discounts.service";
import {CreateDiscountDto} from "./dto/create-discount.dto";
import {ApiQuery} from "@nestjs/swagger";
import {UpdateDiscountDto} from "./dto/update-discount.dto";
import {UpdateDiscountQueryDto} from "./dto/update-discount-query.dto";

@Controller('discounts')
export class DiscountsController {

    constructor(private readonly discountService: DiscountsService) {}

    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true }))
    create(@Body() createDiscountDto: CreateDiscountDto) {
        return this.discountService.createDiscount(createDiscountDto);
    }

    @Get('list')
    getAll() {
        return this.discountService.findAll();
    }

    @Put()
    @ApiQuery({ name: 'id', type: Number, required: true })
    @UsePipes(new ValidationPipe({ whitelist: true }))
    update(@Query() query: UpdateDiscountQueryDto, @Body() updateDiscountDto: UpdateDiscountDto) {
        return this.discountService.update(query.id, updateDiscountDto);
    }
}

import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {DiscountsService} from "./discounts.service";
import {CreateDiscountDto} from "./dto/create-discount.dto";
import {UpdateDiscountDto} from "./dto/update-discount.dto";

@Controller('discounts')
export class DiscountsController {

    constructor(private readonly discountService: DiscountsService) {}

    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true }))
    create(@Body() createDiscountDto: CreateDiscountDto) {
        return this.discountService.create(createDiscountDto);
    }

    @Get()
    getAll() {
        return this.discountService.findAll();
    }

    @Put(':id')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    update(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number, @Body() updateDiscountDto: UpdateDiscountDto) {
        return this.discountService.update(id, updateDiscountDto);
    }
}

import {Body, Controller, Delete, Get, Post, Put, Query, UsePipes, ValidationPipe} from '@nestjs/common';
import {ProductsService} from "./products.service";
import {CreateProductDto} from "./dto/create-product.dto";
import {ApiQuery} from "@nestjs/swagger";
import {UpdateProductDto} from "./dto/update-product.dto";
import {UpdateProductQueryDto} from "./dto/update-product-query.dto";
import {DeleteProductQueryDto} from "./dto/delete-product-query.dto";
import {PaginationDto} from "./dto/pagination.dto";
import {SearchProductQueryDto} from "./dto/search-product-query.dto";

@Controller('products')
export class ProductsController {

    constructor(private readonly productsService: ProductsService) {}

    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true }))
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Get('listByPage')
    @ApiQuery({ name: 'page', type: Number, required: true })
    @UsePipes(new ValidationPipe({ whitelist: true }))
    getAllByPage(@Query() paginationDto: PaginationDto) {
        return this.productsService.findAllByPage(paginationDto);
    }

    @Get('code')
    @ApiQuery({ name: 'code', type: String, required: true })
    getByCode(@Query('code') code: string) {
        return this.productsService.findByCode(code);
    }

    @Get('count')
    countProducts() {
        return this.productsService.countProducts();
    }

    @Get('search')
    @ApiQuery({ name: 'page', type: Number, required: true })
    @ApiQuery({ name: 'name', type: String, required: true })
    @UsePipes(new ValidationPipe({ whitelist: true }))
    searchProduct(@Query() searchProductQueryDto: SearchProductQueryDto) {
        return this.productsService.searchProduct(searchProductQueryDto);
    }

    @Get('countByProduct')
    @ApiQuery({ name: 'name', type: String, required: true })
    countProductByName(@Query('name') name: string) {
        return this.productsService.countProductsByName(name);
    }

    @Put()
    @ApiQuery({ name: 'id', type: Number, required: true })
    @UsePipes(new ValidationPipe({ whitelist: true }))
    update(@Query() query: UpdateProductQueryDto, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(query.id, updateProductDto);
    }

    @Delete()
    @ApiQuery({ name: 'id', type: Number, required: true })
    delete(@Query() query: DeleteProductQueryDto) {
        return this.productsService.delete(query.id);
    }
}

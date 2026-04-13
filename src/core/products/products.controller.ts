import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    UploadedFile,
    UseInterceptors,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {ProductsService} from "./products.service";
import {CreateProductDto} from "./dto/create-product.dto";
import {UpdateProductDto} from "./dto/update-product.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import {ApiConsumes} from "@nestjs/swagger";
import {ImportProductsDto} from "./dto/import-products.dto";

@Controller('products')
export class ProductsController {

    constructor(private readonly productsService: ProductsService) {}

    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true }))
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Post('import')
    @ApiConsumes('multipart/form-data')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
    importFromCsv(@UploadedFile() file: Express.Multer.File, @Body() _importProductsDto: ImportProductsDto) {
        return this.productsService.importFromCsv(file);
    }

    @Get('page/:page')
    getAllByPage(@Param('page', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) page: number) {
        return this.productsService.findAllByPage(page);
    }

    @Get('count')
    count() {
        return this.productsService.count();
    }

    @Get('search/:code/:page')
    searchProductByPage(@Param('code') code: string, @Param('page', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) page: number) {
        return this.productsService.searchProductByPage(code, page);
    }

    @Get('count/code/:code')
    countByProductCode(@Param('code') code: string) {
        return this.productsService.countProductsByCode(code);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    update(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    delete(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
        return this.productsService.delete(id);
    }
}

import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ILike, Repository} from "typeorm";
import {Product} from "./products.entity";
import {CreateProductDto} from "./dto/create-product.dto";
import {PaginationDto} from "./dto/pagination.dto";
import {SearchProductQueryDto} from "./dto/search-product-query.dto";
import {UpdateProductDto} from "./dto/update-product.dto";

@Injectable()
export class ProductsService {

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    async create(createProductDto: CreateProductDto) {
        const productExisting = await this.productRepository.findOneBy({
            code: createProductDto.code
        });

        if (productExisting) {
            throw new BadRequestException({
                message: ['El producto ya existe.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        const newProduct = this.productRepository.create({
            code: createProductDto.code,
            price: createProductDto.price
        });
        const savedProduct = await this.productRepository.save(newProduct);

        return { product: savedProduct };
    }

    async findById(id: number) {
        const product = await this.productRepository.findOneBy({
            id
        });
        if (!product) {
            throw new NotFoundException({
                message: ['Producto no encontrado.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        return product;
    }

    async findAllByPage(paginationDto: PaginationDto) {
        const { page } = paginationDto;

        const products = await this.productRepository.find({
            skip: (page - 1) * 10,
            take: 10
        });
        if (!products.length) {
            throw new NotFoundException({
                message: ['Productos no encontrados.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        return products;
    }

    async findByCode(code: string) {
        if (!code) {
            throw new NotFoundException({
                message: ['Producto no encontrado.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        const product = await this.productRepository.findOne({
            where: { code }
        });
        if (!product) {
            throw new NotFoundException({
                message: ['Producto no encontrado.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        return product;
    }

    async searchProduct(searchProductQueryDto: SearchProductQueryDto) {
        const { page, name } = searchProductQueryDto;

        const products = await this.productRepository.find({
            skip: (page - 1) * 10,
            take: 10,
            where: {
                code: ILike(`%${name}%`)
            }
        });
        if (!products.length) {
            throw new NotFoundException({
                message: ['Productos no encontrados.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        return products;
    }

    async countProducts() {
        const count = await this.productRepository.count();
        if (!count || count === 0) {
            throw new NotFoundException({
                message: ['Productos no encontrados.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        return {
            count: count
        };
    }

    async countProductsByName(name: string) {
        const count = await this.productRepository.count({
            where: {
                code: ILike(`%${name}%`)
            }
        });
        if (!count || count === 0) {
            throw new NotFoundException({
                message: ['Productos no encontrados.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        return {
            count: count
        };
    }

    async update(id: number, updateProductDto: UpdateProductDto) {
        const product = await this.productRepository.findOneBy({
            id
        });
        if (!product) {
            throw new NotFoundException({
                message: ['Producto no encontrado.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        await this.productRepository.update(id, updateProductDto);

        return this.findById(id);
    }

    async delete(id: number) {
        const result = await this.productRepository.softDelete(id);

        if (result.affected === 0) {
            throw new NotFoundException({
                message: ['Producto no encontrado.'],
                error: 'Not Found',
                statusCode: 404
            });
        } else {
            return {
                message: 'Producto eliminado correctamente.'
            }
        }
    }
}

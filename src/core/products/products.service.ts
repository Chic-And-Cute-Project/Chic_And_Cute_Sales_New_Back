import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {DataSource, ILike, Not, Repository} from "typeorm";
import {Product} from "./products.entity";
import {CreateProductDto} from "./dto/create-product.dto";
import {UpdateProductDto} from "./dto/update-product.dto";
import {Inventory} from "../inventories/inventories.entity";
import {Branch} from "../branches/branches.entity";

@Injectable()
export class ProductsService {

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Branch)
        private readonly branchRepository: Repository<Branch>,
        private dataSource: DataSource
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

        const branches = await this.branchRepository.find({
            where: { name: Not('Sin sede asignada') }
        });

        const savedProduct = await this.dataSource.transaction(async manager => {
            const productRepository = manager.getRepository(Product);
            const inventoryRepository = manager.getRepository(Inventory);

            const newProduct = productRepository.create({
                code: createProductDto.code,
                price: createProductDto.price
            });
            const savedProduct = await productRepository.save(newProduct);

            for (const branch of branches) {
                const newInventory = inventoryRepository.create({
                    quantity: 0,
                    product: savedProduct,
                    branch: branch
                });
                await inventoryRepository.save(newInventory);
            }

            return savedProduct;
        });

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

        return { product };
    }

    async findAllByPage(page: number) {
        const products = await this.productRepository.find({
            skip: page * 10,
            take: 10
        });
        if (products.length === 0) {
            throw new NotFoundException({
                message: ['Productos no encontrados.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        return { products };
    }

    async searchProductByPage(code: string, page: number) {
        const products = await this.productRepository.find({
            skip: page * 10,
            take: 10,
            where: {
                code: ILike(`%${code}%`)
            }
        });
        if (products.length === 0) {
            throw new NotFoundException({
                message: ['Productos no encontrados.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        return { products };
    }

    async count() {
        const count = await this.productRepository.count();
        if (count === 0) {
            throw new NotFoundException({
                message: ['Productos no encontrados.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        return { count };
    }

    async countProductsByCode(code: string) {
        const count = await this.productRepository.count({
            where: {
                code: ILike(`%${code}%`)
            }
        });
        if (count === 0) {
            throw new NotFoundException({
                message: ['Productos no encontrados.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        return { count };
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

        if (updateProductDto.code !== product.code) {
            const productExisting = await this.productRepository.findOneBy({
                code: updateProductDto.code
            });
            if (productExisting) {
                throw new BadRequestException({
                    message: ['El nuevo código ingresado ya existe.'],
                    error: "Bad Request",
                    statusCode: 400
                });
            }
        }

        await this.productRepository.update(id, updateProductDto);

        return this.findById(id);
    }

    async delete(id: number) {
        const result = await this.dataSource.transaction(async manager => {
            const productRepository = manager.getRepository(Product);
            const inventoryRepository = manager.getRepository(Inventory);

            const result = await productRepository.softDelete(id);

            if (result.affected === 0) {
                throw new NotFoundException({
                    message: ['Producto no encontrado.'],
                    error: 'Not Found',
                    statusCode: 404
                });
            }

            const resultInventories = await inventoryRepository.softDelete({
                product: { id}
            });

            if (resultInventories.affected === 0) {
                throw new NotFoundException({
                    message: ['Inventarios no encontrados.'],
                    error: 'Not Found',
                    statusCode: 404
                });
            }

            return {
                message: 'Producto eliminado correctamente.'
            };
        });

        return { result: result.message }
    }
}

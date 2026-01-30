import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {DataSource, Repository} from "typeorm";
import {RemissionGuide} from "./entities/remission-guides.entity";
import {Branch} from "../branches/branches.entity";
import {Product} from "../products/products.entity";
import {CreateRemissionGuideDto} from "./dto/create-remission-guide.dto";
import {Inventory} from "../inventories/inventories.entity";
import {User} from "../users/users.entity";

@Injectable()
export class RemissionGuidesService {

    constructor(
        @InjectRepository(RemissionGuide)
        private readonly remissionGuideRepository: Repository<RemissionGuide>,
        @InjectRepository(Branch)
        private readonly branchRepository: Repository<Branch>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private dataSource: DataSource
    ) {}

    async create(createRemissionGuideDto: CreateRemissionGuideDto) {
        const branchFrom = await this.branchRepository.findOneBy({
            id: createRemissionGuideDto.branchFromId
        });

        if (!branchFrom) {
            throw new BadRequestException({
                message: ['Sucursal de origen no encontrada.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        const branchTo = await this.branchRepository.findOneBy({
            id: createRemissionGuideDto.branchToId
        });

        if (!branchTo) {
            throw new BadRequestException({
                message: ['Sucursal de destino no encontrada.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        for (const productDto of createRemissionGuideDto.products) {
            const product = await this.productRepository.findOneBy({
                id: productDto.productId
            });

            if (!product) {
                throw new BadRequestException({
                    message: [`Producto no encontrado`],
                    error: "Bad Request",
                    statusCode: 400
                });
            }
        }

        const newRemissionGuide = this.remissionGuideRepository.create({
            identifier: createRemissionGuideDto.identifier,
            date: createRemissionGuideDto.date,
            branchFrom: branchFrom,
            branchTo: branchTo,
            status: "Pendiente",
            products: createRemissionGuideDto.products.map(productDto => ({
                quantity: productDto.quantity,
                product: { id: productDto.productId }
            }))
        });
        const savedRemissionGuide = await this.remissionGuideRepository.save(newRemissionGuide);

        return { remissionGuide: savedRemissionGuide };
    }

    async findById(id: number) {
        const remissionGuide = await this.remissionGuideRepository.findOne({
            where: { id },
            relations: ['branchFrom', 'branchTo', 'products', 'products.product'],
        });
        if (!remissionGuide) {
            throw new NotFoundException({
                message: ['Guía de remisión no encontrada.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        return { remissionGuide };
    }

    async findAll() {
        const remissionGuides = await this.remissionGuideRepository.find({
            relations: ['branchFrom', 'branchTo', 'products', 'products.product' ],
        });

        if (remissionGuides.length === 0) {
            throw new NotFoundException({
                message: ['Guías de remisión no encontradas.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        return { remissionGuides };
    }

    async findByMyBranch(userId: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['branch']
        });
        if (!user) {
            throw new NotFoundException({
                message: ['Usuario no encontrado.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        if (user.branch.name === 'Sin sede asignada') {
            throw new BadRequestException({
                message: ['No tiene asignada una sucursal.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        const remissionGuides = await this.remissionGuideRepository.find({
            where: { branchTo: { id: user.branch.id } },
            relations: ['branchFrom', 'branchTo', 'products', 'products.product' ],
        });

        if (remissionGuides.length === 0) {
            throw new NotFoundException({
                message: ['Guías de remisión no encontradas.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        return { remissionGuides };
    }

    async confirm(id: number) {
        const remissionGuide = await this.remissionGuideRepository.findOne({
            where: { id },
            relations: ['branchFrom', 'branchTo', 'products', 'products.product'],
        });

        if (!remissionGuide) {
            throw new NotFoundException({
                message: ['Guía de remisión no encontrada.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        await this.dataSource.transaction(async manager => {
            const remissionGuideRepository = manager.getRepository(RemissionGuide);
            const inventoryRepository = manager.getRepository(Inventory);

            for (const remissionGuideProduct of remissionGuide.products) {
                const inventoryFrom = await inventoryRepository.findOneBy({
                    product: { id: remissionGuideProduct.product.id },
                    branch: { id: remissionGuide.branchFrom.id }
                });
                if (!inventoryFrom) {
                    throw new NotFoundException({
                        message: ['Inventario origen no encontrado.'],
                        error: 'Not Found',
                        statusCode: 404
                    });
                }

                const inventoryTo = await inventoryRepository.findOneBy({
                    product: { id: remissionGuideProduct.product.id },
                    branch: { id: remissionGuide.branchTo.id }
                });
                if (!inventoryTo) {
                    throw new NotFoundException({
                        message: ['Inventario destino no encontrado.'],
                        error: 'Not Found',
                        statusCode: 404
                    });
                }

                inventoryFrom.quantity -= remissionGuideProduct.quantity;
                inventoryTo.quantity += remissionGuideProduct.quantity;

                if (inventoryFrom.quantity < 0) {
                    throw new BadRequestException({
                        message: ['No hay suficientes productos en el inventario origen.'],
                        error: "Bad Request",
                        statusCode: 400
                    });
                }

                await inventoryRepository.update(inventoryFrom.id, { quantity: inventoryFrom.quantity });
                await inventoryRepository.update(inventoryTo.id, { quantity: inventoryTo.quantity });
            }

            await remissionGuideRepository.update(id, { status: "Aceptada" });
        });

        return this.findById(remissionGuide.id);
    }
}

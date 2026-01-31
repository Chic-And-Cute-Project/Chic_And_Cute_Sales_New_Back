import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {DataSource, Repository} from "typeorm";
import {Sale} from "./entities/sales.entity";
import {Branch} from "../branches/branches.entity";
import {Product} from "../products/products.entity";
import {User} from "../users/users.entity";
import {CreateSaleDto} from "./dto/create-sale.dto";
import {Inventory} from "../inventories/inventories.entity";

@Injectable()
export class SalesService {

    constructor(
        @InjectRepository(Sale)
        private readonly saleRepository: Repository<Sale>,
        @InjectRepository(Branch)
        private readonly branchRepository: Repository<Branch>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private dataSource: DataSource
    ) {}

    async create(userId: number, createSaleDto: CreateSaleDto) {
        const branch = await this.branchRepository.findOneBy({
            id: createSaleDto.branchId
        });

        if (!branch) {
            throw new BadRequestException({
                message: ['Sucursal no encontrada.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        const user = await this.userRepository.findOneBy({
            id: userId
        });

        if (!user) {
            throw new BadRequestException({
                message: ['Usuario no encontrado.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        for (const detailDto of createSaleDto.detail) {
            const product = await this.productRepository.findOneBy({
                id: detailDto.productId
            });

            if (!product) {
                throw new BadRequestException({
                    message: [`Producto no encontrado`],
                    error: "Bad Request",
                    statusCode: 400
                });
            }
        }

        const savedSale = await this.dataSource.transaction(async manager => {
            const saleRepository = manager.getRepository(Sale);
            const inventoryRepository = manager.getRepository(Inventory);

            const newSale = saleRepository.create({
                date: createSaleDto.date,
                branch: branch,
                user: user,
                detail: createSaleDto.detail.map(detailDto => ({
                    quantity: detailDto.quantity,
                    discount: detailDto.discount,
                    product: { id: detailDto.productId }
                })),
                paymentMethod: createSaleDto.payments.map(paymentDto => ({
                    type: paymentDto.type,
                    amount: paymentDto.amount
                }))
            });
            const savedSale = await saleRepository.save(newSale);

            for (const detailDto of createSaleDto.detail) {
                const inventory = await inventoryRepository.findOneBy({
                    product: { id: detailDto.productId },
                    branch: { id: branch.id }
                });
                if (!inventory) {
                    throw new NotFoundException({
                        message: ['Inventario no encontrado.'],
                        error: 'Not Found',
                        statusCode: 404
                    });
                }

                inventory.quantity -= detailDto.quantity;

                await inventoryRepository.update(inventory.id, { quantity: inventory.quantity });
            }

            return savedSale;
        });

        return { sale: savedSale };
    }
}

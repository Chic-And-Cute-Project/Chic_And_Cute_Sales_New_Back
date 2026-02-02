import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Between, DataSource, Repository} from "typeorm";
import {Sale} from "./entities/sales.entity";
import {Branch} from "../branches/branches.entity";
import {Product} from "../products/products.entity";
import {User} from "../users/users.entity";
import {CreateSaleDto} from "./dto/create-sale.dto";
import {Inventory} from "../inventories/inventories.entity";
import {PaymentType} from "./entities/sales-payment.entity";

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
                paymentMethod: createSaleDto.paymentMethod.map(paymentDto => ({
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

    async findAllByBranchAndDate(branchId: number, date: Date) {
        let nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        nextDay.setMilliseconds(nextDay.getMilliseconds() - 1);
        const sales = await this.saleRepository.find({
            where: {
                branch: { id: branchId },
                date: Between(date, nextDay)
            },
            relations: ['detail', 'detail.product', 'paymentMethod']
        });
        if (sales.length === 0) {
            throw new NotFoundException({
                message: ['Ventas no encontradas.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        let cashAmount = 0;
        let cardAmount = 0;
        let cashCount = 0;
        let cardCount = 0;

        for (const sale of sales) {
            for (const payment of sale.paymentMethod) {
                if (payment.type === PaymentType.EFECTIVO) {
                    cashAmount += Number(payment.amount);
                    cashCount++;
                } else {
                    cardAmount += Number(payment.amount);
                    cardCount++;
                }
            }
        }

        return {
            sales,
            cashAmount,
            cardAmount,
            cashCount,
            cardCount
        };
    }

    async findAllByMyBranchAndDate(userId: number, date: Date) {
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

        return this.findAllByBranchAndDate(user.branch.id, date);
    }

    async findAllByAdminReport(userId: number, branchId: number, minDate: Date, maxDate: Date) {
        maxDate.setMilliseconds(maxDate.getMilliseconds() - 1);
        const sales = await this.saleRepository.find({
            where: {
                user: { id: userId },
                branch: { id: branchId },
                date: Between(minDate, maxDate)
            },
            relations: ['detail', 'detail.product', 'paymentMethod']
        });
        if (sales.length === 0) {
            throw new NotFoundException({
                message: ['Ventas no encontradas.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        let cashAmount = 0;
        let cardAmount = 0;

        const aggregatedDetailsMap = new Map<
          number,
          {
              product: Product;
              quantity: number;
              finalPrice: number;
          }
        >();

        for (const sale of sales) {
            for (const saleDetail of sale.detail) {
                let price = saleDetail.quantity * Number(saleDetail.product.price);
                if (saleDetail.discount != null) {
                    price = price - (price * saleDetail.discount * 0.01);
                }
                const finalPrice = Number(price.toFixed(2));

                let existingDetail = aggregatedDetailsMap.get(saleDetail.id);
                if (existingDetail) {
                    existingDetail.quantity += saleDetail.quantity;
                    existingDetail.finalPrice += finalPrice;
                } else {
                    aggregatedDetailsMap.set(saleDetail.id, {
                        product: saleDetail.product,
                        quantity: saleDetail.quantity,
                        finalPrice
                    });
                }
            }
            for (const payment of sale.paymentMethod) {
                if (payment.type === PaymentType.EFECTIVO) {
                    cashAmount += Number(payment.amount);
                } else {
                    cardAmount += Number(payment.amount);
                }
            }
        }

        const saleDetails = Array.from(aggregatedDetailsMap.values());

        return {
            saleDetails,
            count: sales.length,
            cashAmount,
            cardAmount
        };
    }

    async findAllByMyReport(userId: number, minDate: Date, maxDate: Date) {
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

        return this.findAllByAdminReport(userId, user.branch.id, minDate, maxDate);
    }
}

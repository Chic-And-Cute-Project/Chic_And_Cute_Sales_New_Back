import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Sale} from "./entities/sales.entity";
import {Branch} from "../branches/branches.entity";
import {Product} from "../products/products.entity";
import {User} from "../users/users.entity";
import {CreateSaleDto} from "./dto/create-sale.dto";

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

        const newSale = this.saleRepository.create({
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
        const savedSale = await this.saleRepository.save(newSale);

        return { sale: savedSale };
    }
}

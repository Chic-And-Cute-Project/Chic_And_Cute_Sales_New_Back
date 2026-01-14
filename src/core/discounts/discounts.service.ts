import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Discount} from "./discounts.entity";
import {CreateDiscountDto} from "./dto/create-discount.dto";
import {Product} from "../products/products.entity";
import {UpdateDiscountDto} from "./dto/update-discount.dto";

@Injectable()
export class DiscountsService {

    constructor(
        @InjectRepository(Discount)
        private readonly discountRepository: Repository<Discount>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    async create(createDiscountDto: CreateDiscountDto) {
        const discountExisting = await this.discountRepository.findOne({
            where: { name: createDiscountDto.name,  quantity: createDiscountDto.quantity }
        });

        if (discountExisting) {
            throw new BadRequestException({
                message: ['El descuento ya existe.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        if (createDiscountDto.productId) {
            const product = await this.productRepository.findOneBy({
                id: createDiscountDto.productId
            });
            if (!product) {
                throw new BadRequestException({
                    message: ['El producto no existe.'],
                    error: "Bad Request",
                    statusCode: 400
                })
            }

            const newDiscount = this.discountRepository.create({
                name: createDiscountDto.name,
                quantity: createDiscountDto.quantity,
                product: product,
            });
            const savedDiscount = await this.discountRepository.save(newDiscount);

            return { discount: savedDiscount };
        } else {
            const newDiscount = this.discountRepository.create({
                name: createDiscountDto.name,
                quantity: createDiscountDto.quantity
            });
            const savedDiscount = await this.discountRepository.save(newDiscount);

            return { discount: savedDiscount };
        }
    }

    async findById(id: number) {
        const discount = await this.discountRepository.findOneBy({
            id
        });
        if (!discount) {
            throw new NotFoundException({
                message: ['Descuento no encontrado.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        return discount;
    }

    async findAll() {
        const discounts = await this.discountRepository.find();
        if (!discounts.length) {
            throw new BadRequestException({
                message: ['Descuentos no encontrados.'],
                error: "Not Found",
                statusCode: 404
            });
        }

        return discounts;
    }

    async update(id: number, updateDiscountDto: UpdateDiscountDto) {
        const discount = await this.discountRepository.findOneBy({
            id
        });
        if (!discount) {
            throw new BadRequestException({
                message: ['El descuento no existe.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        await this.discountRepository.update(id, updateDiscountDto);

        return this.findById(id);
    }
}

import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {RemissionGuide} from "./entities/remission-guides.entity";
import {Branch} from "../branches/branches.entity";
import {Product} from "../products/products.entity";
import {CreateRemissionGuideDto} from "./dto/create-remission-guide.dto";

@Injectable()
export class RemissionGuidesService {

    constructor(
        @InjectRepository(RemissionGuide)
        private readonly remissionGuideRepository: Repository<RemissionGuide>,
        @InjectRepository(Branch)
        private readonly branchRepository: Repository<Branch>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
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
}

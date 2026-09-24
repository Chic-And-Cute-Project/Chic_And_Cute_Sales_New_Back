import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {CustomReceipt} from "./entities/custom-receipt.entity";
import {Repository} from "typeorm";
import {CreateCustomReceiptDto} from "./dto/create-custom-receipt.dto";
import {Sale} from "../sales/entities/sales.entity";

@Injectable()
export class CustomReceiptsService {

    constructor(
        @InjectRepository(CustomReceipt)
        private readonly customReceiptRepository: Repository<CustomReceipt>,
        @InjectRepository(Sale)
        private readonly saleRepository: Repository<Sale>
    ) {}

    async create(createCustomReceiptDto: CreateCustomReceiptDto) {
        const sale = await this.saleRepository.findOneBy({
            id: createCustomReceiptDto.saleId
        });

        if (!sale) {
            throw new BadRequestException({
                message: ['Venta no encontrada.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        const customReceiptExisting = await this.customReceiptRepository.findOneBy([
            {
                sale: { id: createCustomReceiptDto.saleId }
            },
            {
                sequence: createCustomReceiptDto.sequence
            }
        ]);

        if (customReceiptExisting) {
            throw new BadRequestException({
                message: ['El recibo ya existe.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        const newCustomReceipt = this.customReceiptRepository.create({
            sequence: createCustomReceiptDto.sequence,
            name: createCustomReceiptDto.name,
            documentNumber: createCustomReceiptDto.documentNumber,
            phoneNumber: createCustomReceiptDto.phoneNumber,
            address: createCustomReceiptDto.address,
            district: createCustomReceiptDto.district,
            province: createCustomReceiptDto.province,
            sale
        });
        const savedCustomReceipt = await this.customReceiptRepository.save(newCustomReceipt);

        return { customReceipt: savedCustomReceipt }
    }
}

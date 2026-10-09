import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {CustomReceipt} from "./entities/custom-receipt.entity";
import {Repository} from "typeorm";
import {CreateCustomReceiptDto} from "./dto/create-custom-receipt.dto";
import {Sale} from "../sales/entities/sales.entity";
import * as ExcelJS from "exceljs";

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

    async findAll() {
        const customReceipts = await this.customReceiptRepository.find();

        if (customReceipts.length === 0) {
            throw new NotFoundException({
                message: ['No se encontraron recibos.'],
                error: "Not Found",
                statusCode: 404
            });
        }

        return { customReceipts };
    }

    async generateExcel() {
        const customReceipts = await this.customReceiptRepository.find();
        if (customReceipts.length === 0) {
            throw new NotFoundException({
                message: ['No se encontraron recibos.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Recibos');

        const data = customReceipts.map(customReceipt => ({
            sequence: customReceipt.sequence,
            name: customReceipt.name,
            documentNumber: customReceipt.documentNumber,
            phoneNumber: customReceipt.phoneNumber,
            address: customReceipt.address,
            district: customReceipt.district,
            province: customReceipt.province,
            createdAt: customReceipt.createdAt
        }));

        worksheet.columns = [
            { header: 'Serie', key: 'sequence', width: 15 },
            { header: 'Nombre', key: 'name', width: 40 },
            { header: 'Documento', key: 'documentNumber', width: 20 },
            { header: 'Teléfono', key: 'phoneNumber', width: 20 },
            { header: 'Dirección', key: 'address', width: 40 },
            { header: 'Distrito', key: 'district', width: 20 },
            { header: 'Provincia', key: 'province', width: 20 },
            { header: 'Fecha de creación', key: 'createdAt', width: 20 },
        ];

        worksheet.addRows(data);

        const buffer = await workbook.xlsx.writeBuffer();

        return { buffer };
    }
}

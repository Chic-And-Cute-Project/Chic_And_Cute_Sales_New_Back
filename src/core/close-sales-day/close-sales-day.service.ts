import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {CloseSalesDay} from "./entities/close-sales-day.entity";
import {Repository} from "typeorm";
import {Branch} from "../branches/branches.entity";
import {User} from "../users/users.entity";
import {Sale} from "../sales/entities/sales.entity";
import {CreateCloseSalesDayDto} from "./dto/create-close-sales-day.dto";

@Injectable()
export class CloseSalesDayService {

    constructor(
        @InjectRepository(CloseSalesDay)
        private readonly closeSalesDayRepository: Repository<CloseSalesDay>,
        @InjectRepository(Branch)
        private readonly branchRepository: Repository<Branch>,
        @InjectRepository(Sale)
        private readonly saleRepository: Repository<Sale>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(userId: number, createCloseSalesDayDto: CreateCloseSalesDayDto) {
        const branch = await this.branchRepository.findOneBy({
            id: createCloseSalesDayDto.branchId
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

        for (const salesDto of createCloseSalesDayDto.closeSalesDaySales) {
            const sale = await this.saleRepository.findOneBy({
                id: salesDto.saleId
            });

            if (!sale) {
                throw new BadRequestException({
                    message: [`Venta no encontrada`],
                    error: "Bad Request",
                    statusCode: 400
                });
            }
        }

        const newCloseSalesDay = this.closeSalesDayRepository.create({
            date: createCloseSalesDayDto.date,
            branch: branch,
            user: user,
            cashAmount: createCloseSalesDayDto.cashAmount,
            cardAmount: createCloseSalesDayDto.cardAmount,
            closeSalesDaySales: createCloseSalesDayDto.closeSalesDaySales.map(saleDto => ({
                sale: { id: saleDto.saleId }
            }))
        });
        const savedCloseSalesDay = await this.closeSalesDayRepository.save(newCloseSalesDay);

        return { closeSalesDay: savedCloseSalesDay };
    }
}

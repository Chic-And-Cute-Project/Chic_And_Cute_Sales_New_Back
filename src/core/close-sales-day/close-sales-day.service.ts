import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {CloseSalesDay} from "./entities/close-sales-day.entity";
import {Between, Repository} from "typeorm";
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

    async findAllByBranchAndDate(branchId: number, minDate: Date, maxDate: Date) {
        let fromDate = new Date(minDate);
        fromDate.setHours(0, 0, 0, 0);
        let toDate = new Date(maxDate);
        toDate.setHours(0, 0, 0, 0);
        toDate.setMilliseconds(toDate.getMilliseconds() - 1);
        const closeSalesDays = await this.closeSalesDayRepository.find({
            where: {
                branch: { id: branchId },
                date: Between(fromDate, toDate)
            },
            relations: ['user', 'closeSalesDaySales', 'closeSalesDaySales.sale', 'closeSalesDaySales.sale.detail', 'closeSalesDaySales.sale.detail.product', 'closeSalesDaySales.sale.paymentMethod']
        });
        if (closeSalesDays.length === 0) {
            throw new NotFoundException({
                message: ['Cierre de días no encontrados.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        return { closeSalesDays };
    }

    async findAllByMyBranchAndDate(userId: number, minDate: Date, maxDate: Date) {
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

        return this.findAllByBranchAndDate(user.branch.id, minDate, maxDate);
    }

    async delete(id: number) {
        const result = await this.closeSalesDayRepository.softDelete(id);

        if (result.affected === 0) {
            throw new NotFoundException({
                message: ['Producto no encontrado.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        return {
            message: 'Cierre de caja eliminado correctamente.'
        };
    }
}

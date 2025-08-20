import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Sale} from "./entities/sales.entity";

@Injectable()
export class SalesService {

    constructor(
        @InjectRepository(Sale)
        private readonly saleRepository: Repository<Sale>,
    ) {}
}

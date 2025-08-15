import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Discount} from "./discounts.entity";

@Injectable()
export class DiscountsService {

    constructor(
        @InjectRepository(Discount)
        private readonly discountRepository: Repository<Discount>,
    ) {}
}

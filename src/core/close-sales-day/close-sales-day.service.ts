import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {CloseSalesDay} from "./entities/close-sales-day.entity";
import {Repository} from "typeorm";

@Injectable()
export class CloseSalesDayService {

    constructor(
        @InjectRepository(CloseSalesDay)
        private readonly closeSalesDayRepository: Repository<CloseSalesDay>,
    ) {}
}

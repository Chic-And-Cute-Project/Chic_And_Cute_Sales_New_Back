import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {RemissionGuide} from "./entities/remission-guides.entity";

@Injectable()
export class RemissionGuidesService {

    constructor(
        @InjectRepository(RemissionGuide)
        private readonly remissionGuideRepository: Repository<RemissionGuide>,
    ) {}
}

import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Inventory} from "./inventories.entity";
import {CreateInventoryDto} from "./dto/create-inventory.dto";
import {Product} from "../products/products.entity";
import {Branch} from "../branches/branches.entity";

@Injectable()
export class InventoriesService {

    constructor(
        @InjectRepository(Inventory)
        private readonly inventoryRepository: Repository<Inventory>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Branch)
        private readonly branchRepository: Repository<Branch>,
    ) {}

    async create(createInventoryDto: CreateInventoryDto) {
        const inventoryExisting = await this.inventoryRepository.findOne({
            where: { branch: { id: createInventoryDto.branchId }, product: { id: createInventoryDto.productId } },
        });

        if (inventoryExisting) {
            throw new BadRequestException({
                message: ['La existencia del producto en la sucursal ya existe.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        const product = await this.productRepository.findOneBy({
            id: createInventoryDto.productId
        });

        if (!product) {
            throw new BadRequestException({
                message: ['Producto no encontrado.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        const branch = await this.branchRepository.findOneBy({
            id: createInventoryDto.branchId
        });

        if (!branch) {
            throw new BadRequestException({
                message: ['Sucursal no encontrada.'],
                error: "Bad Request",
                statusCode: 400
            });
        }

        const newInventory = this.inventoryRepository.create({
            quantity: 0,
            product: product,
            branch: branch,
        });
        const savedInventory = await this.inventoryRepository.save(newInventory);

        return { inventory: savedInventory };
    }
}

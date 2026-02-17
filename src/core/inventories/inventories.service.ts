import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ILike, MoreThan, Repository} from "typeorm";
import {Inventory} from "./inventories.entity";
import {CreateInventoryDto} from "./dto/create-inventory.dto";
import {Product} from "../products/products.entity";
import {Branch} from "../branches/branches.entity";
import {UpdateInventoryDto} from "./dto/update-inventory.dto";
import {User} from "../users/users.entity";

@Injectable()
export class InventoriesService {

    constructor(
        @InjectRepository(Inventory)
        private readonly inventoryRepository: Repository<Inventory>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Branch)
        private readonly branchRepository: Repository<Branch>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
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

    async findById(id: number) {
        const inventory = await this.inventoryRepository.findOneBy({
            id
        });
        if (!inventory) {
            throw new NotFoundException({
                message: ['Inventario no encontrado.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        return { inventory };
    }

    async findAllByBranch(branchId: number) {
        const inventories = await this.inventoryRepository.find({
            where: { branch: { id: branchId } },
            relations: ['product']
        });
        if (inventories.length === 0) {
            throw new NotFoundException({
                message: ['Inventarios no encontrados.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        return { inventories };
    }

    async findAllByBranchAndPage(branchId: number, page: number, available: boolean = false) {
        const inventories = await this.inventoryRepository.find({
            where: { branch: { id: branchId }, ...(available ? { quantity: MoreThan(0) } : {}) },
            relations: ['product'],
            skip: page * 10,
            take: 10
        });
        if (inventories.length === 0) {
            throw new NotFoundException({
                message: ['Inventarios no encontrados.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        return { inventories };
    }

    async findAllByMyBranchAndPage(userId: number, page: number, available: boolean = false) {
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

        return this.findAllByBranchAndPage(user.branch.id, page, available);
    }

    async searchInventoryByBranchAndPage(code: string, branchId: number, page: number, available: boolean = false) {
        const inventories = await this.inventoryRepository.find({
            where: { branch: { id: branchId }, product: { code: ILike(`%${code}%`) }, ...(available ? { quantity: MoreThan(0) } : {}) },
            relations: ['product'],
            skip: page * 10,
            take: 10
        });
        if (inventories.length === 0) {
            throw new NotFoundException({
                message: ['Inventarios no encontrados.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        return { inventories };
    }

    async searchInventoryByMyBranchAndPage(code: string, userId: number, page: number, available: boolean = false) {
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

        return this.searchInventoryByBranchAndPage(code, user.branch.id, page, available);
    }

    async countInventoriesByBranch(branchId: number, available: boolean = false) {
        const count = await this.inventoryRepository.count({
            where: { branch: { id: branchId }, ...(available ? { quantity: MoreThan(0) } : {}) },
        });
        if (count === 0) {
            throw new NotFoundException({
                message: ['Inventarios no encontrados.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        return { count };
    }

    async countInventoriesByMyBranch(userId: number, available: boolean = false) {
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

        return this.countInventoriesByBranch(user.branch.id, available);
    }

    async countInventoriesByBranchAndCode(code: string, branchId: number, available: boolean = false) {
        const count = await this.inventoryRepository.count({
            where: { branch: { id: branchId }, product: { code: ILike(`%${code}%`) }, ...(available ? { quantity: MoreThan(0) } : {}) },
        });
        if (count === 0) {
            throw new NotFoundException({
                message: ['Inventarios no encontrados.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        return { count };
    }

    async countInventoriesByMyBranchAndCode(code: string, userId: number, available: boolean = false) {
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

        return this.countInventoriesByBranchAndCode(code, user.branch.id, available);
    }

    async update(id: number, updateInventoryDto: UpdateInventoryDto) {
        const inventory = await this.inventoryRepository.findOneBy({
            id
        });
        if (!inventory) {
            throw new NotFoundException({
                message: ['Inventario no encontrado.'],
                error: 'Not Found',
                statusCode: 404
            });
        }

        await this.inventoryRepository.update(id, updateInventoryDto);

        return this.findById(id);
    }
}

import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Between, DataSource, Repository} from "typeorm";
import {SupplyBranch} from "./entities/supply-branch.entity";
import {Branch} from "../branches/branches.entity";
import {User} from "../users/users.entity";
import {CreateSupplyBranchDto} from "./dto/create-supply-branch.dto";
import {Inventory} from "../inventories/inventories.entity";

@Injectable()
export class SupplyBranchesService {

  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(SupplyBranch)
    private readonly supplyBranchRepository: Repository<SupplyBranch>,
    private dataSource: DataSource
  ) {}

  async addInventory(userId: number, createSupplyBranchDto: CreateSupplyBranchDto) {
    const branch = await this.branchRepository.findOneBy({
      id: createSupplyBranchDto.branchId
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

    const savedSupplyBranch = await this.dataSource.transaction(async manager => {
      const inventoryRepository = manager.getRepository(Inventory);
      const supplyBranchRepository = manager.getRepository(SupplyBranch);

      for (const supplyBranchProducts of createSupplyBranchDto.products) {
        const inventoryTo = await inventoryRepository.findOneBy({
          product: { id: supplyBranchProducts.productId },
          branch: { id: createSupplyBranchDto.branchId }
        });
        if (!inventoryTo) {
          throw new NotFoundException({
            message: ['Inventario destino no encontrado.'],
            error: 'Not Found',
            statusCode: 404
          });
        }

        inventoryTo.quantity += supplyBranchProducts.quantity;

        await inventoryRepository.update(inventoryTo.id, { quantity: inventoryTo.quantity });
      }

      const newRemissionGuide = supplyBranchRepository.create({
        date: createSupplyBranchDto.date,
        branch: branch,
        type: "Añadir",
        identifier: createSupplyBranchDto.identifier,
        products: createSupplyBranchDto.products.map(productDto => ({
          quantity: productDto.quantity,
          product: { id: productDto.productId }
        }))
      });
      return await supplyBranchRepository.save(newRemissionGuide);
    });

    return { supplyBranch: savedSupplyBranch };
  }

  async takeInventory(userId: number, createSupplyBranchDto: CreateSupplyBranchDto) {
    const branch = await this.branchRepository.findOneBy({
      id: createSupplyBranchDto.branchId
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

    const savedSupplyBranch = await this.dataSource.transaction(async manager => {
      const inventoryRepository = manager.getRepository(Inventory);
      const supplyBranchRepository = manager.getRepository(SupplyBranch);

      for (const supplyBranchProducts of createSupplyBranchDto.products) {
        const inventoryTo = await inventoryRepository.findOneBy({
          product: { id: supplyBranchProducts.productId },
          branch: { id: createSupplyBranchDto.branchId }
        });
        if (!inventoryTo) {
          throw new NotFoundException({
            message: ['Inventario destino no encontrado.'],
            error: 'Not Found',
            statusCode: 404
          });
        }

        inventoryTo.quantity -= supplyBranchProducts.quantity;

        if (inventoryTo.quantity < 0) {
          throw new BadRequestException({
            message: ['No hay suficientes productos en el inventario.'],
            error: "Bad Request",
            statusCode: 400
          });
        }

        await inventoryRepository.update(inventoryTo.id, { quantity: inventoryTo.quantity });
      }

      const newRemissionGuide = supplyBranchRepository.create({
        date: createSupplyBranchDto.date,
        branch: branch,
        type: "Quitar",
        identifier: createSupplyBranchDto.identifier,
        comment: createSupplyBranchDto.comment,
        products: createSupplyBranchDto.products.map(productDto => ({
          quantity: productDto.quantity,
          product: { id: productDto.productId }
        }))
      });
      return await supplyBranchRepository.save(newRemissionGuide);
    });

    return { supplyBranch: savedSupplyBranch };
  }

  async findAllByBranchAndDates(branchId: number, minDate: Date, maxDate: Date) {
    let fromDate = new Date(minDate);
    fromDate.setHours(0, 0, 0, 0);
    let toDate = new Date(maxDate);
    toDate.setHours(0, 0, 0, 0);
    toDate.setMilliseconds(toDate.getMilliseconds() - 1);

    const supplyBranches = await this.supplyBranchRepository.find({
      where: {
        branch: { id: branchId },
        date: Between(fromDate, toDate)
      },
      relations: ['products', 'products.product']
    });
    if (supplyBranches.length === 0) {
      throw new NotFoundException({
        message: ['Ingresos y consumos no encontrados.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { supplyBranches };
  }
}

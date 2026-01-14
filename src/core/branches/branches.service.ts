import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {Repository} from "typeorm";
import {Branch} from "./branches.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {UpdateBranchDto} from "./dto/update-branch.dto";
import {CreateBranchDto} from "./dto/create-branch.dto";

@Injectable()
export class BranchesService {

  constructor(
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>
  ) {}

  async create(createBranchDto: CreateBranchDto) {
    const branchExisting = await this.branchRepository.findOneBy({
      name: createBranchDto.name
    });

    if (branchExisting) {
      throw new BadRequestException({
        message: ['Sucursal ya existe.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const newBranch = this.branchRepository.create({
      name: createBranchDto.name
    });
    const savedBranch = await this.branchRepository.save(newBranch);

    return { branch: savedBranch };
  }

  async findAll() {
    const branches = await this.branchRepository.find();

    if (branches.length === 0) {
      throw new NotFoundException({
        message: ['Sucursales no encontradas.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { branches };
  }

  async findById(id: number) {
    const branch = await this.branchRepository.findOneBy({
      id
    });

    if (!branch) {
      throw new NotFoundException({
        message: ['Sucursal no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { branch };
  }

  async update(id: number, updateBranchDto: UpdateBranchDto) {
    const branch = await this.branchRepository.findOneBy({
      id
    });

    if (!branch) {
      throw new NotFoundException({
        message: ['Sucursal no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    await this.branchRepository.update(id, updateBranchDto);

    return this.findById(id);
  }
}

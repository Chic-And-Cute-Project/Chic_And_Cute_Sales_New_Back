import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Product} from "../../products/products.entity";
import {SupplyBranch} from "./supply-branch.entity";

@Entity()
export class SupplyBranchProduct {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number;

    @ManyToOne(() => Product)
    product: Product;

    @ManyToOne(() => SupplyBranch)
    supplyBranch: SupplyBranch;
}
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Branch} from "../../branches/branches.entity";
import {SupplyBranchProduct} from "./supply-branch-products.entity";

@Entity()
export class SupplyBranch {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: Date;

    @ManyToOne(() => Branch)
    branch: Branch;

    @Column()
    type: string;

    @Column()
    identifier: string;

    @Column({ nullable: true })
    comment: string;

    @OneToMany(() => SupplyBranchProduct, supplyBranchProduct => supplyBranchProduct.supplyBranch, { cascade: true })
    products: SupplyBranchProduct[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
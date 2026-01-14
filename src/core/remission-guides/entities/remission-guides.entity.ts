import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {RemissionGuideProduct} from "./remission-guides-products.entity";
import {Branch} from "../../branches/branches.entity";

@Entity()
export class RemissionGuide {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    identifier: string;

    @Column()
    date: Date;

    @ManyToOne(() => Branch)
    branchFrom: Branch;

    @ManyToOne(() => Branch)
    branchTo: Branch;

    @Column()
    status: string;

    @OneToMany(() => RemissionGuideProduct, remissionGuideProduct => remissionGuideProduct.remissionGuide, { cascade: true })
    products: RemissionGuideProduct[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
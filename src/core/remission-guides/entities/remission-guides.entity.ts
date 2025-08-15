import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {RemissionGuideProduct} from "./remission-guides-products.entity";

@Entity()
export class RemissionGuide {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: Date;

    @Column()
    branchFrom: string;

    @Column()
    branchTo: string;

    @Column()
    status: string;

    @Column()
    identifier: string;

    @OneToMany(() => RemissionGuideProduct, remissionGuideProduct => remissionGuideProduct.remissionGuide, { cascade: true })
    products: RemissionGuideProduct[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
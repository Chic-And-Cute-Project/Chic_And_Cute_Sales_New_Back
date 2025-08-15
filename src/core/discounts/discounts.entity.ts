import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Product} from "../products/products.entity";

@Entity()
export class Discount {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    quantity: number;

    @ManyToOne(() => Product, { nullable: true })
    product: Product;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
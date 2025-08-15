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
export class Inventory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    branch: string;

    @Column()
    quantity: number;

    @ManyToOne(() => Product)
    product: Product;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
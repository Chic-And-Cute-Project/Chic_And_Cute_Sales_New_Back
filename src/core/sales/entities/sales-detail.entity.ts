import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Product} from "../../products/products.entity";
import {Sale} from "./sales.entity";

@Entity()
export class SaleDetail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number;

    @Column({ nullable: true })
    discount: number;

    @ManyToOne(() => Product)
    product: Product;

    @ManyToOne(() => Sale)
    sale: Sale;
}
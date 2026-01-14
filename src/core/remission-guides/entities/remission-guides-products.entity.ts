import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {RemissionGuide} from "./remission-guides.entity";
import {Product} from "../../products/products.entity";

@Entity()
export class RemissionGuideProduct {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number;

    @ManyToOne(() => Product)
    product: Product;

    @ManyToOne(() => RemissionGuide)
    remissionGuide: RemissionGuide;
}
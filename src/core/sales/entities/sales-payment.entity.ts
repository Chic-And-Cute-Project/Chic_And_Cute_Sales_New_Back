import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Sale} from "./sales.entity";

@Entity()
export class SalePayment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column()
    amount: number;

    @ManyToOne(() => Sale)
    sale: Sale;
}
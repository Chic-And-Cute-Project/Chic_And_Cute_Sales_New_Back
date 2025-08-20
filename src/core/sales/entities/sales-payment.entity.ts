import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Sale} from "./sales.entity";

@Entity()
export class SalePayment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @ManyToOne(() => Sale)
    sale: Sale;
}
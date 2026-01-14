import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Sale} from "./sales.entity";

export enum PaymentType {
    EFECTIVO = 'EFECTIVO', VISA = 'VISA'
}

@Entity()
export class SalePayment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: PaymentType })
    type: PaymentType;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @ManyToOne(() => Sale)
    sale: Sale;
}
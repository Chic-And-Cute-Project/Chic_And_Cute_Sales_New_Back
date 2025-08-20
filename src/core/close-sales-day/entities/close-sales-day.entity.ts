import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "../../users/users.entity";
import {CloseSalesDaySale} from "./close-sales-day-sale.entity";

@Entity()
export class CloseSalesDay {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    branch: string;

    @ManyToOne(() => User)
    user: User;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    cashAmount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    cardAmount: number;

    @OneToMany(() => CloseSalesDaySale, closeSalesSaySale => closeSalesSaySale.closeSalesDay, { cascade: true })
    sales: CloseSalesDaySale[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
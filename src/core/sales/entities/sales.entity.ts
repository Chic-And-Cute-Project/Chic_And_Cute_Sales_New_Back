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
import {SaleDetail} from "./sales-detail.entity";
import {SalePayment} from "./sales-payment.entity";
import {Branch} from "../../branches/branches.entity";

@Entity()
export class Sale {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: Date;

    @ManyToOne(() => Branch)
    branch: Branch;

    @ManyToOne(() => User)
    user: User;

    @OneToMany(() => SaleDetail, detail => detail.sale, { cascade: true })
    detail: SaleDetail[];

    @OneToMany(() => SalePayment, paymentMethod => paymentMethod.sale, { cascade: true })
    paymentMethod: SalePayment[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
import {
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import {CloseSalesDay} from "./close-sales-day.entity";
import {Sale} from "../../sales/entities/sales.entity";

@Entity()
export class CloseSalesDaySale {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Sale)
    sale: Sale;

    @ManyToOne(() => CloseSalesDay)
    closeSalesDay: CloseSalesDay;
}
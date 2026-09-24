import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {Branch} from "../../branches/branches.entity";

@Entity()
export class CustomReceiptSequence {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Branch)
  branch: Branch;

  @Column()
  lastNumber: number;
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
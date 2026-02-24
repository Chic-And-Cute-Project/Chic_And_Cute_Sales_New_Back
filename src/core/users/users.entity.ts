import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Branch} from "../branches/branches.entity";

export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN', ADMIN = 'ADMIN', BRANCH = 'BRANCH'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    lastName: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: UserRole })
    role: UserRole;

    @Column()
    tokenVersion: number;

    @ManyToOne(() => Branch)
    branch: Branch;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
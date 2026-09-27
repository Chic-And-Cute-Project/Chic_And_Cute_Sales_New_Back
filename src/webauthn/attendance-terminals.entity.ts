import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Branch} from "../core/branches/branches.entity";

@Entity()
export class AttendanceTerminal {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    credentialId: string;

    @Column()
    publicKey: string;

    @Column()
    counter: number;

    @Column({ type: 'text', nullable: true })
    authenticationChallenge: string | null;

    @ManyToOne(() => Branch)
    branch: Branch;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
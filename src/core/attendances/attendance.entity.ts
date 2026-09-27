import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "../users/users.entity";
import {AttendanceTerminal} from "../../webauthn/attendance-terminals.entity";
import {Branch} from "../branches/branches.entity";

export enum AttendancePunctuality {
    PUNCTUAL = 'PUNTUAL',
    TOLERANCE = 'TOLERANCIA',
    LATE = 'TARDANZA',
}

@Entity()
export class Attendance {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'decimal', precision: 10, scale: 7 })
    latitude: number;

    @Column({ type: 'decimal', precision: 10, scale: 7 })
    longitude: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    accuracy: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    distanceFromBranch: number;

    @Column({ type: 'enum', enum: AttendancePunctuality })
    punctuality: AttendancePunctuality;

    @Column()
    lateMinutes: number;

    @ManyToOne(() => Branch)
    branch: Branch;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => AttendanceTerminal)
    attendanceTerminal: AttendanceTerminal;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('clients')
export class Client {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    phone: number;

    @Column()
    dui: number;

    @Column()
    accumulatedPoint: number;

    @Column({ default: true })
    isActive: boolean;
}

import { time } from "console";
import { type } from "os";
import { Client } from "src/clients/entities/client.entity";
import { DetailSale } from "src/detail-sale/entities/detail-sale.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";

@Entity('sales')
export class Sale {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    user: User
    

    @RelationId((sale: Sale) => sale.user)
    userId: number;

    @ManyToOne(() => Client)
    client: Client

    @RelationId((sale: Sale) => sale.client)
    clientId: number;

    @Column()
    date: Date;

    @Column({ type: 'time' })
    time: Date;

    @Column({type: 'decimal', precision: 10, scale: 2, default: 0.0})
    discount: number;

    @Column({type: 'decimal', precision: 10, scale: 2, default: 0.0})
    total: number;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => DetailSale, detailSale => detailSale.sale)
  detailSales: DetailSale[];


}

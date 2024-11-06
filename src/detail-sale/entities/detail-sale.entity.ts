import { Sale } from "src/sales/entities/sale.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";

@Entity('detail_sale')
export class DetailSale {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Sale, sale => sale.detailSales)
    sale: Sale;

    @RelationId((detailSale: DetailSale) => detailSale.sale)
    saleId: number;

    @Column()
    productId: number;

    @Column()
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
    discount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
    total: number;

    @Column({ default: true })
    isActive: boolean;
}

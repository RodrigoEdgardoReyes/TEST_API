import { Module } from '@nestjs/common';
import { DetailSaleService } from './detail-sale.service';
import { DetailSaleController } from './detail-sale.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailSale } from './entities/detail-sale.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DetailSale, Sale, Product])],
  controllers: [DetailSaleController],
  providers: [DetailSaleService],
})
export class DetailSaleModule { }

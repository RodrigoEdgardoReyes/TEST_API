import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { UsersModule } from 'src/users/users.module';
import { ClientsModule } from 'src/clients/clients.module';
import { Client } from 'src/clients/entities/client.entity';
import { User } from 'src/users/entities/user.entity';
import { DetailSale } from 'src/detail-sale/entities/detail-sale.entity';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sale,DetailSale, Client, User, Product]), UsersModule, ClientsModule],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}

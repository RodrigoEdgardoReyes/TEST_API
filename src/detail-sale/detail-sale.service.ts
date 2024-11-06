import { Injectable } from '@nestjs/common';
import { CreateDetailSaleDto } from './dto/create-detail-sale.dto';
import { UpdateDetailSaleDto } from './dto/update-detail-sale.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DetailSale } from './entities/detail-sale.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DetailSaleService {
  constructor(@InjectRepository(DetailSale) private readonly detailSaleRepository: Repository<DetailSale>) { }

  create(createDetailSaleDto: CreateDetailSaleDto) {
    return 'This action adds a new detailSale';
  }

  findAll() {
    return `This action returns all detailSale`;
  }

  findOne(id: number) {
    return `This action returns a #${id} detailSale`;
  }

  async findByIdSale(saleId: number) {
    try {
      const detailSale = await this.detailSaleRepository.findOne({ where: { saleId } })

      if (!detailSale)
        return {
          ok: false,
          message: 'No se encontro el detalle de venta',
          status: 404,
        }

      // si se encontro el detalle de venta
      return { ok: true, detailSale, status: 200 }
    } catch (error) {
      return {
        ok: false,
        message: 'Ocurrio un error al obtener detalle de venta',
        status: 500,
      };
    }
  }

  update(id: number, updateDetailSaleDto: UpdateDetailSaleDto) {
    return `This action updates a #${id} detailSale`;
  }

  remove(id: number) {
    return `This action removes a #${id} detailSale`;
  }
}


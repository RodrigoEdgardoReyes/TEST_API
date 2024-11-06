import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DetailSaleService } from './detail-sale.service';
import { CreateDetailSaleDto } from './dto/create-detail-sale.dto';
import { UpdateDetailSaleDto } from './dto/update-detail-sale.dto';

@Controller('detail-sale')
export class DetailSaleController {
  constructor(private readonly detailSaleService: DetailSaleService) { }

  @Post()
  create(@Body() createDetailSaleDto: CreateDetailSaleDto) {
    return this.detailSaleService.create(createDetailSaleDto);
  }

  @Get()
  findAll() {
    return this.detailSaleService.findAll();
  }

  @Get('search')
  findByIdSale(@Query('id') id: string) {
    const saleId = parseInt(id, 10);

    if(isNaN(saleId)){
      return {
        ok: false,
        message: 'ID de venta invalido',
        status: 400,
      };
    }
    return this.detailSaleService.findByIdSale(+saleId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetailSaleDto: UpdateDetailSaleDto) {
    return this.detailSaleService.update(+id, updateDetailSaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detailSaleService.remove(+id);
  }
}

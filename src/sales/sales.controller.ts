import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { CreateDetailSaleDto } from 'src/detail-sale/dto/create-detail-sale.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) { }

  @Post()
  create(@Body() createSaleDto: CreateSaleDto, @Body() createDetailSaleDto: CreateDetailSaleDto) {
    return this.salesService.create(createSaleDto, createDetailSaleDto);
  }
  /*@Post()
  create(@Body() createSaleDto: CreateSaleDto, createDetailSaleDto: CreateDetailSaleDto) {
    return this.salesService.create(createSaleDto);
  }*/

  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(+id);
  }

  /*@Patch(':id')
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(+id, updateSaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesService.remove(+id);
  }*/
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateDetailSaleDto } from './create-detail-sale.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateDetailSaleDto extends PartialType(CreateDetailSaleDto) {
    @IsNotEmpty()
    @IsString()
    saleId: string;

    @IsNotEmpty()
    @IsNumber()
    productId: number;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @IsNotEmpty()
    @IsNumber()
    discount: number;

    @IsNotEmpty()
    @IsNumber()
    total: number;

}

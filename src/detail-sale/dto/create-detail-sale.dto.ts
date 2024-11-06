import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { CreateSaleDto } from "src/sales/dto/create-sale.dto";

export class CreateDetailSaleDto {
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

    // @IsNotEmpty()
    // @IsNumber()
    // total: number;

    // @IsNotEmpty()
    // @ValidateNested({ each: true })
    // @Type(() => CreateDetailSaleDto)
    // Products: CreateDetailSaleDto[];
}

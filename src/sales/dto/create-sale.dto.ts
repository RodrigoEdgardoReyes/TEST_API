import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { CreateDetailSaleDto } from "src/detail-sale/dto/create-detail-sale.dto";


export class CreateSaleDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsNumber()
    clientId: number;

    @IsNotEmpty()
    @IsDate()
    date: Date;

    @IsNotEmpty()
    @IsDate()
    time: Date;

    @IsNotEmpty()
    @IsNumber()
    discount: number;

    @ValidateNested({ each: true })
    @Type(() => CreateDetailSaleDto)
    Products: CreateDetailSaleDto[];

    // @IsNotEmpty()
    // @IsNumber()
    // total: number;

    // @IsNotEmpty()
    // @ValidateNested({ each: true })
    // @Type(() => CreateSaleDto)
    // Products: CreateSaleDto[];

}

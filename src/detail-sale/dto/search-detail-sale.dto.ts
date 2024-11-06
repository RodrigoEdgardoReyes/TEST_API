import { IsOptional, IsString } from "class-validator";

export class SearchDetailDto {
    @IsOptional()
    @IsString()
    saleId: string = ''
}
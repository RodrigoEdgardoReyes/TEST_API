import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    code: number;

    @IsNotEmpty()
    @IsNumber()
    unitPrice: number;

    @IsNotEmpty()
    @IsNumber()
    unitCost: number;
}


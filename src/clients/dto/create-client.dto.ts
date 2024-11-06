import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateClientDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    phone: number;

    @IsNotEmpty()
    @IsNumber()
    dui: number;
}

import { IsNotEmpty, IsString } from "class-validator";

export class CreaateRoleDto {
    @IsNotEmpty()
    @IsString()
    name: string;
}
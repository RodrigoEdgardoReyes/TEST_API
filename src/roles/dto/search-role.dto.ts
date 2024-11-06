import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class SearchRoleDto {
    // Este campo es opcional y por defecto se establece como una cadena vacia
     @IsOptional()
     @IsString()
     name: string = '';
   
    /**
     * El numero de pagina para la paginacion
     * Este campo es obligatorio, debe ser un numero entero y tiene un valor minimo de 1.
     * Por defecto se establce en 1 si no se proporciona.
     */
     @IsInt()
     @Min(1)
    page: number = 1;

    /**
     * El limite de resultado por pagina para la paginacion
     * Este campo es obligatorio, debe ser un numero entero y tiene un valor minimo de 1.
     * Por defecto se establece en 10 si no se proporciona
     */
    @IsInt()
    @Min(1)
    limit: number = 10;
}
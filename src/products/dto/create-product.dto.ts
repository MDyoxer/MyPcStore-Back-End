import { IsString, IsNumber, IsOptional,  } from "class-validator";
import { Type } from "class-transformer";
export class CreateProductDto {
    @IsString()
    nombre_prod!: string;

    @IsNumber()
    @Type(() => Number)
    precio_prod!: number;

    @IsString()
    @IsOptional()
    imagen_prod!: string;

    @IsString()
    @IsOptional()
    specs_prod!: string;

    @IsNumber() 
    @Type(() => Number)
    stock_prod!: number;
    
    @Type(() => Number)
    @IsNumber()
    id_ctp_prod!: number;
    
    @IsOptional()
    @Type(() => Number)
    id_marca_prod!: number;
    
    @IsString()
    @IsOptional()
    descripcion_prod!: string;
}

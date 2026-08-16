<<<<<<< Updated upstream
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
=======
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import type { Prisma } from 'generated/prisma/client';

export class CreateProductDto {
  @IsString()
  @MaxLength(255)
  nombre_pt!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  precio_pt!: number;

  @IsOptional()
  @IsString()
  img_pt?: string;

  @IsOptional()
  @IsObject()
  specs_pt?: Prisma.InputJsonValue;

  @IsOptional()
  @IsInt()
  is_active_pt?: number;

  @IsInt()
  stock_pt!: number;

  @IsInt()
  id_ctp_pt!: number;

  @IsOptional()
  @IsInt()
  id_mc_pt?: number;

  @IsOptional()
  @IsString()
  descripcion_pt?: string;
>>>>>>> Stashed changes
}

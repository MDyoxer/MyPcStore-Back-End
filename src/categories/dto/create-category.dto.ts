<<<<<<< Updated upstream
import { IsString } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    categoria!:string;
=======
import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MaxLength(255)
  categoria_ctp!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug_ctp?: string;

  @IsOptional()
  @IsInt()
  is_active_ctp?: number;
>>>>>>> Stashed changes
}

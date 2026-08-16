<<<<<<< Updated upstream
import { IsString } from "class-validator";

export class CreateBrandDto {
    @IsString()
    marca!: string;
=======
import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @MaxLength(255)
  marca_mc!: string;

  @IsOptional()
  @IsInt()
  is_active_mc?: number;
>>>>>>> Stashed changes
}

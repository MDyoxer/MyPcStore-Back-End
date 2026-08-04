import { IsNotEmpty, IsNumber, Min } from 'class-validator';
export class UpdateCartQuantityDto {
  @IsNumber()
  @IsNotEmpty()
  idProducto!: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  cantidad!: number;
}

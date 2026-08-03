import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateFavoriteDto {
    @IsNumber()
    @IsNotEmpty()
    idProducto!: number;
}

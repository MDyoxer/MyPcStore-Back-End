import { IsNotEmpty, IsNumber, Min } from "class-validator";
export class CreateCartDto {
    @IsNumber()
    @IsNotEmpty()
    idProducto!: number;
    
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    cantidad!: number;

}

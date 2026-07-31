import { IsNotEmpty, IsNumber, Min } from "class-validator";
export class CreateCartDto {
    @IsNumber()
    @IsNotEmpty()
    id_pt!: number;
    
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    cantidad!: number;

}

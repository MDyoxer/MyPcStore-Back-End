<<<<<<< Updated upstream
export class CreateCategoryDto {}
=======
import { IsString, Matches } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @Matches(/\S/)
    categoria!:string;
}
>>>>>>> Stashed changes

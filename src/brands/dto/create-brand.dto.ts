<<<<<<< Updated upstream
export class CreateBrandDto {}
=======
import { IsString, Matches } from "class-validator";

export class CreateBrandDto {
    @IsString()
    @Matches(/\S/)
    marca!: string;
}
>>>>>>> Stashed changes

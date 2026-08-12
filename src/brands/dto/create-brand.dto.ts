import { IsString } from "class-validator";

export class CreateBrandDto {
    @IsString()
    marca!: string;
}

import { IsOptional, IsString } from "class-validator";
import { GoogleLoginDto } from "./auth-google.dto";

export class RegisterDto extends GoogleLoginDto {
    @IsString()
    @IsOptional()
    nombre?: string;
}

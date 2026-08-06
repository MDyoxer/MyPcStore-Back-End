import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  nombre_c!: string;

  @IsEmail()
  @IsNotEmpty()
  correo_c!: string;

  @IsString()
  @IsNotEmpty()
  firebase_uid!: string;
}

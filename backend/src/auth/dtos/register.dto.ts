import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class RegisterDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsBoolean()
  @IsOptional()
  isAdmin: boolean;
}

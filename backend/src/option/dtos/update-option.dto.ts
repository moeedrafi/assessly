import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateOptionDTO {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  @IsOptional()
  text: string;

  @IsBoolean()
  @IsOptional()
  isCorrect: boolean;
}

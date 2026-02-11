import { IsBoolean, IsString } from 'class-validator';

export class CreateOptionDTO {
  @IsString()
  text: string;

  @IsBoolean()
  isCorrect: boolean;
}

import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';
import { QuestionType } from 'src/enum';
import { CreateOptionDTO } from 'src/option/dtos/create-option.dto';

export class CreateQuestionDTO {
  @IsString()
  text: string;

  @IsEnum(QuestionType)
  type: QuestionType;

  @IsNumber()
  marks: number;

  @IsArray()
  options: CreateOptionDTO[];
}

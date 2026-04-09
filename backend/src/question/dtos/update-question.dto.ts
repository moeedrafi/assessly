import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { QuestionType } from 'src/enum';
import { UpdateOptionDTO } from 'src/option/dtos/update-option.dto';

export class UpdateQuestionDTO {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  @IsOptional()
  text: string;

  @IsEnum(QuestionType)
  @IsOptional()
  type: QuestionType;

  @IsNumber()
  @IsOptional()
  marks: number;

  @IsArray()
  @IsOptional()
  options: UpdateOptionDTO[];
}

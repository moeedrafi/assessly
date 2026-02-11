import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateQuestionDTO } from 'src/question/dtos/create-question.dto';

export class CreateQuizDTO {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  totalMarks: number;

  @IsNumber()
  timeLimit: number;

  @IsBoolean()
  isPublished: boolean;

  @IsDateString()
  startsAt: string;

  @IsDateString()
  @IsOptional()
  endsAt: string;

  @IsNumber()
  @IsOptional()
  passingMarks: number;

  @IsArray()
  question: CreateQuestionDTO[];
}

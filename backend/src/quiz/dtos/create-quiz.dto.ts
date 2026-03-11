import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
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

  @IsNumber()
  courseId: number;

  @IsNumber()
  passingMarks: number;

  @IsBoolean()
  isPublished: boolean;

  @IsDateString()
  startsAt: string;

  @IsDateString()
  endsAt: string;

  @IsArray()
  questions: CreateQuestionDTO[];
}

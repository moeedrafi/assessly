import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UpdateQuestionDTO } from 'src/question/dtos/update-question.dto';

export class UpdateQuizDTO {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  totalMarks: number;

  @IsNumber()
  @IsOptional()
  timeLimit: number;

  @IsNumber()
  @IsOptional()
  courseId: number;

  @IsNumber()
  @IsOptional()
  passingMarks: number;

  @IsBoolean()
  @IsOptional()
  isPublished: boolean;

  @IsDateString()
  @IsOptional()
  startsAt: string;

  @IsDateString()
  @IsOptional()
  endsAt: string;

  @IsArray()
  @IsOptional()
  questions: UpdateQuestionDTO[];
}

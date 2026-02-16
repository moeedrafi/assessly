import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNumber, ValidateNested } from 'class-validator';

class AnswerDTO {
  @IsNumber()
  questionId: number;

  @IsArray()
  @IsInt({ each: true })
  selectedOptionIds: number[];
}

export class AttemptQuizDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDTO)
  answers: AnswerDTO[];
}

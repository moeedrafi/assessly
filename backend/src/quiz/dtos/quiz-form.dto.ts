import { Expose, Transform, Type } from 'class-transformer';
import { QuestionDTO } from 'src/question/dtos/question.dto';

export class QuizFormDTO {
  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  totalMarks: number;

  @Expose()
  timeLimit: number;

  @Expose()
  passingMarks?: number;

  @Expose()
  isPublished: boolean;

  @Expose()
  startsAt: Date;

  @Expose()
  endsAt: Date;

  @Expose()
  courseId: number;

  @Expose()
  @Type(() => QuestionDTO)
  questions: QuestionDTO[];
}

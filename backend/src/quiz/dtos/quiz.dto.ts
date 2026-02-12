import { Expose, Type } from 'class-transformer';
import { CourseDTO } from 'src/courses/dtos/course.dto';
import { QuestionDTO } from 'src/question/dtos/question.dto';

export class QuizDTO {
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
  endsAt?: Date;

  @Expose()
  @Type(() => CourseDTO)
  course: CourseDTO;

  @Expose()
  @Type(() => QuestionDTO)
  questions: QuestionDTO[];
}

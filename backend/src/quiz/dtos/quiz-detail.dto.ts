import { Expose, Transform, Type } from 'class-transformer';
import { CourseDTO } from 'src/courses/dtos/course.dto';
import { QuestionDTO } from 'src/question/dtos/question.dto';

export class QuizDetailDTO {
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
  @Transform(({ obj }) => obj.course.name)
  course: string;

  @Expose()
  @Transform(({ obj }) => obj.course.teacher.name)
  teacher: string;

  @Expose()
  @Type(() => QuestionDTO)
  questions: QuestionDTO[];
}

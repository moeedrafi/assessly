import { Expose, Transform } from 'class-transformer';

export class StudentCourseDTO {
  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  isActive: boolean;

  @Expose()
  @Transform(({ obj }) => obj.teacher.name)
  teacherName: string;
}

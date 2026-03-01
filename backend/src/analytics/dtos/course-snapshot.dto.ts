import { IsNumber, IsString } from 'class-validator';

export class CourseSnapshotDTO {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsNumber()
  totalStudents: number;

  @IsNumber()
  avgScore: number;

  @IsNumber()
  passRate: number;
}

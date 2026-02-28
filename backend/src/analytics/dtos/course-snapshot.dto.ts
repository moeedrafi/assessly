import { IsNumber, IsString } from 'class-validator';

export class CourseSnapshotDTO {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsNumber()
  totalStudents: number;

  @IsNumber()
  avgScore: number;

  @IsNumber()
  passRate: number;
}

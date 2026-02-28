import { IsNumber } from 'class-validator';

export class DashboardKpisDTO {
  @IsNumber()
  totalUsers: number;

  @IsNumber()
  totalCourses: number;

  @IsNumber()
  totalQuizzes: number;
}

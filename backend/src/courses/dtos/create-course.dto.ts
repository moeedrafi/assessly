import { IsString, IsBoolean } from 'class-validator';

export class CreateCourseDTO {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsBoolean()
  isActive: boolean;

  @IsBoolean()
  allowStudentJoin: boolean;
}

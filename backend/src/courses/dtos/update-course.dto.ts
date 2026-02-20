import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateCourseDTO {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsBoolean()
  @IsOptional()
  allowStudentJoin: boolean;
}

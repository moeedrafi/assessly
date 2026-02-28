import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class JoinedCourseDTO {
  @IsNumber()
  id: number;

  @IsString()
  name: string;
}

export class RecentUserDTO {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JoinedCourseDTO)
  joinedCourses: JoinedCourseDTO[];
}

import { Expose, Type } from 'class-transformer';
import { UserDTO } from 'src/users/dtos/user.dto';

export class CourseDTO {
  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  code: string;

  @Expose()
  isActive: boolean;

  @Expose()
  allowStudentJoin: boolean;

  @Expose()
  @Type(() => UserDTO)
  teacher: UserDTO;
}

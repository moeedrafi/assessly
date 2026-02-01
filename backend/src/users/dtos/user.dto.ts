import { Expose } from 'class-transformer';
import { UserRole } from 'src/enum';

export class UserDTO {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  role: UserRole;
}

import { IsDate, IsString } from 'class-validator';

export class RecentUserDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsDate()
  createdAt: Date;
}

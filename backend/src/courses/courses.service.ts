import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Courses } from 'src/courses/courses.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Courses) private repo: Repository<Courses>,
    private usersServices: UsersService,
  ) {}

  async create(
    teacherId: number,
    name: string,
    description: string,
    allowStudentJoin: boolean,
    isActive: boolean,
  ) {
    if (!teacherId) throw new UnauthorizedException();

    const teacher = await this.usersServices.findById(teacherId);
    if (!teacher) throw new UnauthorizedException();

    const course = this.repo.create({
      name,
      description,
      teacher,
      allowStudentJoin,
      isActive,
    });
    const savedCourse = await this.repo.save(course);

    return {
      data: savedCourse,
      message: 'Successfully Created',
    };
  }
}

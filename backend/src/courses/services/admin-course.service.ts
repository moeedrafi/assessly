import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Courses } from 'src/courses/courses.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AdminCourseService {
  constructor(
    @InjectRepository(Courses) private repo: Repository<Courses>,
    private usersService: UsersService,
  ) {}

  async create(
    teacherId: number,
    name: string,
    description: string,
    allowStudentJoin: boolean,
    isActive: boolean,
  ) {
    if (!teacherId) throw new UnauthorizedException();

    const teacher = await this.usersService.findById(teacherId);
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

  async update(courseId: number, attr: Partial<Courses>) {
    if (!courseId) throw new BadRequestException('course id is required');

    const course = await this.repo.findOneBy({ id: courseId });
    if (!course) throw new NotFoundException('course not found');

    Object.assign(course, attr);

    const updatedCourse = await this.repo.save(course);

    return {
      data: updatedCourse,
      message: 'Course Updated Successfully!',
    };
  }

  async delete(courseId: number) {
    if (!courseId) throw new BadRequestException('course id is required');

    const result = await this.repo.delete(courseId);
    if (result.affected === 0) throw new NotFoundException('course not found');

    return { message: 'Course Deleted Successfully!' };
  }

  async findAll(userId: number, page: number, rpp: number) {
    if (!userId) throw new UnauthorizedException();

    const offset = (page - 1) * rpp;

    const [courses, totalItems] = await this.repo.findAndCount({
      where: { teacher: { id: userId } },
      skip: offset,
      take: rpp,
      order: { id: 'DESC' },
    });

    return {
      data: courses,
      message: 'Successfully fetched courses',
      meta: {
        totalItems,
        totalPages: Math.ceil(totalItems / rpp),
        page,
        rpp,
      },
    };
  }

  async findOne(courseId: number, userId: number) {
    if (!courseId) throw new BadRequestException('course id is required');
    if (!userId) throw new BadRequestException('user is required');

    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException('user not found');

    const course = await this.repo.findOne({
      where: {
        id: courseId,
        teacher: { id: userId },
      },
      select: {
        id: true,
        name: true,
        description: true,
        allowStudentJoin: true,
        isActive: true,
      },
    });

    if (!course) throw new NotFoundException('course not found');

    return { data: course, message: 'Fetched Successfully' };
  }
}

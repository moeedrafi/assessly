import { Repository } from 'typeorm';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from 'src/enum';
import { Courses } from 'src/courses/courses.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Courses) private repo: Repository<Courses>,
    private usersService: UsersService,
  ) {}

  async findAll(studentId: number) {
    if (!studentId) throw new UnauthorizedException();

    const courses = await this.repo
      .createQueryBuilder('course')
      .leftJoin('course.teacher', 'teacher')
      .leftJoin('course.students', 'student')
      .where('student.id = :studentId', { studentId })
      .select([
        'course.id',
        'course.name',
        'course.description',
        'course.isActive',
        'teacher.name',
      ])
      .getMany();

    return {
      data: courses,
      message: 'Successfully fetched courses',
      meta: null,
    };
  }

  async findOne(courseId: number, userId: number) {
    if (!courseId) throw new BadRequestException('course id is required');
    if (!userId) throw new BadRequestException('user is required');

    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException('user not found');

    const course = await this.repo.findOne({
      where: { id: courseId },
      relations: ['students', 'quizzes'],
    });
    if (!course) throw new BadRequestException('course not found');

    const isEnrolled = course.students.some((student) => student.id === userId);
    if (!isEnrolled) throw new UnauthorizedException('not joined course');

    return course;
  }

  async join(userId: number, code: string) {
    if (!userId) throw new UnauthorizedException('user not logged in');

    const user = await this.usersService.findById(userId, {
      relations: ['joinedCourses'],
    });
    if (!user) throw new NotFoundException('user not found');

    if (user.role === UserRole.ADMIN)
      throw new ForbiddenException('admins cannot join courses');

    const course = await this.repo.findOne({ where: { code } });
    if (!course) throw new NotFoundException('course not found');

    if (!course.allowStudentJoin) {
      throw new ForbiddenException('not allowed to join course');
    }

    if (user.joinedCourses.some((course) => course.code === code)) {
      throw new BadRequestException('already joined this course');
    }

    user.joinedCourses.push(course);
    await this.usersService.save(user);

    return { message: 'joined course', data: course };
  }

  async leave(userId: number, courseId: number) {
    if (!userId) throw new UnauthorizedException('user not logged in');
    if (!courseId) throw new BadRequestException('course id is required');

    const user = await this.usersService.findById(userId, {
      relations: ['joinedCourses'],
    });
    if (!user) throw new NotFoundException('user not found');

    if (user.role === UserRole.ADMIN)
      throw new ForbiddenException('admins cannot leave courses');

    const course = await this.repo.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException('course not found');

    if (!user.joinedCourses.some((course) => course.id === courseId))
      throw new BadRequestException(
        "already left or haven't joined this course",
      );

    user.joinedCourses = user.joinedCourses.filter((c) => c.id !== courseId);
    await this.usersService.save(user);

    return { message: 'left course', data: course };
  }
}

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

  async update(courseId: number, attr: Partial<Courses>) {
    if (!courseId) throw new BadRequestException('course id is required');

    const result = await this.repo.update(courseId, attr);
    if (result.affected === 0) throw new NotFoundException('course not found');

    const updatedCourse = await this.repo.findOneBy({ id: courseId });

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

  async findAll(userId: number) {
    if (!userId) throw new UnauthorizedException();

    const user = await this.usersServices.findById(userId, ['joinedCourses']);

    if (!user) throw new NotFoundException();

    if (user.role === UserRole.ADMIN) {
      const courses = await this.repo.find({
        where: { teacher: { id: userId } },
      });

      return courses;
    }

    return user.joinedCourses;
  }

  async findOne(courseId: number, userId: number) {
    if (!courseId) throw new BadRequestException('course id is required');
    if (!userId) throw new BadRequestException('user is required');

    const user = await this.usersServices.findById(userId);
    if (!user) throw new UnauthorizedException('user not found');

    if (user.role === UserRole.ADMIN) {
      return this.repo.findOne({
        where: {
          id: courseId,
          teacher: { id: userId },
        },
        relations: ['teacher', 'students', 'quizzes'],
      });
    }

    const course = await this.repo.findOne({
      where: { id: courseId },
      relations: ['students', 'quizzes'],
    });
    if (!course) throw new BadRequestException('course not found');

    const isEnrolled = course.students.some((student) => student.id === userId);
    if (isEnrolled) return course;

    const { id, name, description, allowStudentJoin, isActive, code } = course;
    return { id, name, description, allowStudentJoin, isActive, code };
  }

  async join(userId: number, courseId: number) {
    if (!userId) throw new UnauthorizedException('user not logged in');
    if (!courseId) throw new BadRequestException('course id is required');

    const user = await this.usersServices.findById(userId, ['joinedCourses']);
    if (!user) throw new NotFoundException('user not found');

    if (user.role === UserRole.ADMIN)
      throw new ForbiddenException('admins cannot join courses');

    const course = await this.repo.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException('course not found');

    if (!course.allowStudentJoin)
      throw new ForbiddenException('not allowed to join course');

    if (user.joinedCourses.some((course) => course.id === courseId))
      throw new BadRequestException('already joined this course');

    user.joinedCourses.push(course);
    await this.usersServices.save(user);

    return { message: 'joined course', data: course };
  }

  async leave(userId: number, courseId: number) {
    if (!userId) throw new UnauthorizedException('user not logged in');
    if (!courseId) throw new BadRequestException('course id is required');

    const user = await this.usersServices.findById(userId, ['joinedCourses']);
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
    await this.usersServices.save(user);

    return { message: 'left course', data: course };
  }
}

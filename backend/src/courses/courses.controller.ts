import { Controller, Get, Param, Post } from '@nestjs/common';
import { CoursesService } from 'src/courses/courses.service';
import { StudentCourseDTO } from './dtos/student-course.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Serialize } from 'src/interceptors/serialize.interceptor';

@Controller('courses')
export class CoursesController {
  constructor(private coursesServices: CoursesService) {}

  @Serialize(StudentCourseDTO)
  @Get()
  getCourses(@CurrentUser() user: { sub: number; name: string }) {
    return this.coursesServices.findAll(user.sub);
  }

  @Get(':courseid')
  getCourse(
    @Param('courseid') courseId: string,
    @CurrentUser() user: { sub: number; name: string },
  ) {
    return this.coursesServices.findOne(Number(courseId), user.sub);
  }

  @Post('/join/:courseid')
  joinCourse(
    @Param('courseid') courseId: string,
    @CurrentUser() user: { sub: number; name: string },
  ) {
    return this.coursesServices.join(user.sub, Number(courseId));
  }

  @Post('/leave/:courseid')
  leaveCourse(
    @Param('courseid') courseId: string,
    @CurrentUser() user: { sub: number; name: string },
  ) {
    return this.coursesServices.leave(user.sub, Number(courseId));
  }
}

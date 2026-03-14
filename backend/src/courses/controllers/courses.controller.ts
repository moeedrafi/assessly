import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CoursesService } from 'src/courses/services/courses.service';
import { StudentCourseDTO } from 'src/courses/dtos/student-course.dto';

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

  @Post('/join')
  joinCourse(
    @Body() body: { code: string },
    @CurrentUser() user: { sub: number },
  ) {
    return this.coursesServices.join(user.sub, body.code);
  }

  @Post('/leave/:courseid')
  leaveCourse(
    @Param('courseid') courseId: string,
    @CurrentUser() user: { sub: number; name: string },
  ) {
    return this.coursesServices.leave(user.sub, Number(courseId));
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from 'src/courses/courses.service';
import { CreateCourseDTO } from 'src/courses/dtos/create-course.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { UserRole } from 'src/enum';
import { AdminGuard } from 'src/guards/admin.guard';
import { CourseDTO } from './dtos/course.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';

@Controller('courses')
export class CoursesController {
  constructor(private coursesServices: CoursesService) {}

  /* ADMIN */
  @Serialize(CourseDTO)
  @Post()
  @UseGuards(AdminGuard)
  createCourse(
    @CurrentUser() user: { sub: number; name: string },
    @Body() body: CreateCourseDTO,
  ) {
    return this.coursesServices.create(
      user.sub,
      body.name,
      body.description,
      body.allowStudentJoin,
      body.isActive,
    );
  }

  @Get()
  getCourses(@CurrentUser() user: { sub: number; name: string }) {
    return this.coursesServices.findAll(user.sub);
  }

  @Get()
  getCourse(
    @Param('courseid') courseId: string,
    @CurrentUser() user: { sub: number; name: string },
  ) {
    return this.coursesServices.findOne(Number(courseId), user.sub);
  }

  @Patch()
  @UseGuards(AdminGuard)
  updateCourse(
    @Param('courseid') courseId: string,
    @Body() body: CreateCourseDTO,
  ) {
    return this.coursesServices.update(Number(courseId), body);
  }

  @Delete()
  @UseGuards(AdminGuard)
  removeCourse(@Param('courseid') courseId: string) {
    return this.coursesServices.delete(Number(courseId));
  }

  /* STUDENT ROUTES */
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

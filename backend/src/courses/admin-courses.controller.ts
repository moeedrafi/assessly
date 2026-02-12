import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/guards/admin.guard';
import { CoursesService } from './courses.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CourseDTO } from './dtos/course.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CreateCourseDTO } from './dtos/create-course.dto';

@Controller()
@UseGuards(AdminGuard)
export class AdminCoursesController {
  constructor(private coursesService: CoursesService) {}

  @Serialize(CourseDTO)
  @Post()
  createCourse(
    @CurrentUser() user: { sub: number; name: string },
    @Body() body: CreateCourseDTO,
  ) {
    return this.coursesService.create(
      user.sub,
      body.name,
      body.description,
      body.allowStudentJoin,
      body.isActive,
    );
  }

  @Patch(':courseid')
  updateCourse(
    @Param('courseid') courseId: string,
    @Body() body: CreateCourseDTO,
  ) {
    return this.coursesService.update(Number(courseId), body);
  }

  @Delete(':courseid')
  removeCourse(@Param('courseid') courseId: string) {
    return this.coursesService.delete(Number(courseId));
  }
}

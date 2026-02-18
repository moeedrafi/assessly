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
import { AdminGuard } from 'src/guards/admin.guard';
import { CoursesService } from './courses.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CourseDTO } from './dtos/course.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CreateCourseDTO } from './dtos/create-course.dto';

@Controller('admin/courses')
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

  @Get()
  getCourses(@CurrentUser() user: { sub: number; name: string }) {
    return this.coursesService.findAllAdminCourses(user.sub);
  }

  @Get(':courseid')
  getCourse(
    @Param('courseid') courseId: string,
    @CurrentUser() user: { sub: number; name: string },
  ) {
    return this.coursesService.findOneAdminCourse(Number(courseId), user.sub);
  }
}

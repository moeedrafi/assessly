import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/guards/admin.guard';
import { CourseDTO } from 'src/courses/dtos/course.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CreateCourseDTO } from 'src/courses/dtos/create-course.dto';
import { UpdateCourseDTO } from 'src/courses/dtos/update-course.dto';
import { AdminCourseService } from 'src/courses/services/admin-course.service';

@Controller('admin/courses')
@UseGuards(AdminGuard)
export class AdminCoursesController {
  constructor(private coursesService: AdminCourseService) {}

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
    @Body() body: UpdateCourseDTO,
  ) {
    return this.coursesService.update(Number(courseId), body);
  }

  @Delete(':courseid')
  removeCourse(@Param('courseid') courseId: string) {
    return this.coursesService.delete(Number(courseId));
  }

  @Get()
  getCourses(
    @CurrentUser() user: { sub: number; name: string },
    @Query('page', ParseIntPipe) page = 1,
    @Query('rpp', ParseIntPipe) rpp = 5,
  ) {
    return this.coursesService.findAll(user.sub, page, rpp);
  }

  @Get('all')
  getAllCourses(@CurrentUser() user: { sub: number }) {
    return this.coursesService.findAllNoPagination(user.sub);
  }

  @Get(':courseid')
  getCourse(
    @Param('courseid') courseId: string,
    @CurrentUser() user: { sub: number; name: string },
  ) {
    return this.coursesService.findOne(Number(courseId), user.sub);
  }
}

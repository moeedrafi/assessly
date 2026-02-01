import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CoursesService } from 'src/courses/courses.service';
import { CreateCourseDTO } from 'src/courses/dtos/create-course.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/enum';
import { AdminGuard } from 'src/guards/admin.guard';
import { User } from 'src/users/user.entity';

@Controller('courses')
export class CoursesController {
  constructor(private coursesServices: CoursesService) {}

  @Post()
  @UseGuards(AdminGuard)
  @Roles(UserRole.ADMIN)
  createCourse(
    @CurrentUser() user: { sub: number; name: string },
    @Body() body: CreateCourseDTO,
  ) {
    return this.coursesServices.create(user.sub, body.name, body.description);
  }
}

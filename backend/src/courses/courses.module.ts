import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Courses } from 'src/courses/courses.entity';
import { UsersModule } from 'src/users/users.module';
import { CoursesService } from 'src/courses/services/courses.service';
import { AdminCourseService } from 'src/courses/services/admin-course.service';
import { CoursesController } from 'src/courses/controllers/courses.controller';
import { AdminCoursesController } from 'src/courses/controllers/admin-courses.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Courses]), UsersModule],
  controllers: [CoursesController, AdminCoursesController],
  providers: [CoursesService, AdminCourseService],
  exports: [CoursesService, AdminCourseService],
})
export class CoursesModule {}

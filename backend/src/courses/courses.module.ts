import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Courses } from 'src/courses/courses.entity';
import { CoursesController } from 'src/courses/courses.controller';
import { CoursesService } from 'src/courses/courses.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Courses]), UsersModule],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}

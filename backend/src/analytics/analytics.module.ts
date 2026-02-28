import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Courses } from 'src/courses/courses.entity';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import { AnalyticsService } from 'src/analytics/analytics.service';
import { AnalyticsController } from 'src/analytics/analytics.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Courses, Quiz])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Courses } from 'src/courses/courses.entity';
import { Quiz } from 'src/quiz/quiz.entity';
import { AnalyticsService } from 'src/analytics/analytics.service';
import { AnalyticsController } from 'src/analytics/analytics.controller';
import { AdminAnalyticsController } from 'src/analytics/admin-analytics.controller';
import { QuizAttempt } from 'src/quiz-attempt/quiz-attempt.entity';
import { QuestionAttempt } from 'src/quiz-attempt/question-attempt.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Courses,
      Quiz,
      QuizAttempt,
      QuestionAttempt,
    ]),
  ],
  controllers: [AdminAnalyticsController, AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}

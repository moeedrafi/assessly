import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizService } from 'src/quiz/quiz.service';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import { OptionModule } from 'src/option/option.module';
import { QuizController } from 'src/quiz/quiz.controller';
import { CoursesModule } from 'src/courses/courses.module';
import { QuestionModule } from 'src/question/question.module';
import { AdminQuizController } from './admin-quiz.controller';
import { QuizAttempt } from './entities/quiz-attempt.entity';
import { QuestionAttempt } from './entities/question-attempt.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz, QuizAttempt, QuestionAttempt]),
    CoursesModule,
    QuestionModule,
    OptionModule,
  ],
  controllers: [QuizController, AdminQuizController],
  providers: [QuizService],
})
export class QuizModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizService } from 'src/quiz/services/quiz.service';
import { Quiz } from 'src/quiz/quiz.entity';
import { OptionModule } from 'src/option/option.module';
import { CoursesModule } from 'src/courses/courses.module';
import { QuestionModule } from 'src/question/question.module';
import { QuizController } from 'src/quiz/controllers/quiz.controller';
import { QuizAdminService } from 'src/quiz/services/quiz-admin.service';
import { AdminQuizController } from 'src/quiz/controllers/admin-quiz.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz]),
    CoursesModule,
    QuestionModule,
    OptionModule,
  ],
  controllers: [QuizController, AdminQuizController],
  providers: [QuizService, QuizAdminService],
})
export class QuizModule {}

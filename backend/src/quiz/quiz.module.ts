import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizService } from 'src/quiz/quiz.service';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import { UsersModule } from 'src/users/users.module';
import { OptionModule } from 'src/option/option.module';
import { QuizController } from 'src/quiz/quiz.controller';
import { CoursesModule } from 'src/courses/courses.module';
import { QuestionModule } from 'src/question/question.module';
import { StudentAnswer } from 'src/quiz/entities/student-answer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz, StudentAnswer]),
    UsersModule,
    CoursesModule,
    QuestionModule,
    OptionModule,
  ],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}

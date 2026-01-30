import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizService } from 'src/quiz/quiz.service';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import { QuizController } from 'src/quiz/quiz.controller';
import { Option } from 'src/quiz/entities/option.entity';
import { Question } from 'src/quiz/entities/question.entity';
import { StudentAnswer } from 'src/quiz/entities/student-answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz, Question, Option, StudentAnswer])],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}

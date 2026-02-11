import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizService } from 'src/quiz/quiz.service';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import { QuizController } from 'src/quiz/quiz.controller';
import { StudentAnswer } from 'src/quiz/entities/student-answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz, StudentAnswer])],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}

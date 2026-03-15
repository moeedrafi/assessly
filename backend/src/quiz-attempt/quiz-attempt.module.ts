import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from 'src/quiz/quiz.entity';
import { QuizAttempt } from 'src/quiz-attempt/quiz-attempt.entity';
import { QuizAttemptService } from 'src/quiz-attempt/quiz-attempt.service';
import { QuestionAttempt } from 'src/quiz-attempt/question-attempt.entity';
import { QuizAttemptController } from 'src/quiz-attempt/quiz-attempt.controller';

@Module({
  imports: [TypeOrmModule.forFeature([QuizAttempt, QuestionAttempt, Quiz])],
  controllers: [QuizAttemptController],
  providers: [QuizAttemptService],
})
export class QuizAttemptModule {}

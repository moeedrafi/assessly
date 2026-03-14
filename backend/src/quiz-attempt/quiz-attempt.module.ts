import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizAttempt } from 'src/quiz-attempt/quiz-attempt.entity';
import { QuizAttemptService } from 'src/quiz-attempt/quiz-attempt.service';
import { QuizAttemptController } from 'src/quiz-attempt/quiz-attempt.controller';

@Module({
  imports: [TypeOrmModule.forFeature([QuizAttempt])],
  controllers: [QuizAttemptController],
  providers: [QuizAttemptService],
})
export class QuizAttemptModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from 'src/quiz/quiz.entity';
import { QuizService } from 'src/quiz/quiz.service';
import { QuizController } from 'src/quiz/quiz.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz])],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}

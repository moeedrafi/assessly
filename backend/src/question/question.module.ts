import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from 'src/quiz/quiz.entity';
import { Question } from 'src/question/question.entity';
import { OptionModule } from 'src/option/option.module';
import { QuestionService } from 'src/question/question.service';
import { QuestionController } from 'src/question/question.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Quiz]), OptionModule],
  providers: [QuestionService],
  controllers: [QuestionController],
  exports: [QuestionService],
})
export class QuestionModule {}

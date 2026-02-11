import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './question.entity';
import { QuestionService } from './question.service';

@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}

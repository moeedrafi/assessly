import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './question.entity';
import { QuestionService } from './question.service';
import { OptionModule } from 'src/option/option.module';

@Module({
  imports: [TypeOrmModule.forFeature([Question]), OptionModule],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}

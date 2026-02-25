import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { QuestionService } from 'src/question/question.service';

@Controller('question')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  @Get(':quizid')
  getAllQuestions(@Param('quizid', ParseIntPipe) quizId: number) {
    return this.questionService.findAll(quizId);
  }
}

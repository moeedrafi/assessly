import { Controller } from '@nestjs/common';
import { QuizService } from 'src/quiz/quiz.service';

@Controller('quiz')
export class QuizController {
  constructor(private quizServices: QuizService) {}
}

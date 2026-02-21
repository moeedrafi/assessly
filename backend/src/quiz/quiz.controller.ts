import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { QuizService } from 'src/quiz/quiz.service';
import { AttemptQuizDTO } from './dtos/attempt-quiz.dto';

@Controller('quiz')
export class QuizController {
  constructor(private quizServices: QuizService) {}

  @Get(':courseid/attemplted')
  getAttemptedQuizzes(
    @CurrentUser() user: { sub: number },
    @Param('courseid') courseId: string,
  ) {
    return this.quizServices.findAttemptedQuizzes(user.sub, Number(courseId));
  }

  @Get(':courseid/upcoming')
  getUpcomingQuizzes(
    @CurrentUser() user: { sub: number },
    @Param('courseid') courseId: string,
  ) {
    return this.quizServices.findUpcomingQuizzes(user.sub, Number(courseId));
  }

  @Get(':courseid/missed')
  getMissedQuizzes(
    @CurrentUser() user: { sub: number },
    @Param('courseid') courseId: string,
  ) {
    return this.quizServices.findMissedQuizzes(user.sub, Number(courseId));
  }

  @Post(':quizid/attempted')
  attemptedQuiz(
    @Param('quizid') quizId: string,
    @CurrentUser() user: { sub: number },
    @Body() body: AttemptQuizDTO,
  ) {
    return this.quizServices.attempt(Number(quizId), user.sub, body);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UserRole } from 'src/enum';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AttemptQuizDTO } from 'src/quiz-attempt/dtos/attempt-quiz.dto';
import { QuizAttemptService } from 'src/quiz-attempt/quiz-attempt.service';
@Controller('quiz-attempt')
export class QuizAttemptController {
  constructor(private quizAttemptService: QuizAttemptService) {}

  @Post(':quizid/attempt')
  attemptQuiz(
    @Param('quizid', ParseIntPipe) quizId: number,
    @CurrentUser() user: { sub: number; role: UserRole },
    @Body() body: AttemptQuizDTO,
  ) {
    return this.quizAttemptService.attempt(quizId, user, body);
  }

  @Get(':quizid/result')
  result(
    @Param('quizid', ParseIntPipe) quizId: number,
    @CurrentUser() user: { sub: number },
  ) {
    return this.quizAttemptService.result(quizId, user.sub);
  }

  // TODO: Leaderboards

  // TODO: Grading

  // TODO: Stats (Best, worst, avg quiz)
  @Get(':courseid/stats')
  getStats(
    @CurrentUser() user: { sub: number },
    @Param('courseid', ParseIntPipe) courseId: number,
  ) {
    return this.quizAttemptService.findStats(user.sub, courseId);
  }
}

import { UserRole } from 'src/enum';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AttemptQuizDTO } from 'src/quiz-attempt/dtos/attempt-quiz.dto';
import { QuizAttemptService } from 'src/quiz-attempt/quiz-attempt.service';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

@Controller('quiz-attempt')
export class QuizAttemptController {
  constructor(private quizAttemptService: QuizAttemptService) {}

  @Get('completed')
  getAllCompletedQuizzes(@CurrentUser() user: { sub: number }) {
    return this.quizAttemptService.findAllCompletedQuizzes(user.sub);
  }

  @Get(':courseid/completed')
  getCompletedQuizzes(
    @CurrentUser() user: { sub: number },
    @Param('courseid', ParseIntPipe) courseId: number,
  ) {
    return this.quizAttemptService.findCompletedQuizzes(user.sub, courseId);
  }

  @Post(':quizid/attempted')
  attemptQuiz(
    @Param('quizid') quizId: string,
    @CurrentUser() user: { sub: number; role: UserRole },
    @Body() body: AttemptQuizDTO,
  ) {
    return this.quizAttemptService.attempt();
  }

  @Get(':quizid/result')
  result(
    @Param('quizid') quizId: string,
    @CurrentUser() user: { sub: number; role: UserRole },
  ) {
    return this.quizAttemptService.result();
  }

  // TODO: Leaderboards
  // TODO: Grading
  // TODO: Stats (Best, worst, avg quiz)
}

import { Controller, Get, Param } from '@nestjs/common';
import { QuizService } from 'src/quiz/services/quiz.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@Controller('quiz')
export class QuizController {
  constructor(private quizServices: QuizService) {}

  /* UPCOMING QUIZZES */
  @Get('upcoming')
  getAllUpcomingQuiz(@CurrentUser() user: { sub: number }) {
    return this.quizServices.findAllUpcomingQuiz(user.sub);
  }

  @Get(':courseid/upcoming')
  getUpcomingQuiz(
    @CurrentUser() user: { sub: number },
    @Param('courseid') courseId: string,
  ) {
    return this.quizServices.findUpcomingQuiz(user.sub, Number(courseId));
  }

  /* AVAILABLE QUIZZES */
  @Get('available')
  getAllAvailableQuiz(@CurrentUser() user: { sub: number }) {
    return this.quizServices.findAllAvailableQuiz(user.sub);
  }

  @Get(':courseid/available')
  getAvailableQuiz(
    @CurrentUser() user: { sub: number },
    @Param('courseid') courseId: string,
  ) {
    return this.quizServices.findAvailableQuiz(user.sub, Number(courseId));
  }

  /* MISSED QUIZZES */
  @Get('missed')
  getAllMissedQuiz(@CurrentUser() user: { sub: number }) {
    return this.quizServices.findAllMissedQuiz(user.sub);
  }

  @Get(':courseid/missed')
  getMissedQuiz(
    @CurrentUser() user: { sub: number },
    @Param('courseid') courseId: string,
  ) {
    return this.quizServices.findMissedQuiz(user.sub, Number(courseId));
  }

  /* COMPLETED QUIZZES */
  // @Get('completed')
  // getAllCompletedQuiz(@CurrentUser() user: { sub: number }) {
  //   return this.quizServices.findAllCompletedQuiz(user.sub);
  // }

  // @Get(':courseid/completed')
  // getCompletedQuiz(
  //   @CurrentUser() user: { sub: number },
  //   @Param('courseid') courseId: string,
  // ) {
  //   return this.quizServices.findCompletedQuiz(user.sub, Number(courseId));
  // }
}

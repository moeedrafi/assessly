import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AdminGuard } from 'src/guards/admin.guard';
import { QuizService } from 'src/quiz/quiz.service';
import { CreateQuizDTO } from './dtos/create-quiz.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { QuizDTO } from './dtos/quiz.dto';
import { AttemptQuizDTO } from './dtos/attempt-quiz.dto';

@Controller('quiz')
export class QuizController {
  constructor(private quizServices: QuizService) {}

  /* ADMIN */
  @Serialize(QuizDTO)
  @Post(':courseid')
  @UseGuards(AdminGuard)
  createCourse(
    @CurrentUser() user: { sub: number; name: string },
    @Param('courseid') courseId: string,
    @Body() body: CreateQuizDTO,
  ) {
    return this.quizServices.create(user.sub, Number(courseId), body);
  }

  @Get('/adming/:courseid/completed')
  @UseGuards(AdminGuard)
  getCompletedQuizzes(
    @CurrentUser() user: { sub: number },
    @Param('courseid') courseId: string,
  ) {
    return this.quizServices.findAdminCompletedQuizzes(
      user.sub,
      Number(courseId),
    );
  }

  @Get('/admin/:courseid/upcoming')
  getAdminUpcomingQuizzes(
    @CurrentUser() user: { sub: number },
    @Param('courseid') courseId: string,
  ) {
    return this.quizServices.findAdminUpcomingQuizzes(
      user.sub,
      Number(courseId),
    );
  }

  /* STUDENTS */
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

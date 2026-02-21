import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AdminGuard } from 'src/guards/admin.guard';
import { QuizService } from 'src/quiz/quiz.service';
import { CreateQuizDTO } from './dtos/create-quiz.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { QuizDTO } from './dtos/quiz.dto';

@Controller('/admin/quiz')
@UseGuards(AdminGuard)
export class AdminQuizController {
  constructor(private quizServices: QuizService) {}

  @Serialize(QuizDTO)
  @Post(':courseid')
  createCourse(
    @CurrentUser() user: { sub: number; name: string },
    @Param('courseid') courseId: string,
    @Body() body: CreateQuizDTO,
  ) {
    return this.quizServices.create(user.sub, Number(courseId), body);
  }

  @Get(':courseid/completed')
  getAdminCompletedQuizzes(
    @CurrentUser() user: { sub: number },
    @Param('courseid') courseId: string,
  ) {
    return this.quizServices.findAdminCompletedQuizzes(
      user.sub,
      Number(courseId),
    );
  }

  @Get(':courseid/upcoming')
  getAdminUpcomingQuizzes(
    @CurrentUser() user: { sub: number },
    @Param('courseid') courseId: string,
  ) {
    return this.quizServices.findAdminUpcomingQuizzes(
      user.sub,
      Number(courseId),
    );
  }
}

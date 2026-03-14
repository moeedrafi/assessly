import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { QuizDTO } from 'src/quiz/dtos/quiz.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { CreateQuizDTO } from 'src/quiz/dtos/create-quiz.dto';
import { QuizDetailDTO } from 'src/quiz/dtos/quiz-detail.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { QuizAdminService } from 'src/quiz/services/quiz-admin.service';

@Controller('/admin/quiz')
@UseGuards(AdminGuard)
export class AdminQuizController {
  constructor(private quizAdminService: QuizAdminService) {}

  @Serialize(QuizDTO)
  @Post()
  createCourse(
    @CurrentUser() user: { sub: number; name: string },
    @Body() body: CreateQuizDTO,
  ) {
    return this.quizAdminService.create(user.sub, body);
  }

  @Get(':courseid/completed')
  getCompletedQuizzes(
    @CurrentUser() user: { sub: number },
    @Param('courseid') courseId: string,
  ) {
    return this.quizAdminService.findCompletedQuiz(user.sub, Number(courseId));
  }

  @Get(':courseid/upcoming')
  getUpcomingQuizzes(
    @CurrentUser() user: { sub: number },
    @Param('courseid') courseId: string,
  ) {
    return this.quizAdminService.findUpcomingQuiz(user.sub, Number(courseId));
  }

  @Get('completed')
  getAllCompletedQuizzes(@CurrentUser() user: { sub: number }) {
    return this.quizAdminService.findAllCompletedQuiz(user.sub);
  }

  @Get('upcoming')
  getAllUpcomingQuizzes(@CurrentUser() user: { sub: number }) {
    return this.quizAdminService.findAllUpcomingQuiz(user.sub);
  }

  @Serialize(QuizDetailDTO)
  @Get(':quizid')
  getOne(
    @CurrentUser() user: { sub: number },
    @Param('quizid', ParseIntPipe) quizId: number,
  ) {
    return this.quizAdminService.findOne(user.sub, quizId);
  }

  // TODO: Delete quiz
  // TODO: Publish quiz
  // TODO: Update quiz
}

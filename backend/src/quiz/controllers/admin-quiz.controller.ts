import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QuizDTO } from 'src/quiz/dtos/quiz.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { QuizFormDTO } from 'src/quiz/dtos/quiz-form.dto';
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
  createQuiz(
    @CurrentUser() user: { sub: number; name: string },
    @Body() body: CreateQuizDTO,
  ) {
    return this.quizAdminService.create(user.sub, body);
  }

  @Get('range')
  getQuizFromDateRange(
    @CurrentUser() user: { sub: number },
    @Query('page', ParseIntPipe) page = 1,
    @Query('rpp', ParseIntPipe) rpp = 5,
    @Query('status') status: 'upcoming' | 'completed',
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.quizAdminService.findDateRangeQuiz(
      user.sub,
      page,
      rpp,
      status,
      from,
      to,
    );
  }

  @Get(':courseid')
  getCourseQuiz(
    @CurrentUser() user: { sub: number },
    @Param('courseid', ParseIntPipe) courseId: number,
    @Query('page', ParseIntPipe) page = 1,
    @Query('rpp', ParseIntPipe) rpp = 5,
    @Query('status') status: 'upcoming' | 'completed',
  ) {
    return this.quizAdminService.findAllCourseQuiz(
      user.sub,
      courseId,
      page,
      rpp,
      status,
    );
  }

  @Serialize(QuizFormDTO)
  @Get(':quizid/form')
  getQuiz(
    @CurrentUser() user: { sub: number; name: string },
    @Param('quizid', ParseIntPipe) quizId: number,
  ) {
    return this.quizAdminService.getQuizDetail(user.sub, quizId);
  }

  @Serialize(QuizDetailDTO)
  @Get(':quizid/detail')
  getOne(
    @CurrentUser() user: { sub: number },
    @Param('quizid', ParseIntPipe) quizId: number,
  ) {
    return this.quizAdminService.findOne(user.sub, quizId);
  }
}

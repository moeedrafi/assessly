import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { QuizService } from 'src/quiz/services/quiz.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@Controller('quiz')
export class QuizController {
  constructor(private quizServices: QuizService) {}

  @Get()
  getAll(
    @CurrentUser() user: { sub: number },
    @Query('page', ParseIntPipe) page = 1,
    @Query('rpp', ParseIntPipe) rpp = 5,
    @Query('status') status: 'missed' | 'upcoming' | 'completed',
  ) {
    return this.quizServices.findAll(user.sub, page, rpp, status);
  }

  @Get(':courseid')
  getCourseQuiz(
    @CurrentUser() user: { sub: number },
    @Param('courseid', ParseIntPipe) courseId: number,
    @Query('page', ParseIntPipe) page = 1,
    @Query('rpp', ParseIntPipe) rpp = 5,
    @Query('status') status: 'missed' | 'upcoming' | 'completed',
  ) {
    return this.quizServices.findAllCourseQuiz(
      user.sub,
      courseId,
      page,
      rpp,
      status,
    );
  }

  /* AVAILABLE QUIZZES */
  @Get('available')
  getAllAvailableQuiz(
    @CurrentUser() user: { sub: number },
    @Query('page', ParseIntPipe) page = 1,
    @Query('rpp', ParseIntPipe) rpp = 5,
  ) {
    return this.quizServices.findAllAvailableQuiz(user.sub, page, rpp);
  }

  @Get(':courseid/available')
  getCourseAvailable(
    @CurrentUser() user: { sub: number },
    @Param('courseid', ParseIntPipe) courseId: number,
    @Query('page', ParseIntPipe) page = 1,
    @Query('rpp', ParseIntPipe) rpp = 5,
  ) {
    return this.quizServices.findCourseAvailableQuiz(
      user.sub,
      courseId,
      page,
      rpp,
    );
  }
}

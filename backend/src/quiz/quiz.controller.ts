import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/enum';
import { AdminGuard } from 'src/guards/admin.guard';
import { QuizService } from 'src/quiz/quiz.service';
import { CreateQuizDTO } from './dtos/create-quiz.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { QuizDTO } from './dtos/quiz.dto';

@Controller('quiz')
export class QuizController {
  constructor(private quizServices: QuizService) {}

  /* ADMIN */
  @Serialize(QuizDTO)
  @Post(':courseid')
  @UseGuards(AdminGuard)
  @Roles(UserRole.ADMIN)
  createCourse(
    @CurrentUser() user: { sub: number; name: string },
    @Param('courseid') courseId: string,
    @Body() body: CreateQuizDTO,
  ) {
    return this.quizServices.create(user.sub, Number(courseId), body);
  }
}

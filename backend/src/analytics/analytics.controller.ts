import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { AnalyticsService } from 'src/analytics/analytics.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('recent-quiz')
  getRecentQuiz(@CurrentUser() user: { sub: number }) {
    return this.analyticsService.getRecentQuiz(user.sub);
  }

  @Get('course-snapshot')
  courseSnapshot(
    @CurrentUser() user: { sub: number },
    @Query('page', ParseIntPipe) page = 1,
    @Query('rpp', ParseIntPipe) rpp = 5,
  ) {
    return this.analyticsService.studentCourseSnapshot(user.sub, page, rpp);
  }
}

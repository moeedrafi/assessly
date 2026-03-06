import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from 'src/analytics/analytics.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('recent-quiz')
  getRecentQuiz(@CurrentUser() user: { sub: number }) {
    return this.analyticsService.getRecentQuiz(user.sub);
  }
}

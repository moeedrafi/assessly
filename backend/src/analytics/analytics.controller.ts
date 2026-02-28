import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from 'src/analytics/analytics.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboardAnalytics() {
    return this.analyticsService.getDashboardAnalytics();
  }

  @Get('kpis')
  async getDashboardKpis() {
    const data = await this.analyticsService.getDashboardKpis();

    return {
      data,
      message: 'Fetched KPIs successfully',
      meta: null,
    };
  }

  @Get('recent-users')
  async getRecentRegisteredUsers(
    @CurrentUser() user: { sub: number; role: string },
  ) {
    const data = await this.analyticsService.getRecentRegisteredUsers(user.sub);
    return { data, message: 'Fetched recent users successfully', meta: null };
  }

  @Get('course-snapshots')
  getCourseSnapshots() {
    return this.analyticsService.getCourseSnapshots();
  }

  @Get('alerts')
  getDashboardAlerts() {
    return this.analyticsService.getDashboardAlerts();
  }
}

import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from 'src/analytics/analytics.service';

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
  getRecentRegisteredUsers() {
    return this.analyticsService.getRecentRegisteredUsers();
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

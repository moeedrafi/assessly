import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
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

  @Get('course-snapshot')
  async getCourseSnapshots(
    @CurrentUser() user: { sub: number; role: string },
    @Query('page', ParseIntPipe) page = 1,
    @Query('rpp', ParseIntPipe) rpp = 5,
  ) {
    const data = await this.analyticsService.getCourseSnapshots(
      user.sub,
      page,
      rpp,
    );
    return {
      data,
      message: 'Fetched course snapshot successfully',
      meta: {
        totalItems: data.totalItems,
        totalPages: Math.ceil(data.totalItems / rpp),
        page,
        rpp,
      },
    };
  }

  @Get('alerts')
  getDashboardAlerts() {
    return this.analyticsService.getDashboardAlerts();
  }
}

import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Courses } from 'src/courses/courses.entity';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import { DashboardKpisDTO } from './dtos/dashboard-kpis.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Courses)
    private readonly courseRepo: Repository<Courses>,

    @InjectRepository(Quiz)
    private readonly quizRepo: Repository<Quiz>,
  ) {}

  async getDashboardAnalytics() {
    await Promise.all([
      this.getDashboardKpis(),
      this.getRecentRegisteredUsers(),
      this.getCourseSnapshots,
      this.getDashboardAlerts(),
    ]);
  }

  async getDashboardKpis(): Promise<DashboardKpisDTO> {
    const [totalUsers, totalCourses, totalQuizzes] = await Promise.all([
      this.userRepo.count(),
      this.courseRepo.count(),
      this.quizRepo.count(),
    ]);

    return {
      totalUsers,
      totalCourses,
      totalQuizzes,
    };
  }

  async getRecentRegisteredUsers(limit = 5) {}

  async getCourseSnapshots() {}

  async getDashboardAlerts() {}
}

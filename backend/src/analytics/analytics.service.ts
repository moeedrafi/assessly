import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Courses } from 'src/courses/courses.entity';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import { DashboardKpisDTO } from './dtos/dashboard-kpis.dto';
import { RecentUserDTO } from './dtos/recent-user.dto';

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

  async getDashboardAnalytics() {}

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

  async getRecentRegisteredUsers(
    userId: number,
    limit: number = 5,
  ): Promise<RecentUserDTO[]> {
    const courses = await this.courseRepo.find({
      where: { teacher: { id: userId } },
    });
    const courseIds = courses.map((c) => c.id);

    const users = await this.userRepo
      .createQueryBuilder('user')
      .leftJoin('user.joinedCourses', 'joinedCourses')
      .select([
        'user.id',
        'user.name',
        'user.email',
        'joinedCourses.id',
        'joinedCourses.name',
      ])
      .where('joinedCourses.id IN (:...courseIds)', { courseIds })
      .andWhere('user.role != :role', { role: 'ADMIN' })
      .orderBy('user.createdAt', 'DESC')
      .limit(limit)
      .getMany();

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      joinedCourses: (user.joinedCourses || []).map((course) => ({
        id: course.id,
        name: course.name,
      })),
    }));
  }

  async getCourseSnapshots() {}

  async getDashboardAlerts() {}
}

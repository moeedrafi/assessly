import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Courses } from 'src/courses/courses.entity';
import { Quiz } from 'src/quiz/quiz.entity';
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

  async getCourseSnapshots(teacherId: number, page: number, rpp: number) {
    const offset = (page - 1) * rpp;

    const totalItems = await this.courseRepo
      .createQueryBuilder('course')
      .where('course.teacherId = :teacherId', { teacherId })
      .getCount();

    const rows = await this.courseRepo
      .createQueryBuilder('course')
      .where('course.teacherId = :teacherId', { teacherId })
      .leftJoin('course.students', 'students')
      .leftJoin('course.quizzes', 'quiz')
      .leftJoin('quiz.studentAnswers', 'sa')
      .select('course.id', 'id')
      .addSelect('course.name', 'title')
      .addSelect('COUNT(DISTINCT students.id)', 'totalStudents')
      .addSelect('AVG(sa.totalScore)', 'avgScore')
      .addSelect(
        `
      (
        SUM(
          CASE 
            WHEN sa.totalScore >= quiz.passingMarks THEN 1
            ELSE 0
          END
        ) * 100.0
        /
        NULLIF(COUNT(sa.id), 0)
      )
    `,
        'passRate',
      )
      .groupBy('course.id')
      .addGroupBy('course.name')
      .limit(rpp)
      .offset(offset)
      .getRawMany();

    return {
      totalItems,
      rows: rows.map((row) => ({
        id: Number(row.id),
        title: row.title,
        totalStudents: Number(row.totalStudents),
        avgScore: Number(row.avgScore) || 0,
        passRate: Number(row.passRate) || 0,
      })),
    };
  }

  async getRecentQuiz(studentId: number) {
    const quizzes = await this.quizRepo
      .createQueryBuilder('quiz')
      .innerJoin('quiz.attempts', 'attempt', 'attempt.studentId = :studentId', {
        studentId,
      })
      .leftJoin('quiz.attempts', 'allAttempts')

      .select('quiz.id', 'id')
      .addSelect('quiz.name', 'name')
      .addSelect('quiz.totalMarks', 'totalMarks')
      .addSelect('quiz.passingMarks', 'passingMarks')
      .addSelect('attempt.score', 'score')
      .addSelect('ROUND(AVG(allAttempts.score), 2)', 'avgScore')

      .groupBy('quiz.id')
      .addGroupBy('quiz.name')
      .addGroupBy('quiz.totalMarks')
      .addGroupBy('quiz.passingMarks')
      .addGroupBy('attempt.score')
      .addGroupBy('attempt.createdAt')

      .orderBy('attempt.createdAt', 'DESC')
      .getRawMany();

    return { data: quizzes, message: 'Fetched recent quizzes' };
  }

  async studentCourseSnapshot(studentId: number, page: number, rpp: number) {
    const offset = (page - 1) * rpp;

    const totalItems = await this.courseRepo
      .createQueryBuilder('course')
      .innerJoin('course.students', 'student', 'student.id = :studentId', {
        studentId,
      })
      .getCount();

    const data = await this.courseRepo
      .createQueryBuilder('course')
      .innerJoin('course.students', 'student', 'student.id = :studentId', {
        studentId,
      })
      .leftJoin('course.quizzes', 'quiz')
      .innerJoin('quiz.attempts', 'attempt', 'attempt.studentId = :studentId', {
        studentId,
      })
      .leftJoin('quiz.attempts', 'allAttempts')

      .select('course.id', 'id')
      .addSelect('course.name', 'name')
      .addSelect('COUNT(DISTINCT quiz.id)', 'totalQuizzes')
      .addSelect('ROUND(AVG(attempt.score), 2)', 'yourAvg')
      .addSelect('ROUND(AVG(allAttempts.score), 2)', 'totalAvg')

      .groupBy('course.id')
      .addGroupBy('course.name')

      .limit(rpp)
      .offset(offset)
      .getRawMany();

    return {
      data,
      message: 'Fetched student course snapshot successfully',
      meta: {
        totalItems,
        totalPages: Math.ceil(totalItems / rpp),
        page,
        rpp,
      },
    };
  }
}

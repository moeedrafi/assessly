import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Quiz } from 'src/quiz/quiz.entity';

@Injectable()
export class QuizService {
  constructor(@InjectRepository(Quiz) private repo: Repository<Quiz>) {}

  private buildQuizQuery(studentId: number) {
    return this.repo
      .createQueryBuilder('quiz')
      .innerJoin('quiz.course', 'course')
      .innerJoin('course.students', 'student', 'student.id = :studentId', {
        studentId,
      })
      .where('quiz.isPublished = true');
  }

  async findAll(
    studentId: number,
    page: number,
    rpp: number,
    status: 'missed' | 'upcoming' | 'completed',
  ) {
    const now = new Date();
    const offset = (page - 1) * rpp;
    const query = this.buildQuizQuery(studentId);

    if (status === 'completed') {
      query.andWhere('quiz.endsAt < :now', { now }).andWhere(
        `EXISTS (SELECT 1 FROM quiz_attempt a
          WHERE a."quizId" = quiz.id
          AND a."studentId" = :studentId
          )`,
        { studentId },
      );
    } else if (status === 'missed') {
      query.andWhere('quiz.endsAt < :now', { now }).andWhere(
        `NOT EXISTS (SELECT 1 FROM quiz_attempt a
          WHERE a."quizId" = quiz.id
          AND a."studentId" = :studentId
          )`,
        { studentId },
      );
    } else if (status === 'upcoming') {
      query.andWhere('quiz.startsAt > :now', { now }).andWhere(
        `NOT EXISTS (SELECT 1 FROM quiz_attempt a
          WHERE a."quizId" = quiz.id
          AND a."studentId" = :studentId
          )`,
        { studentId },
      );
    }

    const [quizzes, totalItems] = await query
      .offset(offset)
      .limit(rpp)
      .orderBy('quiz.createdAt', 'DESC')
      .getManyAndCount();

    // const t = await this.buildQuizQuery(studentId).getCount();

    return {
      data: quizzes,
      message: `Successfully fetched ${status ?? 'all'} quizzes`,
      meta: {
        totalItems,
        totalPages: Math.ceil(totalItems / rpp),
        page,
        rpp,
      },
    };
  }

  async findAllCourseQuiz(
    studentId: number,
    courseId: number,
    page: number,
    rpp: number,
    status: 'missed' | 'upcoming' | 'completed',
  ) {
    if (!courseId) throw new UnauthorizedException('course id required');
    const now = new Date();
    const offset = (page - 1) * rpp;
    const query = this.buildQuizQuery(studentId);

    if (status === 'completed') {
      query
        .andWhere('quiz.endsAt < :now', { now })
        .andWhere(
          `EXISTS (SELECT 1 FROM attempts a
          WHERE a.quizId = quiz.id
          AND a.studentId = :studentId
          )`,
        )
        .andWhere('course.id = :courseId', { courseId });
    } else if (status === 'missed') {
      query
        .andWhere('quiz.endsAt < :now', { now })
        .andWhere(
          `NOT EXISTS (SELECT 1 FROM attempts a
          WHERE a.quizId = quiz.id
          AND a.studentId = :studentId
          )`,
        )
        .andWhere('course.id = :courseId', { courseId });
    } else if (status === 'upcoming') {
      query
        .andWhere('quiz.startsAt > :now', { now })
        .andWhere(
          `NOT EXISTS (SELECT 1 FROM attempts a
          WHERE a.quizId = quiz.id
          AND a.studentId = :studentId
          )`,
        )
        .andWhere('course.id = :courseId', { courseId });
    }

    const [quizzes, totalItems] = await query
      .offset(offset)
      .limit(rpp)
      .orderBy('quiz.createdAt', 'DESC')
      .getManyAndCount();

    return {
      data: quizzes,
      message: `Successfully fetched ${status ?? 'all'} quizzes`,
      meta: {
        totalItems,
        totalPages: Math.ceil(totalItems / rpp),
        page,
        rpp,
      },
    };
  }

  async findDateRangeQuiz(
    studentId: number,
    from: string,
    to: string,
    page: number,
    rpp: number,
  ) {
    const offset = (page - 1) * rpp;
    const start = new Date(from);
    const end = new Date(to);

    const [quizzes, totalItems] = await this.buildQuizQuery(studentId)
      .andWhere('quiz.createdAt BETWEEN :start AND :end', { start, end })
      .offset(offset)
      .limit(rpp)
      .orderBy('quiz.createdAt', 'DESC')
      .getManyAndCount();

    return {
      data: quizzes,
      message: 'Fetched quizzes from range',
      meta: {
        totalItems,
        totalPages: Math.ceil(totalItems / rpp),
        page,
        rpp,
      },
    };
  }

  /* AVAILABLE QUIZZES */
  async findAllAvailableQuiz(studentId: number, page: number, rpp: number) {
    const now = new Date();
    const offset = (page - 1) * rpp;

    const [quizzes, totalItems] = await this.buildQuizQuery(studentId)
      .andWhere('quiz.startsAt <= :now', { now })
      .andWhere('quiz.endsAt > :now', { now })
      .andWhere(
        `NOT EXISTS (SELECT 1 FROM quiz_attempt a
          WHERE a."quizId" = quiz.id
          AND a."studentId" = :studentId
          )`,
        { studentId },
      )
      .offset(offset)
      .limit(rpp)
      .orderBy('quiz.createdAt', 'DESC')
      .getManyAndCount();

    return {
      data: quizzes,
      message: 'Successfully fetched all Upcoming quizzes',
      meta: {
        totalItems,
        totalPages: Math.ceil(totalItems / rpp),
        page,
        rpp,
      },
    };
  }

  async findCourseAvailableQuiz(
    studentId: number,
    courseId: number,
    page: number,
    rpp: number,
  ) {
    const now = new Date();
    const offset = (page - 1) * rpp;

    const [quizzes, totalItems] = await this.buildQuizQuery(studentId)
      .andWhere('quiz.startsAt <= :now', { now })
      .andWhere('quiz.endsAt > :now', { now })
      .andWhere(
        `NOT EXISTS (SELECT 1 FROM quiz_attempt a
          WHERE a."quizId" = quiz.id
          AND a."studentId" = :studentId
          )`,
        { studentId },
      )
      .andWhere('course.id = :courseId', { courseId })
      .offset(offset)
      .limit(rpp)
      .orderBy('quiz.createdAt', 'DESC')
      .getManyAndCount();

    return {
      data: quizzes,
      message: 'Successfully fetched all Upcoming quizzes',
      meta: {
        totalItems,
        totalPages: Math.ceil(totalItems / rpp),
        page,
        rpp,
      },
    };
  }
}

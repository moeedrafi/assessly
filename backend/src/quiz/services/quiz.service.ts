import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Quiz } from 'src/quiz/quiz.entity';

@Injectable()
export class QuizService {
  constructor(@InjectRepository(Quiz) private repo: Repository<Quiz>) {}

  private buildStudentQuizQuery(studentId: number) {
    return this.repo
      .createQueryBuilder('quiz')
      .innerJoin('quiz.course', 'course')
      .innerJoin('course.students', 'student', 'student.id = :studentId', {
        studentId,
      })
      .leftJoin('quiz.attempts', 'attempt', 'attempt.studentId = :studentId', {
        studentId,
      })
      .where('quiz.isPublished = true');
  }

  async findUpcomingQuiz(studentId: number, courseId: number) {
    if (!courseId) throw new UnauthorizedException('course id required');

    const now = new Date();

    const quizzes = await this.buildStudentQuizQuery(studentId)
      .andWhere('quiz.startsAt > :now', { now })
      .andWhere('attempt.id IS NULL')
      .andWhere('course.id = :courseId', { courseId })
      .getMany();

    return { data: quizzes, message: 'Fetched upcoming quizzes' };
  }

  async findMissedQuiz(studentId: number, courseId: number) {
    const now = new Date();

    const quizzes = await this.buildStudentQuizQuery(studentId)
      .andWhere('quiz.endsAt < :now', { now })
      .andWhere('course.id = :courseId', { courseId })
      .andWhere('attempt.id IS NULL')
      .getMany();

    return { data: quizzes, message: 'Fetched missed quizzes' };
  }

  async findCompletedQuiz(studentId: number, courseId: number) {
    if (!courseId) throw new UnauthorizedException('course id required');

    const now = new Date();

    const quizzes = await this.buildStudentQuizQuery(studentId)
      .andWhere('quiz.endsAt < :now', { now })
      .andWhere('attempt.id IS NOT NULL')
      .andWhere('course.id = :courseId', { courseId })
      .getMany();

    return { data: quizzes, message: 'Fetched completed quizzes' };
  }

  async findAll(
    studentId: number,
    page: number,
    rpp: number,
    status: 'missed' | 'upcoming' | 'completed',
  ) {
    const now = new Date();
    const offset = (page - 1) * rpp;

    if (status === 'completed') {
      const [quizzes, totalItems] = await this.buildStudentQuizQuery(studentId)
        .andWhere('quiz.endsAt < :now', { now })
        .andWhere('attempt.id IS NOT NULL')
        .offset(offset)
        .limit(rpp)
        .orderBy('quiz.createdAt', 'DESC')
        .getManyAndCount();

      return {
        data: quizzes,
        message: 'Successfully fetched all completed quizzes',
        meta: {
          totalItems,
          totalPages: Math.ceil(totalItems / rpp),
          page,
          rpp,
        },
      };
    } else if (status === 'missed') {
      const [quizzes, totalItems] = await this.buildStudentQuizQuery(studentId)
        .where('quiz.startsAt < :now', { now })
        .andWhere('attempt.id IS NULL')
        .offset(offset)
        .limit(rpp)
        .orderBy('quiz.createdAt', 'DESC')
        .getManyAndCount();

      return {
        data: quizzes,
        message: 'Successfully fetched all completed quizzes',
        meta: {
          totalItems,
          totalPages: Math.ceil(totalItems / rpp),
          page,
          rpp,
        },
      };
    } else if (status === 'upcoming') {
      const [quizzes, totalItems] = await this.buildStudentQuizQuery(studentId)
        .andWhere('quiz.startsAt > :now', { now })
        .andWhere('attempt.id IS NULL')
        .offset(offset)
        .limit(rpp)
        .orderBy('quiz.createdAt', 'DESC')
        .getManyAndCount();

      return {
        data: quizzes,
        message: 'Successfully fetched all upcoming quizzes',
        meta: {
          totalItems,
          totalPages: Math.ceil(totalItems / rpp),
          page,
          rpp,
        },
      };
    } else {
      const [quizzes, totalItems] = await this.buildStudentQuizQuery(studentId)
        .offset(offset)
        .limit(rpp)
        .orderBy('quiz.createdAt', 'DESC')
        .getManyAndCount();

      return {
        data: quizzes,
        message: 'Successfully fetched all quizzes',
        meta: {
          totalItems,
          totalPages: Math.ceil(totalItems / rpp),
          page,
          rpp,
        },
      };
    }
  }

  /* AVAILABLE QUIZZES */
  async findAllAvailableQuiz(studentId: number, page: number, rpp: number) {
    const now = new Date();
    const offset = (page - 1) * rpp;

    const [quizzes, totalItems] = await this.buildStudentQuizQuery(studentId)
      .andWhere('quiz.startsAt <= :now', { now })
      .andWhere('quiz.endsAt > :now', { now })
      .andWhere('attempt.id IS NULL')
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

  async findAvailableQuiz(studentId: number, courseId: number) {
    const now = new Date();

    const quizzes = await this.buildStudentQuizQuery(studentId)
      .andWhere('quiz.startsAt <= :now', { now })
      .andWhere('quiz.endsAt > :now', { now })
      .andWhere('attempt.id IS NULL')
      .andWhere('course.id = :courseId', { courseId })
      .getMany();

    return {
      data: quizzes,
      message: 'Successfully fetched all Upcoming quizzes',
      meta: null,
    };
  }
}

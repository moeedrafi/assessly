import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Quiz } from 'src/quiz/quiz.entity';
import { CoursesService } from 'src/courses/services/courses.service';
import { UserRole } from 'src/enum';
import { AttemptQuizDTO } from 'src/quiz-attempt/dtos/attempt-quiz.dto';
import { QuestionAttempt } from 'src/quiz-attempt/question-attempt.entity';
import { QuizAttempt } from 'src/quiz-attempt/quiz-attempt.entity';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz) private repo: Repository<Quiz>,
    private coursesServices: CoursesService,
  ) {}

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

  /* UPCOMING QUIZZES */
  async findAllUpcomingQuiz(studentId: number) {
    const now = new Date();

    const quizzes = await this.buildStudentQuizQuery(studentId)
      .andWhere('quiz.startsAt > :now', { now })
      .andWhere('attempt.id IS NULL')
      .getMany();

    return {
      data: quizzes,
      message: 'Successfully fetched all Upcoming quizzes',
      meta: null,
    };
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

  /* AVAILABLE QUIZZES */
  async findAllAvailableQuiz(studentId: number) {
    const now = new Date();

    const quizzes = await this.buildStudentQuizQuery(studentId)
      .andWhere('quiz.startsAt <= :now', { now })
      .andWhere('quiz.endsAt > :now', { now })
      .andWhere('attempt.id IS NULL')
      .getMany();

    return {
      data: quizzes,
      message: 'Successfully fetched all Upcoming quizzes',
      meta: null,
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

  /* MISSED QUIZZES */
  async findAllMissedQuiz(studentId: number) {
    const now = new Date();

    const quizzes = await this.buildStudentQuizQuery(studentId)
      .where('quiz.startsAt < :now', { now })
      .andWhere('attempt.id IS NULL')
      .getMany();

    return {
      data: quizzes,
      message: 'Successfully fetched all Upcoming quizzes',
      meta: null,
    };
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

  /* COMPLETED QUIZZES */
  async findAllCompletedQuiz(studentId: number) {
    const now = new Date();

    const quizzes = await this.buildStudentQuizQuery(studentId)
      .andWhere('quiz.endsAt < :now', { now })
      .andWhere('attempt.id IS NOT NULL')
      .getMany();

    return {
      data: quizzes,
      message: 'Successfully fetched all completed quizzes',
      meta: null,
    };
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
}

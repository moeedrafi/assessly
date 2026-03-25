import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Quiz } from 'src/quiz/quiz.entity';
import { CreateQuizDTO } from 'src/quiz/dtos/create-quiz.dto';
import { QuestionService } from 'src/question/question.service';
import { AdminCourseService } from 'src/courses/services/admin-course.service';

@Injectable()
export class QuizAdminService {
  constructor(
    @InjectRepository(Quiz) private repo: Repository<Quiz>,
    private coursesService: AdminCourseService,
    private questionServices: QuestionService,
  ) {}

  private buildQuizQuery(teacherId: number) {
    return this.repo
      .createQueryBuilder('quiz')
      .innerJoin('quiz.course', 'course')
      .innerJoin('course.teacher', 'teacher', 'teacher.id = :teacherId', {
        teacherId,
      });
  }

  async create(teacherId: number, createQuizDto: CreateQuizDTO) {
    if (!teacherId) throw new UnauthorizedException('not authenticated');

    const { courseId, ...quizDto } = createQuizDto;

    await this.coursesService.findOne(courseId, teacherId);

    const {
      description,
      isPublished,
      name,
      passingMarks,
      questions,
      timeLimit,
      totalMarks,
      startsAt,
      endsAt,
    } = quizDto;

    const quiz = this.repo.create({
      name,
      description,
      passingMarks,
      timeLimit,
      totalMarks,
      isPublished,
      course: { id: courseId },
      startsAt: startsAt ? new Date(startsAt) : new Date(),
      endsAt: endsAt ? new Date(endsAt) : '',
    });

    const savedQuiz = await this.repo.save(quiz);

    for (const q of questions) {
      await this.questionServices.create({ ...q, quiz: savedQuiz });
    }

    return {
      data: savedQuiz,
      message: 'Successfully Created Quiz',
    };
  }

  async findAll(
    teacherId: number,
    page: number,
    rpp: number,
    status: 'upcoming' | 'completed',
  ) {
    const now = new Date();
    const offset = (page - 1) * rpp;
    const query = this.buildQuizQuery(teacherId);

    if (status === 'completed') {
      query.andWhere('quiz.endsAt < :now', { now });
    } else if (status === 'upcoming') {
      query.andWhere('quiz.startsAt > :now', { now });
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

  async findAllCourseQuiz(
    teacherId: number,
    courseId: number,
    page: number,
    rpp: number,
    status: 'upcoming' | 'completed',
  ) {
    if (!courseId) throw new UnauthorizedException('course id required');
    const now = new Date();
    const offset = (page - 1) * rpp;
    const query = this.buildQuizQuery(teacherId).andWhere(
      'course.id = :courseId',
      { courseId },
    );

    if (status === 'completed') {
      query.andWhere('quiz.endsAt < :now', { now });
    } else if (status === 'upcoming') {
      query.andWhere('quiz.startsAt > :now', { now });
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

  async findOne(teacherId: number, quizId: number) {
    if (!quizId) throw new UnauthorizedException('quiz not found');

    const quiz = await this.buildQuizQuery(teacherId)
      .addSelect(['course.name', 'teacher.name'])
      .andWhere('quiz.id = :quizId', { quizId })
      .getOne();

    return {
      data: quiz,
      message: 'Successfully fetched quiz',
    };
  }
}

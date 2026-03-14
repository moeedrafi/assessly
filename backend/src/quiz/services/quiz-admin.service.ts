import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, Repository } from 'typeorm';
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

  async findCompletedQuiz(teacherId: number, courseId: number) {
    if (!teacherId) throw new UnauthorizedException('not authenticated');
    if (!courseId) throw new UnauthorizedException('course id required');

    const quizzes = await this.repo.find({
      where: {
        course: { id: courseId, teacher: { id: teacherId } },
        endsAt: LessThan(new Date()),
      },
    });

    return {
      data: quizzes,
      message: 'Successfully fetched completed quizzes',
      meta: null,
    };
  }

  async findUpcomingQuiz(teacherId: number, courseId: number) {
    if (!teacherId) throw new UnauthorizedException('not authenticated');
    if (!courseId) throw new UnauthorizedException('course id required');

    const quizzes = await this.repo.find({
      where: {
        course: { id: courseId, teacher: { id: teacherId } },
        endsAt: MoreThan(new Date()),
      },
    });

    return {
      data: quizzes,
      message: 'Successfully fetched upcoming quizzes',
      meta: null,
    };
  }

  async findAllCompletedQuiz(teacherId: number) {
    if (!teacherId) throw new UnauthorizedException('not authenticated');
    const now = new Date();

    const quizzes = await this.repo
      .createQueryBuilder('quiz')
      .leftJoin('quiz.course', 'course')
      .leftJoin('course.teacher', 'teacher')
      .where('teacher.id = :teacherId', { teacherId })
      .andWhere('quiz.endsAt < :now', { now })
      .getMany();

    return {
      data: quizzes,
      message: 'Successfully fetched all completed quizzes',
      meta: null,
    };
  }

  async findAllUpcomingQuiz(teacherId: number) {
    if (!teacherId) throw new UnauthorizedException('not authenticated');
    const now = new Date();

    const quizzes = await this.repo
      .createQueryBuilder('quiz')
      .leftJoin('quiz.course', 'course')
      .leftJoin('course.teacher', 'teacher')
      .where('teacher.id = :teacherId', { teacherId })
      .andWhere('quiz.endsAt > :now', { now })
      .getMany();

    return {
      data: quizzes,
      message: 'Successfully fetched all Upcoming quizzes',
      meta: null,
    };
  }

  async findOne(teacherId: number, quizId: number) {
    if (!teacherId) throw new UnauthorizedException('not authenticated');
    if (!quizId) throw new UnauthorizedException('quiz not found');

    const quiz = await this.repo
      .createQueryBuilder('quiz')
      .innerJoin('quiz.course', 'course')
      .innerJoin('course.teacher', 'teacher')
      .addSelect(['course.name', 'teacher.name'])
      .where('quiz.id = :quizId', { quizId })
      .andWhere('teacher.id = :teacherId', { teacherId })
      .getOne();

    return {
      data: quiz,
      message: 'Successfully fetched quiz',
    };
  }
}

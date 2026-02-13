import { LessThan, MoreThan, Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import { UsersService } from 'src/users/users.service';
import { CoursesService } from 'src/courses/courses.service';
import { QuestionService } from 'src/question/question.service';
import { CreateQuizDTO } from './dtos/create-quiz.dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz) private repo: Repository<Quiz>,
    private usersServices: UsersService,
    private coursesServices: CoursesService,
    private questionServices: QuestionService,
  ) {}

  async create(
    teacherId: number,
    courseId: number,
    createQuizDto: CreateQuizDTO,
  ) {
    if (!teacherId) throw new UnauthorizedException('not authenticated');
    if (!courseId) throw new UnauthorizedException('course id required');

    const course = await this.coursesServices.findOne(courseId, teacherId);
    if (!course) throw new UnauthorizedException('course not found');

    const {
      description,
      isPublished,
      name,
      passingMarks,
      question,
      timeLimit,
      totalMarks,
      startsAt,
      endsAt,
    } = createQuizDto;

    const quiz = this.repo.create({
      name,
      description,
      passingMarks,
      timeLimit,
      totalMarks,
      isPublished,
      course,
      startsAt: startsAt ? new Date(startsAt) : new Date(),
      endsAt: endsAt ? new Date(endsAt) : '',
    });

    const savedQuiz = await this.repo.save(quiz);

    for (const q of question) {
      await this.questionServices.create({ ...q, quiz: savedQuiz });
    }

    return {
      data: savedQuiz,
      message: 'Successfully Created Quiz',
    };
  }

  async findCompletedQuizzes(teacherId: number, courseId: number) {
    if (!teacherId) throw new UnauthorizedException('not authenticated');
    if (!courseId) throw new UnauthorizedException('course id required');

    const course = await this.coursesServices.findOne(courseId, teacherId);
    if (!course) throw new UnauthorizedException('course not found');

    const quizzes = await this.repo.find({
      where: { course, endsAt: LessThan(new Date()) },
    });

    return quizzes;
  }

  async findUpcomingQuizzes(teacherId: number, courseId: number) {
    if (!teacherId) throw new UnauthorizedException('not authenticated');
    if (!courseId) throw new UnauthorizedException('course id required');

    const course = await this.coursesServices.findOne(courseId, teacherId);
    if (!course) throw new UnauthorizedException('course not found');

    const quizzes = await this.repo.find({
      where: { course, endsAt: MoreThan(new Date()) },
    });

    return quizzes;
  }
}

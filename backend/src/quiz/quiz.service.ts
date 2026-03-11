import { LessThan, MoreThan, Repository } from 'typeorm';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import { CoursesService } from 'src/courses/courses.service';
import { QuestionService } from 'src/question/question.service';
import { CreateQuizDTO } from './dtos/create-quiz.dto';
import { AttemptQuizDTO } from './dtos/attempt-quiz.dto';
import { UserRole } from 'src/enum';
import { QuestionAttempt } from './entities/question-attempt.entity';
import { QuizAttempt } from './entities/quiz-attempt.entity';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz) private repo: Repository<Quiz>,
    private coursesServices: CoursesService,
    private questionServices: QuestionService,
    @InjectRepository(QuizAttempt)
    private quizAttemptRepo: Repository<QuizAttempt>,
    @InjectRepository(QuestionAttempt)
    private questionAttemptRepo: Repository<QuestionAttempt>,
  ) {}

  /* ADMIN */
  async create(teacherId: number, createQuizDto: CreateQuizDTO) {
    if (!teacherId) throw new UnauthorizedException('not authenticated');

    const { courseId, ...quizDto } = createQuizDto;

    await this.coursesServices.findOneAdminCourse(courseId, teacherId);

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

  async findAdminCompletedQuizzes(teacherId: number, courseId: number) {
    if (!teacherId) throw new UnauthorizedException('not authenticated');
    if (!courseId) throw new UnauthorizedException('course id required');

    await this.coursesServices.findOneAdminCourse(courseId, teacherId);

    const quizzes = await this.repo.find({
      where: { course: { id: courseId }, endsAt: LessThan(new Date()) },
    });

    return {
      data: quizzes,
      message: 'Successfully fetched completed quizzes',
      meta: null,
    };
  }

  async findAdminUpcomingQuizzes(teacherId: number, courseId: number) {
    if (!teacherId) throw new UnauthorizedException('not authenticated');
    if (!courseId) throw new UnauthorizedException('course id required');

    await this.coursesServices.findOneAdminCourse(courseId, teacherId);

    const quizzes = await this.repo.find({
      where: { course: { id: courseId }, endsAt: MoreThan(new Date()) },
    });

    return {
      data: quizzes,
      message: 'Successfully fetched upcoming quizzes',
      meta: null,
    };
  }

  async findAllCompletedQuizzes(teacherId: number) {
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

  async findAllUpcomingQuizzes(teacherId: number) {
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

  async findOneAdminQuiz(teacherId: number, quizId: number) {
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

  /* STUDENT */
  async findAllJoinedAttemptedQuizzes(studentId: number) {
    if (!studentId) throw new UnauthorizedException('not authenticated');

    const quizzes = await this.repo
      .createQueryBuilder('quiz')
      .innerJoin('quiz.course', 'course')
      .innerJoin('course.students', 'student', 'student.id = :studentId', {
        studentId,
      })
      .innerJoin('quiz.studentAnswers', 'sa', 'sa.studentId = :studentId', {
        studentId,
      })
      .getMany();

    return {
      data: quizzes,
      message: 'Successfully fetched all completed quizzes',
      meta: null,
    };
  }

  async findAllJoinedUpcomingQuizzes(studentId: number) {
    if (!studentId) throw new UnauthorizedException('not authenticated');
    const now = new Date();

    const quizzes = await this.repo
      .createQueryBuilder('quiz')
      .innerJoin('quiz.course', 'course')
      .innerJoin('course.students', 'student', 'student.id = :studentId', {
        studentId,
      })
      .leftJoin('quiz.studentAnswers', 'sa', 'sa.studentId = :studentId', {
        studentId,
      })
      .where('quiz.startsAt > :now', { now })
      .andWhere('sa.id IS NULL')
      .getMany();

    return {
      data: quizzes,
      message: 'Successfully fetched all Upcoming quizzes',
      meta: null,
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

    return { data: quizzes, message: 'Fetched completed quizzes' };
  }

  async findUpcomingQuizzes(studentId: number, courseId: number) {
    if (!studentId) throw new UnauthorizedException('not authenticated');
    if (!courseId) throw new UnauthorizedException('course id required');

    await this.coursesServices.findOne(courseId, studentId);

    const now = new Date();

    const quizzes = await this.repo
      .createQueryBuilder('quiz')
      .leftJoin('quiz.course', 'course')
      .leftJoin('quiz.studentAnswers', 'sa', 'sa.studentId = :studentId', {
        studentId,
      })
      .where('course.id = :courseId', { courseId })
      .andWhere('quiz.startsAt > :now', { now })
      .andWhere('sa.id IS NULL')
      .getMany();

    return { data: quizzes, message: 'Fetched upcoming quizzes' };
  }

  async findAttemptedQuizzes(studentId: number, courseId: number) {
    if (!studentId) throw new UnauthorizedException('not authenticated');
    if (!courseId) throw new UnauthorizedException('course id required');

    await this.coursesServices.findOne(courseId, studentId);

    const now = new Date();

    const quizzes = await this.repo
      .createQueryBuilder('quiz')
      .leftJoin('quiz.course', 'course')
      .leftJoin('quiz.studentAnswers', 'sa', 'sa.studentId = :studentId', {
        studentId,
      })
      .where('course.id = :courseId', { courseId })
      .andWhere('quiz.startsAt < :now', { now })
      .andWhere('sa.id IS NOT NULL')
      .getMany();

    return { data: quizzes, message: 'Fetched attempted quizzes' };
  }

  async findMissedQuizzes(studentId: number, courseId: number) {
    if (!studentId) throw new UnauthorizedException('not authenticated');
    if (!courseId) throw new UnauthorizedException('course id required');

    await this.coursesServices.findOne(courseId, studentId);

    const now = new Date();

    const quizzes = await this.repo
      .createQueryBuilder('quiz')
      .leftJoin('quiz.course', 'course')
      .leftJoin('quiz.studentAnswers', 'sa', 'sa.studentId = :studentId', {
        studentId,
      })
      .where('course.id = :courseId', { courseId })
      .andWhere('quiz.startsAt < :now', { now })
      .andWhere('sa.id IS NULL')
      .getMany();

    return { data: quizzes, message: 'Fetched missed quizzes' };
  }

  async attempt(
    quizId: number,
    user: { sub: number; role: UserRole },
    { answers }: AttemptQuizDTO,
  ) {
    if (!quizId) throw new NotFoundException('quiz not found');

    // check role
    if (user.role === UserRole.ADMIN) {
      throw new ForbiddenException('Admins cannot attempt quizzes');
    }

    // fetch quiz + questions
    const quiz = await this.repo.findOne({
      where: { id: quizId },
      relations: ['course.students', 'questions', 'questions.options'],
    });
    if (!quiz) throw new NotFoundException('quiz not exists');

    // check student in course
    const isJoinedCourse = quiz.course.students.some(
      (student) => student.id === user.sub,
    );
    if (!isJoinedCourse) {
      throw new ForbiddenException('Student not enrolled in course');
    }

    // check already attempted quiz
    const isAttempted = await this.quizAttemptRepo.findOne({
      where: { student: { id: user.sub }, quiz: { id: quizId } },
    });
    if (isAttempted) {
      throw new BadRequestException('Quiz already attempted');
    }

    const questionMap = new Map(quiz.questions.map((q) => [q.id, q]));

    // create quiz attempt
    const quizAttempt = this.quizAttemptRepo.create({
      score: 0,
      student: { id: user.sub },
      quiz: { id: quizId },
    });
    await this.quizAttemptRepo.save(quizAttempt);

    let score = 0;
    const questionAttempts: QuestionAttempt[] = [];

    for (const { questionId, selectedOptionIds } of answers) {
      // get question
      const question = questionMap.get(questionId);
      if (!question) throw new NotFoundException('question not found');

      // extract correct options
      const correctOptionIds = question.options
        .filter((o) => o.isCorrect)
        .map((o) => o.id);

      const correct = new Set(correctOptionIds);

      // compare selected vs correct
      const isCorrect =
        selectedOptionIds.length === correctOptionIds.length &&
        selectedOptionIds.every((id) => correct.has(id));

      // calculate marks
      const marksObtained = isCorrect ? question.marks : 0;
      score += marksObtained;

      questionAttempts.push(
        this.questionAttemptRepo.create({
          quizAttempt,
          question,
          selectedOptionIds,
          isCorrect,
          marksObtained,
        }),
      );
    }

    await this.questionAttemptRepo.save(questionAttempts);
    quizAttempt.score = score;

    return this.quizAttemptRepo.save(quizAttempt);
  }
}

import { LessThan, MoreThan, Repository } from 'typeorm';
import {
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
import { StudentAnswer } from './entities/student-answer.entity';
import { AttemptQuizDTO } from './dtos/attempt-quiz.dto';
import { UserRole } from 'src/enum';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz) private repo: Repository<Quiz>,
    private coursesServices: CoursesService,
    private questionServices: QuestionService,
    @InjectRepository(StudentAnswer)
    private studentAnswerRepo: Repository<StudentAnswer>,
  ) {}

  /* ADMIN */
  async create(
    teacherId: number,
    courseId: number,
    createQuizDto: CreateQuizDTO,
  ) {
    if (!teacherId) throw new UnauthorizedException('not authenticated');
    if (!courseId) throw new UnauthorizedException('course id required');

    await this.coursesServices.findOneAdminCourse(courseId, teacherId);

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
      course: { id: courseId },
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
    quizAnswers: AttemptQuizDTO,
  ) {
    if (!quizId) throw new NotFoundException('quiz not found');
    if (user.role === UserRole.ADMIN) {
      throw new ForbiddenException('Admins cannot attempt quizzes');
    }

    const quiz = await this.repo.findOne({
      where: { id: quizId },
      relations: [
        'course',
        'course.students',
        'questions',
        'questions.options',
      ],
    });
    if (!quiz) throw new NotFoundException('quiz not exists');

    const isJoinedCourse = quiz.course.students.some(
      (student) => student.id === user.sub,
    );
    if (!isJoinedCourse) {
      throw new ForbiddenException('Student not enrolled in course');
    }

    let totalScore = 0;

    const questionMap = new Map(quiz.questions.map((q) => [q.id, q]));

    const processedAnswers = quizAnswers.answers.map((answer) => {
      const question = questionMap.get(answer.questionId);
      if (!question) {
        throw new NotFoundException(`Question ${answer.questionId} not found`);
      }

      const correctOptionIds = question.options
        .filter((o) => o.isCorrect)
        .map((o) => o.id);

      let marksObtained = 0;
      const selected = new Set(answer.selectedOptionIds);
      const correct = new Set(correctOptionIds);

      const isCorrect =
        selected.size === correct.size &&
        [...selected].every((id) => correct.has(id));

      if (isCorrect) {
        marksObtained = question.marks;
      }

      totalScore += marksObtained;

      return {
        questionId: answer.questionId,
        selectedOptionIds: answer.selectedOptionIds,
        marksObtained,
        isCorrect,
      };
    });

    const studentAnswer = this.studentAnswerRepo.create({
      answers: processedAnswers,
      quiz,
      student: { id: user.sub },
      totalScore,
    });

    return this.studentAnswerRepo.save(studentAnswer);
  }
}

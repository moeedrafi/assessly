import { LessThan, MoreThan, Repository } from 'typeorm';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import { UsersService } from 'src/users/users.service';
import { CoursesService } from 'src/courses/courses.service';
import { QuestionService } from 'src/question/question.service';
import { CreateQuizDTO } from './dtos/create-quiz.dto';
import { StudentAnswer } from './entities/student-answer.entity';
import { AttemptQuizDTO } from './dtos/attempt-quiz.dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz) private repo: Repository<Quiz>,
    private coursesServices: CoursesService,
    private questionServices: QuestionService,
    @InjectRepository(StudentAnswer)
    private studentAnswerRepo: Repository<StudentAnswer>,
  ) {}

  async create(
    teacherId: number,
    courseId: number,
    createQuizDto: CreateQuizDTO,
  ) {
    if (!teacherId) throw new UnauthorizedException('not authenticated');
    if (!courseId) throw new UnauthorizedException('course id required');

    const course = await this.coursesServices.findOneAdminCourse(
      courseId,
      teacherId,
    );

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

  async findUpcomingQuizzes(studentId: number, courseId: number) {
    if (!studentId) throw new UnauthorizedException('not authenticated');
    if (!courseId) throw new UnauthorizedException('course id required');

    await this.coursesServices.findOne(courseId, studentId);

    const now = new Date();

    return this.repo
      .createQueryBuilder('quiz')
      .leftJoin('quiz.course', 'course')
      .leftJoin('quiz.studentsAnswers', 'sa', 'sa.studentId = :studentId', {
        studentId,
      })
      .where('course.id = :courseid', { courseId })
      .andWhere('quiz.startsAt > :now', { now })
      .andWhere('sa.id IS NULL')
      .getMany();
  }

  async findAttemptedQuizzes(studentId: number, courseId: number) {
    if (!studentId) throw new UnauthorizedException('not authenticated');
    if (!courseId) throw new UnauthorizedException('course id required');

    await this.coursesServices.findOne(courseId, studentId);

    const now = new Date();

    return this.repo
      .createQueryBuilder('quiz')
      .leftJoin('quiz.course', 'course')
      .leftJoin('quiz.studentsAnswers', 'sa', 'sa.studentId = :studentId', {
        studentId,
      })
      .where('course.id = :courseId', { courseId })
      .andWhere('quiz.startsAt < :now', { now })
      .andWhere('sa.id IS NOT NULL')
      .getMany();
  }

  async findMissedQuizzes(studentId: number, courseId: number) {
    if (!studentId) throw new UnauthorizedException('not authenticated');
    if (!courseId) throw new UnauthorizedException('course id required');

    await this.coursesServices.findOne(courseId, studentId);

    const now = new Date();

    return this.repo
      .createQueryBuilder('quiz')
      .leftJoin('quiz.course', 'course')
      .leftJoin('quiz.studentsAnswers', 'sa', 'sa.studentId = :studentId', {
        studentId,
      })
      .where('course.id = :courseId', { courseId })
      .andWhere('quiz.startsAt < :now', { now })
      .andWhere('sa.id IS NULL')
      .getMany();
  }

  async attempt(
    quizId: number,
    studentId: number,
    quizAnswers: AttemptQuizDTO,
  ) {
    const quiz = await this.repo.findOne({
      where: { id: quizId },
      relations: ['questions', 'questions.options', 'course'],
    });
    if (!quiz) throw new NotFoundException('quiz not found');

    let totalScore = 0;
    const processedAnswers = quizAnswers.answers.map((a) => {
      const question = quiz?.questions.find((q) => q.id === a.questionId);
      if (!question)
        throw new NotFoundException(`Question ${a.questionId} not found`);

      const correctOptionIds = question.options
        .filter((o) => o.isCorrect)
        .map((opt) => opt.id);

      const marksObtained =
        correctOptionIds.sort().toString() === a.selectedOptionIds.toString()
          ? question.marks
          : 0;

      totalScore += marksObtained;

      return {
        questionId: a.questionId.toString(),
        selectedOptionIds: a.selectedOptionIds,
        marksObtained,
      };
    });

    const studentAnswer = this.studentAnswerRepo.create({
      answers: processedAnswers,
      quiz,
      student: { id: studentId },
      totalScore,
    });

    return this.studentAnswerRepo.save(studentAnswer);
  }
}

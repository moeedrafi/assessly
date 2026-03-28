import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from 'src/enum';
import { Quiz } from 'src/quiz/quiz.entity';
import { QuizAttempt } from 'src/quiz-attempt/quiz-attempt.entity';
import { AttemptQuizDTO } from 'src/quiz-attempt/dtos/attempt-quiz.dto';
import { QuestionAttempt } from 'src/quiz-attempt/question-attempt.entity';

@Injectable()
export class QuizAttemptService {
  constructor(
    @InjectRepository(QuizAttempt) private repo: Repository<QuizAttempt>,
    @InjectRepository(Quiz) private quizRepo: Repository<Quiz>,
    @InjectRepository(QuestionAttempt)
    private questionAttemptRepo: Repository<QuestionAttempt>,
  ) {}

  async attempt(
    quizId: number,
    user: { sub: number; role: UserRole },
    { answers }: AttemptQuizDTO,
  ) {
    if (!quizId) throw new NotFoundException('quiz not found');

    // Admins cannot attempt quizzes
    if (user.role === UserRole.ADMIN) {
      throw new ForbiddenException('Admins cannot attempt quizzes');
    }

    // Load quiz with questions, options, and enrolled students
    const quiz = await this.quizRepo.findOne({
      where: { id: quizId },
      relations: ['questions', 'questions.options', 'course.students'],
    });
    if (!quiz) throw new NotFoundException('quiz not found');

    const now = new Date();
    const GRACE_PERIOD_MS = 60 * 1000; // 1 minute
    const isAfterGracePeriod =
      now.getTime() > quiz.endsAt.getTime() + GRACE_PERIOD_MS;

    if (isAfterGracePeriod) {
      throw new ForbiddenException('Cannot submit quiz after grace period');
    }

    // Ensure student is enrolled
    const isJoinedCourse = quiz.course.students.some(
      (student) => student.id === user.sub,
    );
    if (!isJoinedCourse) {
      throw new ForbiddenException('Student not enrolled in course');
    }

    // Check if already attempted
    const isAttempted = await this.repo.findOne({
      where: { quiz: { id: quizId }, student: { id: user.sub } },
    });
    if (isAttempted) {
      throw new ForbiddenException('cannot reattempt quiz');
    }

    // create quiz attempt
    const attempt = this.repo.create({
      student: { id: user.sub },
      score: 0,
      quiz: { id: quiz.id },
    });
    await this.repo.save(attempt);

    // Map for quick lookup
    const questionMap = new Map(quiz.questions.map((q) => [q.id, q]));
    let score = 0;
    const questionAttempts: QuestionAttempt[] = [];

    for (const { questionId, selectedOptionIds } of answers) {
      const question = questionMap.get(questionId);
      if (!question) throw new NotFoundException('question not found');

      const correctOptionIds = question.options
        .filter((o) => o.isCorrect)
        .map((o) => o.id);

      // Validate that all submitted option IDs belong to the question
      const validOptionIds = new Set(question.options.map((o) => o.id));
      const filteredSelected = selectedOptionIds.filter((id) =>
        validOptionIds.has(id),
      );

      // Convert arrays to sets for order-independent comparison
      const correct = new Set(correctOptionIds);
      const selected = new Set(filteredSelected);

      // Check if exact match
      const isCorrect =
        correct.size === selected.size &&
        [...correct].every((id) => selected.has(id));

      const marksObtained = isCorrect ? question.marks : 0;
      score += marksObtained;

      questionAttempts.push(
        this.questionAttemptRepo.create({
          marksObtained,
          question,
          selectedOptionIds: [...selected],
          isCorrect,
          quizAttempt: attempt,
        }),
      );
    }

    await this.questionAttemptRepo.save(questionAttempts);
    attempt.score = score;

    return this.repo.save(attempt);
  }

  async result(quizId: number, userId: number) {
    const attemptedQuiz = await this.repo.findOne({
      where: { student: { id: userId }, quiz: { id: quizId } },
      relations: ['quiz'],
    });
    if (!attemptedQuiz) {
      throw new NotFoundException('Quiz not found or not attempted');
    }

    const questionsAttempt = await this.questionAttemptRepo.find({
      where: { quizAttempt: { id: attemptedQuiz.id } },
      relations: ['question', 'question.options'],
    });

    const formatted = questionsAttempt.map((qa) => ({
      id: qa.id,
      isCorrect: qa.isCorrect,
      marksObtained: qa.marksObtained,
      selectedOptionIds: qa.selectedOptionIds,
      question: {
        id: qa.question.id,
        text: qa.question.text,
        type: qa.question.type,
        marks: qa.question.marks,
      },
      options: qa.question.options,
    }));

    return { data: formatted, message: 'Fetched result successfully' };
  }

  async findStats(studentId: number, courseId: number) {
    if (!courseId) throw new NotFoundException('course id not found');

    const qb = this.repo
      .createQueryBuilder('attempt')
      .innerJoin('attempt.quiz', 'quiz')
      .innerJoin('quiz.questions', 'question')
      .innerJoin('attempt.questionAttempts', 'questionAttempt')
      .select([
        'attempt.id',
        'attempt.score',
        'quiz.name',
        'COUNT(DISTINCT question.id) AS "totalQuestions"',
        'COUNT(DISTINCT CASE WHEN questionAttempt.isCorrect THEN questionAttempt.id END) AS "totalCorrect"',
      ])
      .where('attempt.studentId = :studentId', { studentId })
      .andWhere('quiz.courseId = :courseId', { courseId })
      .groupBy('attempt.id')
      .addGroupBy('quiz.id');

    const avgSubQuery = this.repo
      .createQueryBuilder('a')
      .select('AVG(a.score)', 'avgScore')
      .innerJoin('a.quiz', 'q')
      .where('a.studentId = :studentId', { studentId })
      .andWhere('q.courseId = :courseId', { courseId });

    const [bestQuiz, worstQuiz, avgQuiz] = await Promise.all([
      await qb.clone().orderBy('attempt.score', 'DESC').getRawOne(),
      await qb.clone().orderBy('attempt.score', 'ASC').getRawOne(),
      await qb
        .clone()
        .orderBy(`ABS(attempt.score - (${avgSubQuery.getQuery()}))`, 'ASC')
        .setParameters(avgSubQuery.getParameters())
        .getRawOne(),
    ]);

    const convertStats = (quiz) =>
      quiz
        ? {
            id: Number(quiz.attempt_id),
            score: Number(quiz.attempt_score),
            name: quiz.quiz_name,
            totalQuestions: Number(quiz.totalQuestions),
            totalCorrect: Number(quiz.totalCorrect),
          }
        : {
            id: null,
            score: 0,
            name: 'N/A',
            totalQuestions: 0,
            totalCorrect: 0,
          };

    return {
      data: [
        { type: 'Best Quiz', ...convertStats(bestQuiz) },
        { type: 'Worst Quiz', ...convertStats(worstQuiz) },
        { type: 'Avg Quiz', ...convertStats(avgQuiz) },
      ],
      message: 'Fetched stats',
    };
  }

  async getCourseLeaderboard(studentId: number, courseId: number) {
    if (!courseId) throw new NotFoundException('course id not found');

    const data = await this.repo
      .createQueryBuilder('attempt')
      .innerJoin('attempt.quiz', 'quiz')
      .leftJoin('attempt.student', 'student')
      .select('attempt.studentId', 'studentId')
      .addSelect('student.name', 'name')
      .addSelect('SUM(attempt.score)', 'totalScore')
      .where('quiz.courseId = :courseId', { courseId })
      .groupBy('attempt.studentId')
      .addGroupBy('student.name')
      .orderBy('SUM(attempt.score)', 'DESC')
      .getRawMany();

    const ranked = data.map((a, index) => ({
      studentId: Number(a.studentId),
      name: a.name as string,
      totalScore: Number(a.totalScore),
      rank: index + 1,
    }));

    const studentInLeaderboard = ranked.find((a) => a.studentId === studentId);

    const currentUser = studentInLeaderboard ?? {
      studentId,
      name: 'You',
      totalScore: 0,
      rank: null,
    };

    return {
      data: { ranked, currentUser },
      message: 'Fetched all course attempts',
      meta: null,
    };
  }
}

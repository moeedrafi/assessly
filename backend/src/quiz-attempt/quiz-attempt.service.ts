import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
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

  async result() {}

  //   async attempt(
  //   quizId: number,
  //   user: { sub: number; role: UserRole },
  //   { answers }: AttemptQuizDTO,
  // ) {
  //   if (!quizId) throw new NotFoundException('quiz not found');

  //   // check role
  //   if (user.role === UserRole.ADMIN) {
  //     throw new ForbiddenException('Admins cannot attempt quizzes');
  //   }

  //   // fetch quiz + questions
  //   const quiz = await this.repo.findOne({
  //     where: { id: quizId },
  //     relations: ['course.students', 'questions', 'questions.options'],
  //   });
  //   if (!quiz) throw new NotFoundException('quiz not exists');

  //   // check student in course
  //   const isJoinedCourse = quiz.course.students.some(
  //     (student) => student.id === user.sub,
  //   );
  //   if (!isJoinedCourse) {
  //     throw new ForbiddenException('Student not enrolled in course');
  //   }

  //   // check already attempted quiz
  //   const isAttempted = await this.quizAttemptRepo.findOne({
  //     where: { student: { id: user.sub }, quiz: { id: quizId } },
  //   });
  //   if (isAttempted) {
  //     throw new BadRequestException('Quiz already attempted');
  //   }

  //   const questionMap = new Map(quiz.questions.map((q) => [q.id, q]));

  //   // create quiz attempt
  //   const quizAttempt = this.quizAttemptRepo.create({
  //     score: 0,
  //     student: { id: user.sub },
  //     quiz: { id: quizId },
  //   });
  //   await this.quizAttemptRepo.save(quizAttempt);

  //   let score = 0;
  //   const questionAttempts: QuestionAttempt[] = [];

  //   for (const { questionId, selectedOptionIds } of answers) {
  //     // get question
  //     const question = questionMap.get(questionId);
  //     if (!question) throw new NotFoundException('question not found');

  //     // extract correct options
  //     const correctOptionIds = question.options
  //       .filter((o) => o.isCorrect)
  //       .map((o) => o.id);

  //     const correct = new Set(correctOptionIds);

  //     // compare selected vs correct
  //     const isCorrect =
  //       selectedOptionIds.length === correctOptionIds.length &&
  //       selectedOptionIds.every((id) => correct.has(id));

  //     // calculate marks
  //     const marksObtained = isCorrect ? question.marks : 0;
  //     score += marksObtained;

  //     questionAttempts.push(
  //       this.questionAttemptRepo.create({
  //         quizAttempt,
  //         question,
  //         selectedOptionIds,
  //         isCorrect,
  //         marksObtained,
  //       }),
  //     );
  //   }

  //   await this.questionAttemptRepo.save(questionAttempts);
  //   quizAttempt.score = score;

  //   return this.quizAttemptRepo.save(quizAttempt);
  // }
}

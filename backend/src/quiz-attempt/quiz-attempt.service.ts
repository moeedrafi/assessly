import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizAttempt } from 'src/quiz-attempt/quiz-attempt.entity';

@Injectable()
export class QuizAttemptService {
  constructor(
    @InjectRepository(QuizAttempt) private repo: Repository<QuizAttempt>,
  ) {}

  async attempt() {}

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

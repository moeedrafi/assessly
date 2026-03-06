import { Question } from 'src/question/question.entity';
import { QuizAttempt } from 'src/quiz/entities/quiz-attempt.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class QuestionAttempt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isCorrect: boolean;

  @Column()
  marksObtained: number;

  @Column('int', { array: true })
  selectedOptionIds: number[];

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  question: Question;

  @ManyToOne(() => QuizAttempt, (qa) => qa.questionAttempts, {
    onDelete: 'CASCADE',
  })
  quizAttempt: QuizAttempt;
}

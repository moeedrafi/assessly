import { User } from 'src/users/user.entity';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import { QuestionAttempt } from 'src/quiz/entities/question-attempt.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
@Unique(['student', 'quiz'])
export class QuizAttempt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  student: User;

  @ManyToOne(() => Quiz, { onDelete: 'CASCADE' })
  quiz: Quiz;

  @OneToMany(() => QuestionAttempt, (qa) => qa.quizAttempt)
  questionAttempts: QuestionAttempt[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

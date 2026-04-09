import { Courses } from 'src/courses/courses.entity';
import { Question } from 'src/question/question.entity';
import { QuizAttempt } from 'src/quiz-attempt/quiz-attempt.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int' })
  totalMarks: number;

  @Column({ type: 'int' })
  timeLimit: number;

  @Column({ type: 'int' })
  passingMarks: number;

  @Column({ default: false })
  isPublished: boolean;

  @Column({ type: 'timestamp' })
  startsAt: Date;

  @Column({ type: 'timestamp' })
  endsAt: Date;

  @ManyToOne(() => Courses, (courses) => courses.quizzes, {
    onDelete: 'CASCADE',
  })
  course: Courses;

  @OneToMany(() => Question, (question) => question.quiz, { cascade: true })
  questions: Question[];

  @OneToMany(() => QuizAttempt, (attempt) => attempt.quiz)
  attempts: QuizAttempt[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import { User } from 'src/users/user.entity';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
@Unique(['student', 'quiz'])
export class StudentAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  totalScore: number;

  @Column({ type: 'json' })
  answers: {
    questionId: string;
    selectionOptionIs: number[];
    marksObtained?: number;
  }[];

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  student: User;

  @ManyToOne(() => Quiz, { onDelete: 'CASCADE' })
  quiz: Quiz;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import { Quiz } from 'src/quiz/entities/quiz.entity';
import { QuestionType } from 'src/enum';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Option } from 'src/option/option.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'enum', enum: QuestionType })
  type: QuestionType;

  @Column({ type: 'int' })
  marks: number;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, {
    onDelete: 'CASCADE',
  })
  quiz: Quiz;

  @OneToMany(() => Option, (option) => option.question)
  options: Option[];
}

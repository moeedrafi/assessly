import { nanoid } from 'nanoid';
import { Quiz } from 'src/quiz/quiz.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Courses {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ unique: true })
  code: string;

  @Column({ default: true })
  allowStudentJoin: boolean;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.courses)
  teacher: User;

  @OneToMany(() => Quiz, (quiz) => quiz.course)
  quizzes: Quiz[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  generateCode() {
    if (!this.code) {
      this.code = nanoid(8).toUpperCase();
    }
  }
}

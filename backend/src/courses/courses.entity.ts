import { nanoid } from 'nanoid';
import { User } from 'src/users/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Courses {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ unique: true })
  code: string;

  @Column({ default: true })
  allowStudentJoin: boolean;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.courses)
  teacher: User;

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

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';

import { AppService } from 'src/app.service';
import { AppController } from 'src/app.controller';

import { User } from 'src/users/user.entity';
import { Courses } from 'src/courses/courses.entity';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import { Option } from 'src/quiz/entities/option.entity';
import { Question } from 'src/quiz/entities/question.entity';

import { AuthModule } from 'src/auth/auth.module';
import { QuizModule } from 'src/quiz/quiz.module';
import { UsersModule } from 'src/users/users.module';
import { CoursesModule } from 'src/courses/courses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      entities: [User, Courses, Quiz, Question, Option],
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      synchronize: true,
      extra: { max: 5 },
    }),
    AuthModule,
    MailerModule.forRoot({
      transport: {
        port: 587,
        secure: false,
        host: process.env.HOST,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
    }),
    UsersModule,
    CoursesModule,
    QuizModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

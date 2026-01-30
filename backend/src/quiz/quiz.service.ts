import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from 'src/quiz/quiz.entity';

@Injectable()
export class QuizService {
  constructor(@InjectRepository(Quiz) private repo: Repository<Quiz>) {}
}

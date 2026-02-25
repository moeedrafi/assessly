import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './question.entity';
import { OptionService } from 'src/option/option.service';
import { CreateQuestionDTO } from './dtos/create-question.dto';
import { Quiz } from 'src/quiz/entities/quiz.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question) private repo: Repository<Question>,
    private optionServices: OptionService,
  ) {}

  async create(createQuestionDTO: CreateQuestionDTO & { quiz: Quiz }) {
    const { marks, quiz, text, type, options } = createQuestionDTO;

    const question = this.repo.create({ marks, text, type, quiz });
    const savedQuestion = await this.repo.save(question);

    for (const option of options) {
      await this.optionServices.create({ ...option, question: savedQuestion });
    }

    return savedQuestion;
  }

  async findAll(quizId: number) {
    if (!quizId) throw new NotFoundException('quiz not found');

    const question = await this.repo
      .createQueryBuilder('question')
      .leftJoin('question.quiz', 'quiz')
      .leftJoinAndSelect('question.options', 'options')
      .where('quiz.id = :quizId', { quizId })
      .getMany();

    return { data: question, message: 'Successfully fetched questions' };
  }
}

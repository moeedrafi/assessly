import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Quiz } from 'src/quiz/quiz.entity';
import { Question } from 'src/question/question.entity';
import { OptionService } from 'src/option/option.service';
import { CreateQuestionDTO } from 'src/question/dtos/create-question.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question) private repo: Repository<Question>,
    @InjectRepository(Quiz) private quizRepo: Repository<Quiz>,
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

    const quiz = await this.quizRepo.findOne({
      where: { id: quizId },
      select: ['timeLimit'],
    });

    const questions = await this.repo
      .createQueryBuilder('question')
      .leftJoin('question.quiz', 'quiz')
      .leftJoinAndSelect('question.options', 'options')
      .where('quiz.id = :quizId', { quizId })
      .getMany();

    return {
      data: { timeLimit: quiz?.timeLimit, questions },
      message: 'Successfully fetched questions',
    };
  }
}

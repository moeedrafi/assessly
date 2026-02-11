import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Option } from './option.entity';
import { Repository } from 'typeorm';
import { CreateOptionDTO } from './dtos/create-option.dto';
import { Question } from 'src/question/question.entity';

@Injectable()
export class OptionService {
  constructor(@InjectRepository(Option) private repo: Repository<Option>) {}

  async create(createOptionDto: CreateOptionDTO & { question: Question }) {
    const { isCorrect, question, text } = createOptionDto;

    const option = this.repo.create({ isCorrect, question, text });
    const savedOption = await this.repo.save(option);

    return savedOption;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Option } from './option.entity';
import { Repository } from 'typeorm';
import { Question } from 'src/question/question.entity';
import { CreateOptionDTO } from 'src/option/dtos/create-option.dto';
import { UpdateOptionDTO } from 'src/option/dtos/update-option.dto';

@Injectable()
export class OptionService {
  constructor(@InjectRepository(Option) private repo: Repository<Option>) {}

  async create(createOptionDto: CreateOptionDTO & { question: Question }) {
    const { isCorrect, question, text } = createOptionDto;

    const option = this.repo.create({ isCorrect, question, text });
    const savedOption = await this.repo.save(option);

    return savedOption;
  }

  async update(optionId: number, updateOptionDto: UpdateOptionDTO) {
    const option = await this.repo.findOne({ where: { id: optionId } });
    if (!option) throw new NotFoundException('option not found');

    Object.assign(option, updateOptionDto);
    await this.repo.save(option);

    return option;
  }
}

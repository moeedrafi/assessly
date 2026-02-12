import { Expose, Type } from 'class-transformer';
import { QuestionType } from 'src/enum';
import { OptionDTO } from 'src/option/dtos/option.dto';

export class QuestionDTO {
  @Expose()
  text: string;

  @Expose()
  type: QuestionType;

  @Expose()
  marks: number;

  @Expose()
  @Type(() => OptionDTO)
  options: OptionDTO[];
}

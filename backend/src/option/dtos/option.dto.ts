import { Expose } from 'class-transformer';

export class OptionDTO {
  @Expose()
  text: string;

  @Expose()
  isCorrect: boolean;
}

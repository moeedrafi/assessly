import { Expose } from 'class-transformer';

export class OptionDTO {
  @Expose()
  id: number;

  @Expose()
  text: string;

  @Expose()
  isCorrect: boolean;
}

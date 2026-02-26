import { CreateOption, OptionEntity } from "@/types/option";

export interface QuestionEntity {
  id: number;
  text: string;
  type: string;
  marks: number;
}

export type CreateQuestion = Omit<QuestionEntity, "id"> & {
  options: CreateOption[];
};

export interface QuestionDetail extends QuestionEntity {
  options: OptionEntity[];
}

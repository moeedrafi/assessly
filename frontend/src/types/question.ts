import { OptionBase } from "./option";

export interface QuestionBase {
  id: number;
  text: string;
  type: string;
  marks: number;
}

export interface QuizCreate {
  name: string;
  duration: number;
  startTime: string;
  description: string;
  questions: Question[];
}

export interface Question extends QuestionBase {
  options: OptionBase[];
}

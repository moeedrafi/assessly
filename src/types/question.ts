export interface Question {
  question: string;
  type: string;
  options: string[];
}

export interface QuizCreate {
  name: string;
  duration: number;
  startTime: string;
  description: string;
  questions: Question[];
}

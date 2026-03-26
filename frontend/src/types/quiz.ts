import type { OptionEntity } from "@/types/option";
import type {
  CreateQuestion,
  QuestionDetail,
  QuestionEntity,
} from "@/types/question";

export interface QuizEntity {
  id: number;
  name: string;
  description: string;
  totalMarks: number;
  timeLimit: number;
  passingMarks: number;
  isPublished: boolean;
  startsAt: string;
  endsAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuizDetail extends QuizEntity {
  course: string;
  teacher: string;
}

export type CreateQuiz = Omit<QuizEntity, "id" | "createdAt" | "updatedAt"> & {
  questions: CreateQuestion[];
  courseId: number;
};

export interface QuizQuestions {
  timeLimit: number;
  questions: QuestionDetail[];
}

export interface QuizResult {
  id: number;
  isCorrect: boolean;
  marksObtained: number;
  selectedOptionIds: number[];
  question: QuestionEntity;
  options: OptionEntity[];
}

export type QuizStatus = "all" | "completed" | "upcoming" | "missed";

export interface QuizStatsType {
  id: number;
  type: string;
  name: string;
  score: number;
  totalQuestions: number;
  totalCorrect: number;
}

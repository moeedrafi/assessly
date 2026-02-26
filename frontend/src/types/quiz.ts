import { CreateQuestion } from "@/types/question";

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
};

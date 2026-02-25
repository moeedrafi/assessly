export interface Quiz {
  id: number;
  name: string;
  description: string;
  totalMarks: number;
  timeLimit: number;
  passingMarks?: number;
  isPublished: boolean;
  startsAt: string;
  endsAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuizDetail extends Quiz {
  course: string;
  teacher: string;
}

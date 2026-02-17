import { UserBase } from "./user";

interface CourseBase {
  id: number;
  name: string;
  description: string;
  code: string;
  allowStudentJoin: boolean;
  isActive: boolean;
  teacher: UserBase;
  students: UserBase[];
  createdAt: string;
  updatedAt: string;
}

export type JoinedCourse = CourseBase;

export interface TeachingCourse extends CourseBase {
  teacher: UserBase;
  students: UserBase[];
}

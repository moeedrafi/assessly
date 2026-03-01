import { UserBase } from "./user";

interface CourseEntity {
  id: number;
  name: string;
  description: string;
  code: string;
  allowStudentJoin: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// export interface JoinedCourse extends CourseBase {
//   teacher: { name: string };
// }

export type JoinedCourse = Omit<CourseEntity, "code" | "allowStudentJoin"> & {
  teacher: { name: string };
};

export interface TeachingCourse extends CourseEntity {
  students: UserBase[];
}

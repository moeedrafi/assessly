import { UserBase, UserRole } from "@/types/user";

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

export type JoinedCourse = Omit<
  CourseEntity,
  "code" | "allowStudentJoin" | "createdAt" | "updatedAt"
> & {
  teacherName: string;
};

export interface TeachingCourse extends CourseEntity {
  students: UserBase[];
}

export type CourseByRole<T extends string> = T extends UserRole.ADMIN
  ? TeachingCourse[]
  : JoinedCourse[];

import { JoinedCourse, TeachingCourse } from "./course";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface UserBase {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

interface StudentUser extends UserBase {
  role: UserRole.USER;
  joinedCourses: JoinedCourse[];
}

interface TeacherUser extends UserBase {
  role: UserRole.ADMIN;
  teachingCourses: TeachingCourse[];
}

export type User = StudentUser | TeacherUser;

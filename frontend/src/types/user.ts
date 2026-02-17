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

export interface StudentUser extends UserBase {
  role: UserRole.USER;
  joinedCourses: JoinedCourse[];
}

export interface TeacherUser extends UserBase {
  role: UserRole.ADMIN;
  teachingCourses: TeachingCourse[];
}

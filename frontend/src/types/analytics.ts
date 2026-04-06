import { UserRole } from "@/types/user";

export interface StatsCard {
  totalUsers: number;
  totalCourses: number;
  totalQuizzes: number;
}

export interface RecentUser {
  id: number;
  name: string;
  email: string;
  joinedCourses: { id: number; name: string }[];
}

export interface CourseSnapshotType {
  id: number;
  title: string;
  totalStudents: number;
  avgScore: number;
  passRate: number;
}

export interface RecentQuiz {
  id: number;
  name: string;
  totalMarks: number;
  passingMarks: number;
  score: number;
  avgScore: number;
}

export interface StudentCourseSnapshotType {
  id: number;
  name: string;
  totalQuizzes: number;
  yourAvg: number;
  totalAvg: number;
}

interface Leaderboard {
  studentId: number;
  name: string;
  totalScore: number;
  rank: number;
}

export interface LeaderboardType {
  ranked: Leaderboard[];
  currentUser: Leaderboard;
}

export type SnapshotByRole<T extends string> = T extends UserRole.ADMIN
  ? CourseSnapshotType[]
  : StudentCourseSnapshotType[];

import { UserRole } from "@/types/user";
import type { QuizStatus } from "@/types/quiz";

export const commonKeys = {
  dateRange: (
    page: number,
    rpp: number,
    status: QuizStatus,
    from: string | null,
    to: string | null,
  ) => ["date-range", { from, to, page, rpp, status }] as const,
  courseQuizzes: (page: number, rpp: number, status: QuizStatus) =>
    ["course-quiz", { page, rpp, status }] as const,
  courseSnapshot: (page: number, rpp: number, role: UserRole) =>
    ["course-snapshot", { page, rpp, role }] as const,
  courses: (page: number, rpp: number, role: UserRole) =>
    ["courses", { page, rpp, role }] as const,
};

export const studentKeys = {
  availableQuizzes: (page: number, rpp: number) =>
    ["availableQuizzes", { page, rpp }] as const,
  recentQuiz: () => ["recent-quiz"] as const,
  courses: (page: number, rpp: number) => ["courses", { page, rpp }] as const,
  course: (page: number, rpp: number) => ["course", { page, rpp }] as const,
  quizStats: (courseId: string) => ["quiz-stats", { courseId }] as const,
  leaderboard: (courseId: string) => ["leaderboard", { courseId }] as const,
  questions: (quizId: string) => ["questions", { quizId }] as const,
  result: (quizId: string) => ["result", quizId] as const,
};

export const adminKeys = {
  stats: () => ["stats"] as const,
  recentUsers: () => ["recent-users"] as const,
  courses: (page: number, rpp: number) => ["courses", { page, rpp }] as const,
  course: (courseId: string) => ["course", { courseId }] as const,
  quizStats: (courseId: string) => ["quiz-stats", { courseId }] as const,
  leaderboard: (courseId: string) => ["leaderboard", { courseId }] as const,
  quiz: (quizId: string) => ["quiz", { quizId }] as const,
  questions: (quizId: string) => ["questions", { quizId }] as const,
};

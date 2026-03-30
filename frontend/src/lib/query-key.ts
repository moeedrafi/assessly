import { QuizStatus } from "@/types/quiz";

export const studentKeys = {
  recentQuiz: () => ["recent-quiz"] as const,
  courseSnapshot: (page: number, rpp: number) =>
    ["course-snapshot", { page, rpp }] as const,
  courses: (page: number, rpp: number) => ["courses", { page, rpp }] as const,
  course: (page: number, rpp: number) => ["course", { page, rpp }] as const,
  quizStats: (courseId: string) => ["quiz-stats", { courseId }] as const,
  leaderboard: (courseId: string) => ["leaderboard", { courseId }] as const,
  dateRange: (from: string, to: string, page: number, rpp: number) =>
    ["date-range", { from, to, page, rpp }] as const,
  quizzes: (
    page: number,
    rpp: number,
    courseId: string,
    role: string,
    scope: string,
    status: QuizStatus,
  ) => ["quiz", { role, scope, courseId, page, rpp, status }] as const,
  questions: (quizId: string) => ["questions", { quizId }] as const,
  result: (quizId: string) => ["result", quizId] as const,
};

export const adminKeys = {
  stats: () => ["stats"] as const,
  recentUsers: () => ["recent-users"] as const,
  courseSnapshot: (page: number, rpp: number) =>
    ["course-snapshot", { page, rpp }] as const,
  courses: (page: number, rpp: number) => ["courses", { page, rpp }] as const,
  course: (courseId: string) => ["course", { courseId }] as const,
  quizStats: (courseId: string) => ["quiz-stats", { courseId }] as const,
  leaderboard: (courseId: string) => ["leaderboard", { courseId }] as const,
  quizzes: (
    page: number,
    rpp: number,
    courseId: string,
    role: string,
    scope: string,
    status: QuizStatus,
  ) => ["quiz", { role, scope, courseId, page, rpp, status }] as const,
  quiz: (quizId: string) => ["quiz", { quizId }] as const,
  questions: (quizId: string) => ["questions", { quizId }] as const,
};

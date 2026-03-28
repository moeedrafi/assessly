import { api } from "@/lib/api";
import type { LeaderboardType, RecentQuiz } from "@/types/analytics";
import type {
  QuizEntity,
  QuizQuestions,
  QuizResult,
  QuizStatsType,
  QuizStatus,
} from "@/types/quiz";

export const getStudentQuizStats = async (courseId: string) => {
  const res = await api.get<QuizStatsType[]>(`/quiz-attempt/${courseId}/stats`);
  return res.data;
};

export const getLeaderboard = async (courseId: string) => {
  const res = await api.get<LeaderboardType>(
    `/quiz-attempt/course/${courseId}/leaderboard`,
  );

  return res.data;
};

export const getQuizzes = ({
  endpoint,
  page,
  rpp,
  status,
}: {
  page: number;
  rpp: number;
  endpoint: string;
  status: QuizStatus;
}) => {
  return api.get<QuizEntity[]>(
    `${endpoint}?page=${page}&rpp=${rpp}&status=${status}`,
  );
};

export const getRecentQuiz = async () => {
  const res = await api.get<RecentQuiz[]>("/analytics/recent-quiz");
  return res.data;
};

export const getDateRangeQuizzes = async ({
  from,
  to,
  page,
  rpp,
}: {
  from: string;
  to: string;
  page: number;
  rpp: number;
}) => {
  const fromIso = new Date(from).toISOString();
  const toIso = new Date(to).toISOString();

  return api.get<QuizEntity[]>(
    `/quiz/range?from=${fromIso}&to=${toIso}&page=${page}&rpp=${rpp}`,
  );
};

export const getQuizResult = async (quizId: string) => {
  const res = await api.get<QuizResult[]>(`/quiz-attempt/${quizId}/result`);
  return res.data;
};

export const getQuestions = async (quizId: string) => {
  const res = await api.get<QuizQuestions>(`/question/${quizId}`);
  return res.data;
};

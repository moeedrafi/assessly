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
  status,
}: {
  from: string | null;
  to: string | null;
  page: number;
  rpp: number;
  status: QuizStatus;
}) => {
  const params = new URLSearchParams();

  if (from) params.set("from", new Date(from).toISOString());
  if (to) params.set("to", new Date(to).toISOString());

  params.set("page", page.toString());
  params.set("rpp", rpp.toString());

  // ⚠️ optional: skip "all"
  if (status !== "all") {
    params.set("status", status);
  }

  console.log(params.getAll("page"));

  return api.get<QuizEntity[]>(`/quiz/range?${params.toString()}`);
};

export const getQuizResult = async (quizId: string) => {
  const res = await api.get<QuizResult[]>(`/quiz-attempt/${quizId}/result`);
  return res.data;
};

export const getQuestions = async (quizId: string) => {
  const res = await api.get<QuizQuestions>(`/question/${quizId}`);
  return res.data;
};

export const getAvailableQuizzes = async () => {
  return api.get<QuizEntity[]>("/quiz/available");
};

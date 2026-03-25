import { api } from "@/lib/api";
import type { QuizEntity, QuizStatus } from "@/types/quiz";
import { useQuery } from "@tanstack/react-query";

type Params = {
  page: number;
  rpp: number;
  courseId?: string;
  scope: "all" | "course";
  role: "student" | "admin";
  status: QuizStatus;
};

export const useQuizzes = (params: Params) => {
  const { page, rpp, status, scope, courseId, role } = params;

  const endpoint =
    role === "admin"
      ? scope === "course"
        ? `/admin/quiz/${courseId}`
        : "/admin/quiz"
      : scope === "course"
        ? `/quiz/${courseId}`
        : "/quiz";

  return useQuery({
    queryKey: ["quiz", { role, scope, courseId, page, rpp, status }],
    queryFn: async () => {
      return api.get<QuizEntity[]>(
        `${endpoint}?page=${page}&rpp=${rpp}&status=${status}`,
      );
    },
    staleTime: Infinity,
    placeholderData: (prevData) => prevData,
  });
};

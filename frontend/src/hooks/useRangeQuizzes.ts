import { commonKeys } from "@/lib/query-key";
import type { QuizStatus } from "@/types/quiz";
import { useQuery } from "@tanstack/react-query";
import { getDateRangeQuizzes } from "@/services/common";

type Params = {
  page: number;
  rpp: number;
  from: string | null;
  to: string | null;
  role: "student" | "admin";
  status: QuizStatus;
};

export const useRangeQuizzes = (params: Params) => {
  const { page, rpp, status, role, from, to } = params;

  const endpoint = role === "admin" ? "/admin/quiz/range" : "/quiz/range";

  return useQuery({
    queryKey: commonKeys.dateRange(page, rpp, status, from, to),
    queryFn: () =>
      getDateRangeQuizzes({ endpoint, page, rpp, status, from, to }),
    staleTime: Infinity,
    placeholderData: (prevData) => prevData,
  });
};

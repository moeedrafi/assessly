import { commonKeys } from "@/lib/query-key";
import type { QuizStatus } from "@/types/quiz";
import { useQuery } from "@tanstack/react-query";
import { getCourseQuizzes } from "@/services/common";

type Params = {
  page: number;
  rpp: number;
  courseId?: string;
  role: "student" | "admin";
  status: QuizStatus;
};

export const useCourseQuizzes = (params: Params) => {
  const { page, rpp, status, courseId, role } = params;

  const endpoint =
    role === "admin" ? `/admin/quiz/${courseId}` : `/quiz/${courseId}`;

  return useQuery({
    queryKey: commonKeys.courseQuizzes(page, rpp, status),
    queryFn: () => getCourseQuizzes({ endpoint, page, rpp, status }),
    staleTime: Infinity,
    placeholderData: (prevData) => prevData,
  });
};

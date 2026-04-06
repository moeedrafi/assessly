import { api } from "@/lib/api";
import { UserRole } from "@/types/user";
import type { CourseByRole } from "@/types/course";
import type { SnapshotByRole } from "@/types/analytics";
import type { QuizEntity, QuizStatus } from "@/types/quiz";

export const getCourseQuizzes = ({
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

export const getDateRangeQuizzes = async ({
  endpoint,
  from,
  to,
  page,
  rpp,
  status,
}: {
  endpoint: string;
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

  if (status !== "all") {
    params.set("status", status);
  }

  return api.get<QuizEntity[]>(`${endpoint}?${params.toString()}`);
};

export const getCourseSnapshot = async <T extends UserRole>({
  endpoint,
  page,
  rpp,
}: {
  page: number;
  rpp: number;
  endpoint: string;
}) => {
  return api.get<SnapshotByRole<T>>(`${endpoint}?page=${page}&rpp=${rpp}`);
};

export const getCourses = async <T extends UserRole>({
  endpoint,
  page,
  rpp,
}: {
  page: number;
  rpp: number;
  endpoint: string;
}) => {
  return api.get<CourseByRole<T>>(`${endpoint}?page=${page}&rpp=${rpp}`);
};

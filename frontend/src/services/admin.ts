import { api } from "@/lib/api";
import { CourseFormData } from "@/schemas/course.schemas";
import type { RecentUser } from "@/types/analytics";
import { QuestionDetail } from "@/types/question";
import type { QuizDetail } from "@/types/quiz";

export const getCourseFormData = (courseId: string) => {
  return api.get<CourseFormData>(`/admin/courses/${courseId}`);
};

export const getRecentJoinedUsers = async () => {
  const res = await api.get<RecentUser[]>("/admin/analytics/recent-users");
  return res.data;
};

export const getQuizDetail = async (quizId: string) => {
  const res = await api.get<QuizDetail>(`/admin/quiz/${quizId}`);
  return res.data;
};

export const getQuestionsDetail = async (quizId: string) => {
  const res = await api.get<QuestionDetail[]>(`/question/${quizId}`);
  return res.data;
};

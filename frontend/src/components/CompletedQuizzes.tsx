"use client";
import Link from "next/link";
import { api } from "@/lib/api";
import { CompletedQuiz } from "@/types/quiz";
import { useQuery } from "@tanstack/react-query";

export const CompletedQuizzes = ({ courseId }: { courseId: string }) => {
  const { data: completedQuizzes, isLoading } = useQuery({
    queryKey: ["completedQuizzes"],
    queryFn: async () => {
      const res = await api.get<CompletedQuiz[]>(
        `/quiz/admin/${courseId}/completed`,
      );
      return res.data;
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <p>loaing...</p>;

  if (!completedQuizzes || completedQuizzes.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">No Completed Quizzes</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pb-3 overflow-y-auto hide-scrollbar max-h-64">
      {completedQuizzes.map((quiz) => {
        const startsAt = new Date(quiz.startsAt);
        const endsAt = new Date(quiz.endsAt);

        return (
          <div
            key={quiz.id}
            className="bg-light p-4 space-y-4 border border-color rounded-lg shadow"
          >
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-semibold">{quiz.name}</h3>
              <p className="text-muted-foreground text-sm">
                {quiz.description}
              </p>
            </div>

            <div className="space-y-1 font-semibold">
              <div className="space-x-1 text-sm">
                <span className="text-muted-foreground">Total Marks: </span>
                <span className="text-primary">{quiz.totalMarks}</span>
              </div>

              <div className="space-x-1 text-sm">
                <span className="text-muted-foreground">Passing Marks: </span>
                <span className="text-primary">{quiz.passingMarks}</span>
              </div>

              <div className="space-x-1 text-sm">
                <span className="text-muted-foreground">Time Limit: </span>
                <span className="text-primary font-semibold">
                  {quiz.timeLimit} minutes
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="space-x-1 text-sm text-muted-foreground">
                <span>Started: </span>
                <span>
                  {startsAt.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="space-x-1 text-sm text-muted-foreground">
                <span>Ended: </span>
                <span>
                  {endsAt.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <Link href="/quizzes/1/result">
              <button className="w-full bg-primary px-4 py-2 text-white rounded-md hover:opacity-90 transition">
                View Details
              </button>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

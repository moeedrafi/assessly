"use client";
import Link from "next/link";
import { Skeleton } from "./Skeleton";
import { UserRole } from "@/types/user";
import type { QuizEntity } from "@/types/quiz";
import { useState } from "react";
import { useApiQuery } from "@/hooks/useApiQuery";
import { Pagination } from "./Pagination";

export const UpcomingQuizzes = ({
  url,
  role,
  courseId,
}: {
  url: string;
  role: UserRole;
  courseId?: number;
}) => {
  const [page, setPage] = useState<number>(1);
  const [rpp, setRpp] = useState<number>(5);

  const { data, isLoading, isPlaceholderData } = useApiQuery<QuizEntity[]>(
    ["upcomingQuizzes", { courseId, page, rpp }],
    url,
    { page, rpp },
    { staleTime: Infinity, placeholderData: (prevData) => prevData },
  );

  const upcomingQuizzes = data?.data ?? [];
  const total = data?.meta?.totalItems ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  if (isLoading) return <Skeleton max={3} />;

  if (!upcomingQuizzes || upcomingQuizzes.length === 0) {
    return <p className="text-muted-foreground text-sm">No Upcoming Quizzes</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 overflow-y-scroll hide-scrollbar max-h-80">
        {upcomingQuizzes.map((quiz) => {
          const startsAt = new Date(quiz.startsAt);
          const endsAt = new Date(quiz.endsAt);

          return (
            <div
              key={quiz.id}
              className={`flex flex-col gap-4 bg-light p-4 border border-color rounded-lg shadow ${isPlaceholderData ? "opacity-60" : ""}`}
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
                  <span className="text-secondary">{quiz.totalMarks}</span>
                </div>

                <div className="space-x-1 text-sm">
                  <span className="text-muted-foreground">Passing Marks: </span>
                  <span className="text-secondary">{quiz.passingMarks}</span>
                </div>

                <div className="space-x-1 text-sm">
                  <span className="text-muted-foreground">Time Limit: </span>
                  <span className="text-secondary">
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

              {role === UserRole.ADMIN ? (
                <Link
                  href={`/admin/quizzes/${quiz.id}`}
                  className="w-full text-center px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-md"
                >
                  View Details
                </Link>
              ) : (
                <Link
                  href={`/quizzes/${quiz.id}`}
                  className="w-full text-center px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-md"
                >
                  View Details
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <Pagination
        isLoading={isLoading}
        page={page}
        rpp={rpp}
        total={total}
        totalPages={totalPages}
        onPageChange={setPage}
        setRpp={setRpp}
      />
    </>
  );
};

"use client";
import { getTabs } from "@/lib/utils";
import { Tabs } from "@/components/Tabs";
import type { QuizStatus } from "@/types/quiz";
import { useQuizzes } from "@/hooks/useQuizzes";
import { Skeleton } from "@/components/Skeleton";
import { Pagination } from "@/components/Pagination";
import { QuizCard } from "@/components/quiz/QuizCard";
import { parseAsInteger, parseAsStringEnum, useQueryState } from "nuqs";

export const Quizzes = ({
  scope = "all",
  role = "student",
  courseId,
}: {
  courseId?: string;
  role?: "student" | "admin";
  scope?: "all" | "course";
}) => {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [rpp, setRpp] = useQueryState("rpp", parseAsInteger.withDefault(5));
  const [selectedStatus, setSelectedStatus] = useQueryState<QuizStatus>(
    "status",
    parseAsStringEnum<QuizStatus>([
      "all",
      "completed",
      "upcoming",
      "missed",
    ]).withDefault("all"),
  );

  const { data, isPlaceholderData, isLoading } = useQuizzes({
    rpp,
    page,
    role,
    scope,
    courseId,
    status: selectedStatus,
  });

  const quizzes = data?.data ?? [];
  const total = data?.meta?.totalItems ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div className="space-y-3">
      <Tabs
        items={getTabs(role)}
        onChange={setSelectedStatus}
        value={selectedStatus}
      />

      <hr className="text-muted-foreground" />

      {isLoading ? (
        <Skeleton max={3} />
      ) : quizzes.length === 0 ? (
        <p className="text-muted-foreground text-sm col-span-full">
          No quizzes found
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 overflow-y-scroll hide-scrollbar max-h-80">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} isDimmed={isPlaceholderData} />
          ))}
        </div>
      )}

      <Pagination
        isLoading={isLoading}
        page={page}
        rpp={rpp}
        total={total}
        totalPages={totalPages}
        onPageChange={setPage}
        onRppChange={setRpp}
      />
    </div>
  );
};

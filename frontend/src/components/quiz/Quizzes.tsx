"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { Tabs } from "@/components/Tabs";
import type { QuizEntity } from "@/types/quiz";
import { Skeleton } from "@/components/Skeleton";
import { Pagination } from "@/components/Pagination";
import { QuizCard } from "@/components/quiz/QuizCard";

type QuizStatus = "all" | "completed" | "upcoming" | "missed";

export const Quizzes = ({
  courseId,
  url,
}: {
  courseId: string;
  url: string;
}) => {
  const [page, setPage] = useState<number>(1);
  const [rpp, setRpp] = useState<number>(5);
  const [selectedStatus, setSelectedStatus] = useState<QuizStatus>("all");

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ["quiz", { courseId, selectedStatus, page, rpp }],
    queryFn: async () => {
      return api.get<QuizEntity[]>(
        `/${url}?page=${page}&rpp=${rpp}&status=${selectedStatus}`,
      );
    },
    staleTime: Infinity,
    placeholderData: (prevData) => prevData,
  });

  const quizzes = data?.data ?? [];
  const total = data?.meta?.totalItems ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div className="space-y-3">
      <Tabs
        items={[
          { label: "All", value: "all" },
          { label: "Completed", value: "completed" },
          { label: "Upcoming", value: "upcoming" },
          { label: "Missed", value: "missed" },
        ]}
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
        setRpp={setRpp}
      />
    </div>
  );
};

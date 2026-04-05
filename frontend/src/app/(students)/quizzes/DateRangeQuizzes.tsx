"use client";
import { getTabs } from "@/lib/utils";
import { Tabs } from "@/components/Tabs";
import { useEffect, useState } from "react";
import type { QuizStatus } from "@/types/quiz";
import { studentKeys } from "@/lib/query-key";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/Skeleton";
import { Pagination } from "@/components/Pagination";
import { QuizCard } from "@/components/quiz/QuizCard";
import { getDateRangeQuizzes } from "@/services/student";
import { parseAsInteger, parseAsStringEnum, useQueryState } from "nuqs";

export const DateRangeQuizzes = () => {
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

  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: studentKeys.dateRange(from, to, page, rpp, selectedStatus),
    queryFn: () =>
      getDateRangeQuizzes({ from, page, rpp, to, status: selectedStatus }),
  });

  useEffect(() => {
    setPage(1);
  }, [selectedStatus?.toString(), rpp]);

  const quizzes = data?.data ?? [];
  const total = data?.meta?.totalItems ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div className="flex flex-col gap-3">
      <Tabs
        items={getTabs("student")}
        onChange={setSelectedStatus}
        value={selectedStatus}
      />

      <hr className="text-muted-foreground" />

      <div className="flex gap-3">
        <div className="w-full flex flex-col gap-1">
          <label className="font-semibold text-sm text-muted-foreground">
            From
          </label>
          <input
            type="datetime-local"
            value={from ?? ""}
            onChange={(e) => setFrom(e.target.value || null)}
            className="bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none"
          />
        </div>

        <div className="w-full flex flex-col gap-1">
          <label className="font-semibold text-sm text-muted-foreground">
            To
          </label>
          <input
            type="datetime-local"
            value={to ?? ""}
            onChange={(e) => setTo(e.target.value || null)}
            className="bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none"
          />
        </div>
      </div>

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

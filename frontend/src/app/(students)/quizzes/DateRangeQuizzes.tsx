"use client";
import { api } from "@/lib/api";
import { useState } from "react";
import type { QuizEntity } from "@/types/quiz";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/Skeleton";
import { Pagination } from "@/components/Pagination";
import { QuizCard } from "@/components/quiz/QuizCard";

export const DateRangeQuizzes = () => {
  const [to, setTo] = useState<string>("");
  const [rpp, setRpp] = useState<number>(5);
  const [page, setPage] = useState<number>(1);
  const [from, setFrom] = useState<string>("");

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ["date-range", { from, to, page, rpp }],
    queryFn: () => {
      const fromIso = new Date(from).toISOString();
      const toIso = new Date(to).toISOString();

      return api.get<QuizEntity[]>(
        `/quiz/range?from=${fromIso}&to=${toIso}&page=${page}&rpp=${rpp}`,
      );
    },
    enabled: !!from && !!to,
  });

  const quizzes = data?.data ?? [];
  const total = data?.meta?.totalItems ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <div className="w-full flex flex-col gap-1">
          <label className="font-semibold text-sm text-muted-foreground after:content-['*'] after:ml-1 after:text-red-500">
            From
          </label>
          <input
            type="datetime-local"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none"
          />
        </div>

        <div className="w-full flex flex-col gap-1">
          <label className="font-semibold text-sm text-muted-foreground after:content-['*'] after:ml-1 after:text-red-500">
            To
          </label>
          <input
            type="datetime-local"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none"
          />
        </div>
      </div>

      {!from || !to ? (
        <p className="text-muted-foreground text-sm col-span-full">
          Please select a start and end date to see quizzes.
        </p>
      ) : isLoading ? (
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

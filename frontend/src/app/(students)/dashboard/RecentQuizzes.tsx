"use client";
import { useMemo } from "react";
import { Table } from "@/components/Table";
import { useQuery } from "@tanstack/react-query";
import type { RecentQuiz } from "@/types/analytics";
import type { ColumnDef } from "@tanstack/react-table";
import { getRecentQuiz } from "@/services/student";

export const RecentQuizzes = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["recent-quiz"],
    queryFn: getRecentQuiz,
    staleTime: Infinity,
  });

  const columns = useMemo<ColumnDef<RecentQuiz>[]>(
    () => [
      { accessorKey: "name", header: "Quiz" },
      { accessorKey: "totalMarks", header: "Total Marks" },
      { accessorKey: "passingMarks", header: "Passing Marks" },
      {
        accessorKey: "score",
        header: "Score",
        cell: ({ row }) => {
          const score = row.original.score;
          const avg = row.original.avgScore;

          const isAbove = score > avg;
          const isEqual = score === avg;

          return (
            <div className="flex items-center gap-2">
              <span
                className={`${isAbove ? "text-green-500" : isEqual ? "text-gray-400" : "text-red-500"} `}
              >
                {score}
              </span>

              {isAbove && <span className="text-green-500">▲</span>}
              {!isAbove && !isEqual && <span className="text-red-500">▼</span>}
              {isEqual && <span className="text-gray-400">●</span>}
            </div>
          );
        },
      },
      { accessorKey: "avgScore", header: "Average" },
    ],
    [],
  );

  return (
    <div className="bg-bg flex flex-col shadow-lg col-span-12 xl:col-span-8 space-y-4 p-6 sm:p-8 rounded-lg border border-color">
      <h3 className="text-xl sm:text-2xl font-bold">Recent Users</h3>

      <Table className="" data={data} columns={columns} isLoading={isLoading} />
    </div>
  );
};

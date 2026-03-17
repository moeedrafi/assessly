"use client";
import { useMemo } from "react";
import { api } from "@/lib/api";
import { Table } from "@/components/Table";
import { useQuery } from "@tanstack/react-query";
import type { RecentQuiz } from "@/types/analytics";
import type { ColumnDef } from "@tanstack/react-table";

export const RecentQuizzes = ({
  initialData,
}: {
  initialData: RecentQuiz[];
}) => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["recent-quiz"],
    queryFn: async () => {
      const res = await api.get<RecentQuiz[]>("/analytics/recent-quiz");
      return res.data;
    },
    staleTime: Infinity,
    initialData,
  });

  const columns = useMemo<ColumnDef<RecentQuiz>[]>(
    () => [
      { accessorKey: "name", header: "Quiz" },
      { accessorKey: "totalMarks", header: "Total Marks" },
      { accessorKey: "passingMarks", header: "Passing Marks" },
      { accessorKey: "score", header: "Score" },
      { accessorKey: "avgScore", header: "Average Score" },
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

"use client";
import { useMemo, useState } from "react";
import { Table } from "@/components/Table";
import { useApiQuery } from "@/hooks/useApiQuery";
import { Pagination } from "@/components/Pagination";
import type { ColumnDef } from "@tanstack/react-table";
import type { ApiResponse, PaginationMeta } from "@/lib/api";
import type { StudentCourseSnapshotType } from "@/types/analytics";

export const StudentCourseSnapshot = ({
  initialData,
}: {
  initialData: ApiResponse<StudentCourseSnapshotType[], PaginationMeta>;
}) => {
  const [page, setPage] = useState<number>(1);
  const [rpp, setRpp] = useState<number>(5);

  const { data, isLoading, isPlaceholderData } = useApiQuery<
    StudentCourseSnapshotType[]
  >(
    ["course-snapshot", page, rpp],
    "/analytics/course-snapshot",
    { page, rpp },
    {
      staleTime: Infinity,
      initialData,
      placeholderData: (prevData) => prevData,
    },
  );

  const courses = data?.data ?? [];
  const total = data?.meta?.totalItems ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  const columns = useMemo<ColumnDef<StudentCourseSnapshotType>[]>(
    () => [
      { accessorKey: "name", header: "Course" },
      { accessorKey: "totalQuizzes", header: "Total Quizzes" },
      { accessorKey: "yourAvg", header: "Your Average" },
      { accessorKey: "totalAvg", header: "Total Average" },
    ],
    [],
  );

  return (
    <div className="bg-bg flex flex-col shadow-lg col-span-12 xl:col-span-8 space-y-4 p-6 sm:p-8 rounded-lg border border-color">
      <h3 className="text-xl sm:text-2xl font-bold">Course Snapshot</h3>

      <Table
        data={courses}
        columns={columns}
        isLoading={isLoading}
        className={isPlaceholderData ? "opacity-60" : ""}
      />
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

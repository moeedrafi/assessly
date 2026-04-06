"use client";
import { useMemo } from "react";
import { Table } from "@/components/Table";
import { Pagination } from "@/components/Pagination";
import { parseAsInteger, useQueryState } from "nuqs";
import type { ColumnDef } from "@tanstack/react-table";
import type { StudentCourseSnapshotType } from "@/types/analytics";
import { useStudentCourseSnapshot } from "@/hooks/course-snapshot/useStudentCourseSnapshot";

export const StudentCourseSnapshot = () => {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [rpp, setRpp] = useQueryState("rpp", parseAsInteger.withDefault(5));

  const { data, isLoading, isPlaceholderData } = useStudentCourseSnapshot({
    page,
    rpp,
  });

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
        onRppChange={setRpp}
      />
    </div>
  );
};

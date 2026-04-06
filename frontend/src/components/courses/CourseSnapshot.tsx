"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { Table } from "@/components/Table";
import { Pagination } from "@/components/Pagination";
import type { CourseSnapshotType } from "@/types/analytics";
import { useAdminCourseSnapshot } from "@/hooks/course-snapshot/useAdminCourseSnapshot";

export const CourseSnapshot = () => {
  const [page, setPage] = useState<number>(1);
  const [rpp, setRpp] = useState<number>(5);

  const { data, isLoading, isPlaceholderData } = useAdminCourseSnapshot({
    page,
    rpp,
  });

  const courses = data?.data ?? [];
  const total = data?.meta?.totalItems ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  const columns = useMemo<ColumnDef<CourseSnapshotType>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Course Name",
        cell: (info) => {
          const value = info.getValue<string>();

          return (
            <Link
              href={`/admin/courses/${info.row.original.id}`}
              className="hover:text-primary"
            >
              {value}
            </Link>
          );
        },
      },
      { accessorKey: "totalStudents", header: "Total Students" },
      { accessorKey: "avgScore", header: "Average Score" },
      { accessorKey: "passRate", header: "Passing Rate" },
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

"use client";
import { useMemo } from "react";
import { api } from "@/lib/api";
import { Table } from "@/components/Table";
import { useQuery } from "@tanstack/react-query";
import type { RecentUser } from "@/types/analytics";
import type { ColumnDef } from "@tanstack/react-table";

export const RecentJoinedUsers = ({
  initialData,
}: {
  initialData: RecentUser[];
}) => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["recent-users"],
    queryFn: async () => {
      const res = await api.get<RecentUser[]>("/analytics/recent-users");
      return res.data;
    },
    staleTime: Infinity,
    initialData,
  });

  const columns = useMemo<ColumnDef<RecentUser>[]>(
    () => [
      {
        accessorKey: "name",
        header: "First Name",
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => <i>{info.getValue<string>()}</i>,
      },
      {
        accessorKey: "joinedCourses",
        header: "Joined Courses",
        cell: (info) => {
          const courses = info.getValue<RecentUser["joinedCourses"]>();
          const visibleCourses = courses.slice(0, 2);
          const remainingCourses = courses.slice(2);
          const remainingCount = remainingCourses.length;

          return (
            <div className="flex flex-wrap gap-1">
              {visibleCourses.map((course) => (
                <span
                  key={course.id}
                  className={`px-2 py-1 text-xs rounded-md bg-primary/20 text-primary ${remainingCount > 0 ? "truncate max-w-32" : ""}`}
                >
                  {course.name}
                </span>
              ))}

              {remainingCount > 0 && (
                <span
                  title={remainingCourses.map((c) => c.name).join(", ")}
                  className="px-2 py-1 text-xs rounded-md bg-muted text-muted-foreground cursor-pointer hover:bg-muted/80 transition"
                >
                  +{remainingCount} more
                </span>
              )}
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <div className="bg-bg flex flex-col shadow-lg col-span-12 xl:col-span-8 space-y-4 p-6 sm:p-8 rounded-lg border border-color">
      <h3 className="text-xl sm:text-2xl font-bold">Recent Users</h3>

      <Table data={data} columns={columns} isLoading={isLoading} />
    </div>
  );
};

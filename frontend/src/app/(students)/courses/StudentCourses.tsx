"use client";
import Link from "next/link";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { Modal } from "@/components/Modal";
import { useDialog } from "@/hooks/useDialog";
import { JoinedCourse } from "@/types/course";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/Skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { Pagination } from "@/components/Pagination";
import { useState } from "react";
import { useApiQuery } from "@/hooks/useApiQuery";

export const StudentCourses = () => {
  const queryClient = useQueryClient();
  const { close, dialogRef, open } = useDialog();

  const [page, setPage] = useState<number>(1);
  const [rpp, setRpp] = useState<number>(5);

  const { data, isLoading, isPlaceholderData } = useApiQuery<JoinedCourse[]>(
    ["course", page, rpp],
    "/courses",
    { page, rpp },
    {
      staleTime: Infinity,
      placeholderData: (prevData) => prevData,
    },
  );

  const courses = data?.data ?? [];
  const total = data?.meta?.totalItems ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  if (isLoading) return <Skeleton />;

  if (!courses || courses.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">No courses joined yet.</p>
    );
  }

  const leaveCourse = async (courseId: number) => {
    const { message } = await api.post(`/courses/leave/${courseId}`, {});
    queryClient.invalidateQueries({ queryKey: ["courses"] });
    toast.success(message);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className={`flex flex-col h-full bg-light p-4 space-y-3 border border-color rounded-lg shadow ${isPlaceholderData ? "opacity-60" : ""}`}
          >
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-semibold">{course.name}</h3>
                <span
                  className={`px-2 py-0.5 text-white border rounded-lg ${course.isActive ? "bg-green-700 border-green-400" : "bg-red-700 border-red-400"}`}
                >
                  {course.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <p className="text-muted-foreground text-sm">
                {course.description}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground">Instructor:</span>
                <span className="px-2 py-0.5 rounded bg-bg border text-xs">
                  {course.teacherName}
                </span>
              </div>

              <div className="space-y-1">
                <Link
                  href={`/courses/${course.id}`}
                  className="inline-block w-full text-center bg-primary px-4 py-2 text-white rounded-md hover:bg-primary/80 transition"
                >
                  View Details
                </Link>

                <Button
                  className="w-full"
                  variant="destructive"
                  onClick={open}
                  // onClick={() => leaveCourse(course.id)}
                >
                  Leave Course
                </Button>
              </div>
            </div>

            <Modal
              title="Leave Course"
              description={`Are you sure you want to leave ${course.name}?`}
              close={close}
              dialogRef={dialogRef}
              isLoading={false}
              onClick={async () => {
                await leaveCourse(course.id);
                close();
              }}
            />
          </div>
        ))}
      </div>

      <Pagination
        isLoading={isLoading}
        page={page}
        rpp={rpp}
        total={total}
        totalPages={totalPages}
        onPageChange={setPage}
        setRpp={setRpp}
      />
    </>
  );
};

"use client";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { EditIcon, PlusCircle, Trash2Icon } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { ApiError } from "@/lib/error";
import { useDialog } from "@/hooks/useDialog";
import { Button } from "@/components/ui/Button";
import { TeachingCourse } from "@/types/course";
import { DeleteModal } from "@/components/DeleteModal";

export const Courses = () => {
  const queryClient = useQueryClient();
  const { data: courses, isLoading } = useQuery({
    queryKey: ["adminCourses"],
    queryFn: async () => {
      const res = await api.get<TeachingCourse[]>("/admin/courses");
      return res.data;
    },
    staleTime: 24 * 60,
  });

  const { close, dialogRef, open } = useDialog();
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  const handleDelete = async () => {
    if (!selectedCourseId) return;
    setIsDeleting(true);

    try {
      const { message } = await api.delete(
        `/admin/courses/${selectedCourseId}`,
      );
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["adminCourses"] });
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsDeleting(false);
      close();
      setSelectedCourseId(null);
    }
  };

  if (isLoading) return <div className="p-6">Loading...</div>;

  if (!courses || courses.length === 0) {
    return (
      <div className="w-full space-y-2 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold">No Courses Found</h1>
        <p className="text-sm text-muted-foreground">
          Create a course to see course yet. Enter the code provided by your
          teacher.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 bg-bg p-6 sm:p-8 border border-color shadow rounded-lg">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl sm:text-2xl font-bold">Your Courses</h2>
        <Link
          href="/admin/courses/create-course"
          className="inline-flex items-center gap-2 rounded-md text-white px-4 py-2 bg-secondary hover:bg-secondary/80"
        >
          <PlusCircle />
          View Details
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex flex-col h-full bg-light p-4 space-y-3 border border-color rounded-lg shadow"
          >
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-semibold">{course.name}</h3>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/courses/${course.id}/edit-course`}
                    className="text-muted-foreground hover:text-text"
                  >
                    <EditIcon className="w-5 h-5" />
                  </Link>

                  <Button
                    onClick={() => {
                      open();
                      setSelectedCourseId(course.id);
                    }}
                    className="p-0 bg-transparent hover:bg-transparent text-red-500 hover:text-red-600"
                  >
                    <Trash2Icon className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <p className="text-muted-foreground text-sm">
                {course.description}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground">Course Code:</span>
                <span className="px-2 py-0.5 rounded bg-bg border text-xs">
                  {course.code}
                </span>
              </div>

              <span
                className={`block px-2 py-1 rounded text-xs font-medium ${
                  course.allowStudentJoin
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {course.allowStudentJoin
                  ? "Students Can Join"
                  : "Join Disabled"}
              </span>

              <Link
                href={`/admin/courses/${course.id}`}
                className="inline-block w-full text-center bg-primary px-4 py-2 text-white rounded-md hover:bg-primary/80 transition"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}

        <DeleteModal
          onDelete={handleDelete}
          close={close}
          dialogRef={dialogRef}
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
};

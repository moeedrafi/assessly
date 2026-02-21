"use client";
import Link from "next/link";
import { useDialog } from "@/hooks/useDialog";
import { useDelete } from "@/hooks/useDelete";
import { Actions } from "@/components/Actions";
import { useCourses } from "@/hooks/useCourses";
import { TeachingCourse } from "@/types/course";
import { Skeleton } from "@/components/Skeleton";
import { DeleteModal } from "@/components/DeleteModal";

export const Courses = () => {
  const { data: courses, isLoading } =
    useCourses<TeachingCourse[]>("/admin/courses");
  const { close, dialogRef, open } = useDialog();
  const { handleDelete, isDeleting } = useDelete("/admin/courses", ["courses"]);

  if (isLoading) return <Skeleton />;

  if (!courses || courses.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No courses available yet. Click &quot;Create Course&quot; to add your
        first course.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {courses.map((course) => (
        <div
          key={course.id}
          className="flex flex-col h-full bg-light p-4 space-y-3 border border-color rounded-lg shadow"
        >
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-semibold">{course.name}</h3>
              <Actions
                editHref={`/admin/courses/${course.id}/edit-course`}
                onOpen={open}
              />
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
              {course.allowStudentJoin ? "Students Can Join" : "Join Disabled"}
            </span>

            <Link
              href={`/admin/courses/${course.id}`}
              className="inline-block w-full text-center bg-primary px-4 py-2 text-white rounded-md hover:bg-primary/80 transition"
            >
              View Details
            </Link>
          </div>

          <DeleteModal
            title="Delete Course"
            description={`Are you sure you want to delete ${course.name}?`}
            close={close}
            dialogRef={dialogRef}
            isLoading={isDeleting}
            onDelete={async () => {
              await handleDelete(course.id);
              close();
            }}
          />
        </div>
      ))}
    </div>
  );
};

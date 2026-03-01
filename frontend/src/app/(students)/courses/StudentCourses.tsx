"use client";
import Link from "next/link";
import { Skeleton } from "@/components/Skeleton";
import { useCourses } from "@/hooks/useCourses";
import { JoinedCourse } from "@/types/course";

export const StudentCourses = () => {
  const { data: courses, isLoading } = useCourses<JoinedCourse[]>("/courses");

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
              <span>{course.isActive ? "Active" : "Inactive"}</span>
            </div>

            <p className="text-muted-foreground text-sm">
              {course.description}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground">Instructor:</span>
              <span className="px-2 py-0.5 rounded bg-bg border text-xs">
                {course.teacher.name}
              </span>
            </div>

            <Link
              href={`/courses/${course.id}`}
              className="inline-block w-full text-center bg-primary px-4 py-2 text-white rounded-md hover:bg-primary/80 transition"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

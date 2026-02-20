"use client";
import Link from "next/link";
import { api } from "@/lib/api";
import { EditIcon, PlusCircle } from "lucide-react";
import { TeachingCourse } from "@/types/course";
import { useQuery } from "@tanstack/react-query";

export const Courses = () => {
  const { data: courses, isLoading } = useQuery({
    queryKey: ["adminCourses"],
    queryFn: async () => {
      const res = await api.get<TeachingCourse[]>("/admin/courses");
      return res.data;
    },
    staleTime: 24 * 60,
  });

  if (isLoading) return <div className="p-6">Loading...</div>;

  if (!courses || courses.length === 0) {
    return (
      <main className="flex items-center justify-center px-4">
        <section className="w-full max-w-md rounded-2xl font-lato border border-color bg-bg p-6 sm:p-8 shadow-lg">
          {/* Heading */}
          <div className="space-y-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold">Join a Course</h1>
            <p className="text-sm text-muted-foreground">
              You haven&apos;t joined any course yet. Enter the code provided by
              your teacher.
            </p>
          </div>

          {/* Form */}
          <form className="mt-6 space-y-4">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="courseCode"
                className="text-sm font-medium text-text"
              >
                Course Code
              </label>
              <input
                required
                id="courseCode"
                name="courseCode"
                type="text"
                placeholder="e.g. QZ-8F4K"
                className="bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
            >
              Join Course
            </button>
          </form>
        </section>
      </main>
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
                <Link href={`/admin/courses/${course.id}/edit-course`}>
                  <EditIcon className="w-5 h-5 text-muted-foreground" />
                </Link>
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
      </div>
    </div>
  );
};

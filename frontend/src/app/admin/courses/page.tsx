import Link from "next/link";
import { api } from "@/lib/api";
import { cookies } from "next/headers";
import { PlusCircle } from "lucide-react";
import { Courses } from "@/components/Courses";
import type { TeachingCourse } from "@/types/course";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const AdminCoursesPage = async () => {
  const cookieStore = await cookies();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await api.get<TeachingCourse[]>("/admin/courses", {
        Cookie: cookieStore.toString(),
      });
      return res.data;
    },
    staleTime: Infinity,
  });

  return (
    <main>
      <section className="w-full font-lato space-y-4 px-2 py-4">
        <div className="space-y-2 text-center p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome</h1>
          <p className="text-sm text-muted-foreground">
            View Details of the courses you are teaching
          </p>
        </div>

        <div className="space-y-6 bg-bg p-6 sm:p-8 border border-color shadow rounded-lg">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xl sm:text-2xl font-bold">Your Courses</h2>
            <Link
              href="/admin/courses/create-course"
              className="inline-flex items-center gap-2 rounded-md text-white px-4 py-2 bg-secondary hover:bg-secondary/80"
            >
              <PlusCircle />
              Create Course
            </Link>
          </div>

          <HydrationBoundary state={dehydrate(queryClient)}>
            <Courses />
          </HydrationBoundary>
        </div>
      </section>
    </main>
  );
};

export default AdminCoursesPage;

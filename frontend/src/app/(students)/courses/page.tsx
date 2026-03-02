import { api } from "@/lib/api";
import { cookies } from "next/headers";
import { StudentCourses } from "./StudentCourses";
import type { JoinedCourse } from "@/types/course";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const CoursesPage = async () => {
  const cookieStore = await cookies();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await api.get<JoinedCourse[]>("/courses", {
        Cookie: cookieStore.toString(),
      });
      return res.data;
    },
    staleTime: Infinity,
  });

  return (
    <main>
      <section className="w-full font-lato space-y-4 px-2 py-4">
        {/* Heading */}
        <div className="space-y-2 text-center p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome</h1>
          <p className="text-sm text-muted-foreground">
            View Details of the courses you are teaching in
          </p>
        </div>

        <div className="space-y-2 bg-bg p-6 sm:p-8 border border-color shadow rounded-lg">
          <h2 className="text-xl sm:text-2xl font-bold">Your Courses</h2>

          <HydrationBoundary state={dehydrate(queryClient)}>
            <StudentCourses />
          </HydrationBoundary>
        </div>
      </section>
    </main>
  );
};

export default CoursesPage;

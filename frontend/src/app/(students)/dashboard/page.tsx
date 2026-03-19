import { cookies } from "next/headers";
import { UserRole } from "@/types/user";
import { api, PaginationMeta } from "@/lib/api";
import { RecentQuizzes } from "./RecentQuizzes";
import { StudentCourseSnapshot } from "./StudentCourseSnapshot";
import { AvailableQuizzes } from "@/components/quiz/AvailableQuiz";
import type { RecentQuiz, StudentCourseSnapshotType } from "@/types/analytics";

const DashboardPage = async () => {
  const cookieStore = await cookies();

  const res = await api.get<RecentQuiz[]>("/analytics/recent-quiz", {
    Cookie: cookieStore.toString(),
  });

  const courseSnapshot = await api.get<
    StudentCourseSnapshotType[],
    PaginationMeta
  >("/analytics/course-snapshot?page=1&rpp=5", {
    Cookie: cookieStore.toString(),
  });

  return (
    <main>
      <section className="w-full font-lato space-y-4 px-2 py-4">
        {/* Heading */}
        <div className="space-y-2 text-center p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome</h1>
          <p className="text-sm text-muted-foreground">
            View Details of the courses you are studying
          </p>
        </div>

        <div className="space-y-6 bg-bg p-6 sm:p-8 border border-color shadow rounded-lg">
          <h2 className="text-xl sm:text-2xl font-bold">Available Quiz</h2>

          <AvailableQuizzes role={UserRole.USER} url="/quiz/available" />
        </div>

        <RecentQuizzes initialData={res.data} />
        <StudentCourseSnapshot initialData={courseSnapshot} />
      </section>
    </main>
  );
};

export default DashboardPage;

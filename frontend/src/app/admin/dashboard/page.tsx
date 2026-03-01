import { api, PaginationMeta } from "@/lib/api";
import { cookies } from "next/headers";
import { Stats } from "@/components/Stats";
import { CourseSnapshot } from "@/components/CourseSnapshot";
import { RecentJoinedUsers } from "@/components/RecentJoinedUsers";
import type { CourseSnapshotType, RecentUser } from "@/types/analytics";

const AdminDashboardPage = async () => {
  const cookieStore = await cookies();

  const [recentUsers, courseSnapshot] = await Promise.all([
    api.get<RecentUser[]>("/analytics/recent-users", {
      Cookie: cookieStore.toString(),
    }),
    api.get<CourseSnapshotType[], PaginationMeta>(
      "/analytics/course-snapshot?page=1&rpp=5",
      { Cookie: cookieStore.toString() },
    ),
  ]);

  return (
    <main>
      <section className="w-full font-lato space-y-4 px-2 py-4">
        {/* Heading */}
        <div className="space-y-2 text-center p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome</h1>
          <p className="text-sm text-muted-foreground">
            View Details of the courses you are managing
          </p>
        </div>

        <Stats />
        <RecentJoinedUsers initialData={recentUsers.data} />
        <CourseSnapshot initialData={courseSnapshot} />
      </section>
    </main>
  );
};

export default AdminDashboardPage;

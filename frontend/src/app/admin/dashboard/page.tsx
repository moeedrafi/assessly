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

  const courses = 1;

  if (!courses) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <section className="w-full max-w-md rounded-2xl font-lato border border-color bg-bg p-6 sm:p-8 shadow-lg">
          {/* Heading */}
          <div className="space-y-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold">Create a Course</h1>
            <p className="text-sm text-muted-foreground">
              You haven&apos;t created any course yet. Create a code and send it
              to your students.
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

        <div className="space-y-2 bg-bg p-6 sm:p-8 shadow border border-color rounded-lg">
          <h2 className="text-xl sm:text-2xl font-bold">Your Courses</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-light p-4 space-y-4 border border-color rounded-lg shadow">
              <div>
                <h3 className="text-lg font-semibold">Course Name</h3>
                <h4 className="text-muted-foreground">30 Students</h4>
              </div>

              <button className="w-full bg-primary px-4 py-2 text-white rounded-md hover:opacity-90 transition">
                View Details
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2 bg-bg p-6 sm:p-8 shadow border border-color rounded-lg">
          <h2 className="text-xl sm:text-2xl font-bold">Upcoming Quizzes</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <div className="bg-light p-4 space-y-4 border border-color rounded-lg shadow">
              <div>
                <h3 className="text-lg font-semibold">Quiz Name</h3>
                <p className="text-muted-foreground">Course Name</p>
              </div>

              {/* Time */}
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">29 Dec 2025</span> · 11:00 - 11:30
              </div>

              <div className="text-sm">
                <div className="space-x-1">
                  <span className="text-muted-foreground">Duration: </span>
                  <span className="text-primary font-semibold">30m</span>
                </div>

                <div className="space-x-1">
                  <span className="text-muted-foreground">Questions: </span>
                  <span className="text-primary font-semibold">20</span>
                </div>
              </div>

              <button className="w-full bg-primary px-4 py-2 text-white rounded-md hover:opacity-90 transition">
                View Details
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminDashboardPage;

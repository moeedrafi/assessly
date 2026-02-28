import { api } from "@/lib/api";
import { cookies } from "next/headers";
import { StatsCard } from "@/types/analytics";
import { LibraryBigIcon } from "lucide-react";

export const Stats = async () => {
  const cookieStore = await cookies();
  const { data } = await api.get<StatsCard>("/analytics/kpis", {
    Cookie: cookieStore.toString(),
  });

  return (
    <div className="bg-bg flex flex-col shadow-lg col-span-12 xl:col-span-8 space-y-4 p-6 sm:p-8 rounded-lg border border-color">
      <h3 className="text-xl sm:text-2xl font-bold">Stats</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            title: "Total Users",
            value: data.totalUsers,
            icon: LibraryBigIcon,
          },
          {
            title: "Total Courses",
            value: data.totalCourses,
            icon: LibraryBigIcon,
          },
          {
            title: "Total Quizzes",
            value: data.totalQuizzes,
            icon: LibraryBigIcon,
          },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-light p-4 space-y-4 border border-color rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <div className="bg-primary w-max p-2 rounded-lg">
                <Icon className="text-white w-6 h-6" />
              </div>
              <h3 className="font-semibold">{stat.title}</h3>
              <span className="text-muted-foreground text-lg font-medium">
                {stat.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

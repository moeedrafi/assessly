"use client";
import { Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getRankDisplay, getRankStyle } from "@/lib/utils";
import { getLeaderboard } from "@/services/student";

export const Leaderboard = ({ courseId }: { courseId: string }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["course-leaderboard", { courseId }],
    queryFn: () => getLeaderboard(courseId),
    staleTime: 1000 * 60,
    retry: 1,
  });

  if (isLoading) return <p>Loading....</p>;
  if (isError || !data || data.ranked.length === 0) {
    return (
      <div className="bg-bg flex flex-col shadow col-span-12 xl:col-span-4 space-y-2 p-6 sm:p-8 rounded-lg border border-color">
        <h3 className="text-xl font-bold">Leaderboard</h3>

        <p className="text-sm text-muted-foreground">
          {isError
            ? "Failed to load leaderboard. Try again later"
            : "No leaderboard yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-bg flex flex-col shadow col-span-12 xl:col-span-4 space-y-2 p-6 sm:p-8 rounded-lg border border-color">
      <div className="flex justify-between items-center gap-2">
        <h3 className="text-xl font-bold">Leaderboard</h3>

        <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-lg font-medium text-sm">
          <Award className="w-4 h-4" />
          <span>Your Rank: {data.currentUser?.rank ?? "N/A"}</span>
        </div>
      </div>

      <div className="max-h-84 overflow-y-scroll hide-scrollbar space-y-4 pb-16">
        {data.ranked.map((user) => {
          const isOwn = user.studentId === data.currentUser.studentId;

          return (
            <div
              key={user.studentId}
              className={`flex flex-col rounded-md border px-3 py-2 ${getRankStyle(user.rank)}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="w-6 text-sm font-semibold text-muted-foreground">
                  {getRankDisplay(user.rank)}
                </span>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                    {user.name?.charAt(0)}
                  </div>
                  <span className="font-medium">
                    {isOwn ? "You" : user.name}
                  </span>
                </div>

                <span className="text-sm font-semibold text-primary">
                  {user.totalScore} pts
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

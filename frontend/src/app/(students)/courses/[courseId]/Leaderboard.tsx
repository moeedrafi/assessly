"use client";
import { api } from "@/lib/api";
import { Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { LeaderboardType } from "@/types/analytics";
import { getRankDisplay, getRankStyle } from "@/lib/utils";

export const Leaderboard = ({ courseId }: { courseId: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["course-leaderboard"],
    queryFn: async () => {
      const res = await api.get<LeaderboardType>(
        `/quiz-attempt/course/${courseId}/leaderboard`,
      );
      return res.data;
    },
    staleTime: Infinity,
  });

  if (isLoading) return <p>Loading....</p>;
  if (!data) return <p>No data found</p>;

  return (
    <div className="bg-bg flex flex-col shadow col-span-12 xl:col-span-4 space-y-2 p-6 sm:p-8 rounded-lg border border-color">
      <div className="flex justify-between items-center gap-2">
        <h3 className="text-xl font-bold">Leaderboard</h3>

        <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-lg font-medium text-sm">
          <Award className="w-4 h-4" />
          <span>Your Rank: {data.currentUser.rank}</span>
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

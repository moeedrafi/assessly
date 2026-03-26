"use client";
import { useMemo } from "react";
import { api } from "@/lib/api";
import { QuizStatsType } from "@/types/quiz";
import { useQuery } from "@tanstack/react-query";

export const QuizStats = ({ courseId }: { courseId: string }) => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["quizStats"],
    queryFn: async () => {
      const res = await api.get<QuizStatsType[]>(
        `/quiz-attempt/${courseId}/stats`,
      );
      return res.data;
    },
  });

  const badgeColors: Record<string, string> = useMemo(() => {
    return {
      "Best Quiz": "bg-green-500 text-white",
      "Worst Quiz": "bg-red-500 text-white",
      "Avg Quiz": "bg-yellow-400 text-black",
    };
  }, []);

  if (isLoading) return <p>LOADING...</p>;
  if (!stats) return <p>Not found</p>;

  return (
    <div className="bg-bg flex flex-col shadow-lg col-span-12 xl:col-span-8 space-y-2 p-6 sm:p-6 rounded-lg border border-color">
      <h3 className="text-xl sm:text-2xl font-bold">Stats</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-2">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="flex flex-col justify-between h-full space-y-2 bg-light p-3 border border-color rounded-lg shadow"
          >
            {/* Badge + Quiz Name */}
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold truncate max-w-[60%]">
                {stat.name}
              </h4>
              <span
                className={`px-2 py-1 rounded-full text-sm font-semibold ${
                  badgeColors[stat.type]
                }`}
              >
                {stat.type}
              </span>
            </div>

            {/* Score */}
            <div className="mb-2 space-x-1">
              <span className="text-muted-foreground">Score:</span>
              <span className="text-primary font-bold">{stat.score}</span>
            </div>

            {/* Total Questions & Correct Answers */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Questions:</span>
                <span className="text-primary font-semibold">
                  {stat.totalQuestions}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Correct Answers:</span>
                <span className="text-primary font-semibold">
                  {stat.totalCorrect}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

"use client";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { studentKeys } from "@/lib/query-key";
import { getStudentQuizStats } from "@/services/student";

export const QuizStats = ({ courseId }: { courseId: string }) => {
  const {
    data: stats,
    isLoading,
    isError,
  } = useQuery({
    queryKey: studentKeys.quizStats(courseId),
    queryFn: () => getStudentQuizStats(courseId),
    retry: 1,
    staleTime: 1000 * 60,
  });

  const badgeColors: Record<string, string> = useMemo(() => {
    return {
      "Best Quiz": "bg-green-500 text-white",
      "Worst Quiz": "bg-red-500 text-white",
      "Avg Quiz": "bg-yellow-400 text-black",
    };
  }, []);

  if (isLoading) return <p>LOADING...</p>;

  const displayStats =
    isError || !stats || stats.length === 0
      ? [
          {
            type: "Best Quiz",
            name: "N/A",
            score: 0,
            totalQuestions: 0,
            totalCorrect: 0,
            id: "best",
          },
          {
            type: "Worst Quiz",
            name: "N/A",
            score: 0,
            totalQuestions: 0,
            totalCorrect: 0,
            id: "worst",
          },
          {
            type: "Avg Quiz",
            name: "N/A",
            score: 0,
            totalQuestions: 0,
            totalCorrect: 0,
            id: "avg",
          },
        ]
      : stats;

  return (
    <div className="bg-bg flex flex-col shadow-lg col-span-12 xl:col-span-8 space-y-2 p-6 sm:p-6 rounded-lg border border-color">
      <h3 className="text-xl sm:text-2xl font-bold">Stats</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-2">
        {displayStats.map((stat) => (
          <div
            key={`${stat.type}-${stat.id}`}
            className={`flex flex-col justify-between h-full space-y-2 p-3 border rounded-lg shadow ${
              isError ? "bg-red-50 border-red-300" : "bg-light border-color"
            }`}
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

            {isError && (
              <p className="text-sm text-red-500 mt-2">
                Failed to fetch stats. Showing fallback data.
              </p>
            )}

            {!stats ||
              (stats.length === 0 && (
                <p className="text-sm text-red-500 mt-2">
                  Attempt some quizzes first.
                </p>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

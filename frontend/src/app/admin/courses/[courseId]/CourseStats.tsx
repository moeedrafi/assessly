"use client";

import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const stats = [
  {
    id: 1,
    title: "Best Quiz",
    name: "Linked List",
    totalQuestions: 30,
    average: "80%",
  },
  {
    id: 2,
    title: "Worst Quiz",
    name: "Sliding Window",
    totalQuestions: 30,
    average: "60%",
  },
  {
    id: 3,
    title: "Average Quiz",
    name: "Arrays",
    totalQuestions: 30,
    average: "40%",
  },
];

export const CourseStats = ({ courseId }: { courseId: string }) => {
  const { data } = useQuery({
    queryKey: ["course-quiz-stats"],
    queryFn: async () => {
      const res = await api.get(`/admin/analytics/${courseId}/stats`);
      return res.data;
    },
  });

  console.log(data);

  return (
    <div className="bg-bg flex flex-col shadow-lg col-span-12 xl:col-span-8 space-y-2 p-6 sm:p-8 rounded-lg border border-color">
      <h3 className="text-xl sm:text-2xl font-bold">Stats</h3>

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-3">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="flex flex-col justify-between h-full bg-light p-4 space-y-4 border border-color rounded-lg shadow"
            >
              <div>
                <h3 className="text-xl font-semibold">{stat.title}</h3>
                <span className="text-muted-foreground">{stat.name}</span>
              </div>

              <div className="space-y-1">
                {stat.totalQuestions && (
                  <div className="space-x-1">
                    <span className="text-muted-foreground">
                      Total Questions:
                    </span>
                    <span className="text-primary font-semibold">
                      {stat.totalQuestions}
                    </span>
                  </div>
                )}

                {stat.average && (
                  <div className="space-x-1">
                    <span className="text-muted-foreground">Average:</span>
                    <span className="text-primary font-semibold">
                      {stat.average}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

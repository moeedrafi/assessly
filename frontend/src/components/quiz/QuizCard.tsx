"use client";

import Link from "next/link";
import { QuizEntity } from "@/types/quiz";

export const QuizCard = ({
  quiz,
  isDimmed,
}: {
  quiz: QuizEntity;
  isDimmed?: boolean;
}) => {
  const startsAt = new Date(quiz.startsAt);
  const endsAt = new Date(quiz.endsAt);

  return (
    <div
      className={`flex flex-col gap-4 bg-light p-4 border border-color rounded-lg shadow ${isDimmed ? "opacity-60" : ""}`}
    >
      <div className="flex-1 space-y-2">
        <h3 className="text-lg font-semibold">{quiz.name}</h3>
        <p className="text-muted-foreground text-sm">{quiz.description}</p>
      </div>

      <div className="space-y-1 font-semibold">
        <div className="space-x-1 text-sm">
          <span className="text-muted-foreground">Total Marks: </span>
          <span className="text-secondary">{quiz.totalMarks}</span>
        </div>

        <div className="space-x-1 text-sm">
          <span className="text-muted-foreground">Passing Marks: </span>
          <span className="text-secondary">{quiz.passingMarks}</span>
        </div>

        <div className="space-x-1 text-sm">
          <span className="text-muted-foreground">Time Limit: </span>
          <span className="text-secondary">{quiz.timeLimit} minutes</span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="space-x-1 text-sm text-muted-foreground">
          <span>Started: </span>
          <span>
            {startsAt.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="space-x-1 text-sm text-muted-foreground">
          <span>Ended: </span>
          <span>
            {endsAt.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <Link
        href={`/quizzes/${quiz.id}`}
        className="w-full text-center px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-md"
      >
        View Details
      </Link>
    </div>
  );
};

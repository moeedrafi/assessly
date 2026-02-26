"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { Detail } from "./Detail";
import type { QuizDetail } from "@/types/quiz";
import { Button } from "@/components/ui/Button";
import { formattedDateTime } from "@/lib/utils";
import { Skeleton } from "@/components/Skeleton";

export const QuizDetails = () => {
  const { quizId } = useParams();
  const { data: quiz, isLoading: isQuizLoading } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: async () => {
      const res = await api.get<QuizDetail>(`/admin/quiz/${quizId}`);
      return res.data;
    },
    staleTime: Infinity,
  });

  if (isQuizLoading) return <Skeleton max={1} />;
  if (!quiz) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="text-6xl">📭</div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Quiz Not Found</h2>
          <p className="text-muted-foreground max-w-md">
            The quiz you&apos;re looking for doesn&apos;t exist or may have been
            deleted.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/quizzes"
            className="bg-primary px-6 py-2 text-white rounded-md hover:bg-primary/80 transition duration-200"
          >
            Back to Quizzes
          </Link>

          <Link
            href="/admin/quizzes/create"
            className="border border-color bg-dark text-muted-foreground px-6 py-2 rounded-md hover:bg-bg transition duration-200"
          >
            Create New Quiz
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2 text-center p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold">{quiz.name}</h1>
        <p className="text-sm text-muted-foreground">
          {quiz.course} - {quiz.teacher}
        </p>
      </div>

      <div className="space-y-4 bg-bg p-6 sm:p-8 border border-color shadow-lg rounded-lg">
        <p className="text-muted-foreground">{quiz.description}</p>

        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <Detail label="Duration" value={`${quiz.timeLimit} minutes`} />
            <Detail
              label="Publish"
              value={
                <span
                  className={`px-2 py-1 rounded-sm text-white ${!quiz.isPublished ? "bg-primary" : "bg-muted-foreground"}`}
                >
                  {!quiz.isPublished ? "Published" : "Draft"}
                </span>
              }
            />
            <Detail label="Total Marks" value={quiz.totalMarks} />
            <Detail label="Passing Marks" value={quiz.passingMarks} />
            <Detail
              label="Start Date"
              value={formattedDateTime(quiz.startsAt)}
            />
            <Detail label="End Date" value={formattedDateTime(quiz.endsAt)} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/admin/quizzes/${quizId}/edit`}
            className="bg-primary px-6 py-2 text-white rounded-md hover:bg-primary/80"
          >
            Edit Quiz
          </Link>

          <Button variant="destructive" className="px-6">
            Delete Quiz
          </Button>
        </div>
      </div>
    </>
  );
};

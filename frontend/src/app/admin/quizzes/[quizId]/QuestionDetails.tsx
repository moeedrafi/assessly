"use client";
import Link from "next/link";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/Skeleton";
import type { QuestionDetail } from "@/types/question";

export const QuestionDetails = () => {
  const { quizId } = useParams();
  const { data: questions, isLoading: isQuestionsLoading } = useQuery({
    queryKey: ["questions", quizId],
    queryFn: async () => {
      const res = await api.get<QuestionDetail[]>(`/question/${quizId}`);
      return res.data;
    },
    staleTime: Infinity,
  });

  if (isQuestionsLoading) return <Skeleton max={1} />;
  if (!questions) return null;
  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-5 border border-dashed border-color rounded-lg">
        <div className="text-5xl">📝</div>

        <div className="space-y-1">
          <h3 className="text-xl font-semibold">No Questions Added Yet</h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            This quiz doesn&apos;t have any questions. Start adding questions to
            make it ready for students.
          </p>
        </div>

        <Link
          href={`/admin/quizzes/${quizId}/questions/create`}
          className="bg-primary px-6 py-2 text-white rounded-md hover:bg-primary/80 transition"
        >
          Add First Question
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-bg p-6 sm:p-8 border border-color shadow-lg rounded-lg">
      <h2 className="text-xl sm:text-2xl font-bold">Questions</h2>

      {questions.map((question, idx) => (
        <details
          key={question.id}
          className="border border-color p-2 rounded-md"
        >
          <summary className="font-semibold">Question {idx + 1}</summary>
          <div className="space-y-2 mt-2">
            <p className="text-text text-sm pl-4">{question.text}</p>
            <ul className="list-decimal list-outside pl-8 text-sm space-y-2 text-muted-foreground mb-2">
              {question.options.map((option) => (
                <li key={option.id}>{option.text}</li>
              ))}
            </ul>
          </div>
        </details>
      ))}
    </div>
  );
};

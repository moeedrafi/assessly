"use client";
import Link from "next/link";
import { api } from "@/lib/api";
import { QuizDetail } from "@/types/quiz";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useQueries } from "@tanstack/react-query";
import { Question } from "@/types/question";

const QuizIdPage = () => {
  const { quizId } = useParams();

  const [
    { data, isLoading, error },
    { data: questions, isLoading: questionLoading, error: questionerror },
  ] = useQueries({
    queries: [
      {
        queryKey: ["quiz", quizId],
        queryFn: async () => {
          const res = await api.get<QuizDetail>(`/admin/quiz/${quizId}`);
          return res.data;
        },
        enabled: !!quizId,
        staleTime: Infinity,
      },
      {
        queryKey: ["questions", quizId],
        queryFn: async () => {
          const res = await api.get<Question[]>(`/question/${quizId}`);
          return res.data;
        },
        enabled: !!quizId,
        staleTime: Infinity,
      },
    ],
  });

  if (isLoading) return <p>LOADING....</p>;
  if (error) return <p>error</p>;
  if (!data) return <p>No data found</p>;

  if (questionLoading) return <p>LOADING....</p>;
  if (questionerror) return <p>error</p>;
  if (!questions) return <p>NO Questions</p>;

  return (
    <main>
      <section className="w-full font-lato space-y-4 px-2 py-4">
        {/* Heading */}
        <div className="space-y-2 text-center p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold">{data.name}</h1>
          <p className="text-sm text-muted-foreground">
            {data.course} - {data.teacher}
          </p>
        </div>

        <div className="space-y-4 bg-bg p-6 sm:p-8 border border-color shadow-lg rounded-lg">
          <p className="text-sm text-muted-foreground">{data.description}</p>

          <div>
            <div className="space-x-1">
              <span className="text-muted-foreground">Duration: </span>
              <span className="text-primary font-semibold">
                {data.timeLimit} minutes
              </span>
            </div>

            <div className="space-x-1">
              <span className="text-muted-foreground">Questions: </span>
              <span className="text-primary font-semibold">20</span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold">Questions</h2>

          {questions.map((question, idx) => (
            <details
              key={question.id}
              className="mb-2 border border-color p-2 rounded-md"
            >
              <summary className="font-semibold">
                Question {idx + 1}. {question.text}
              </summary>
              <ul className="list-decimal list-outside pl-8 space-y-1 text-muted-foreground mt-2">
                {question.options.map((option) => (
                  <li key={option.id}>{option.text}</li>
                ))}
              </ul>
            </details>
          ))}

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
      </section>
    </main>
  );
};

export default QuizIdPage;

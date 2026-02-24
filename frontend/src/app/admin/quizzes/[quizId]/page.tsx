"use client";
import Link from "next/link";
import { api } from "@/lib/api";
import { QuizDetail } from "@/types/quiz";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useQuery } from "@tanstack/react-query";

const QuizIdPage = () => {
  const { quizId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: async () => {
      const res = await api.get<QuizDetail>(`/admin/quiz/${quizId}`);
      return res.data;
    },
  });

  if (isLoading) return <p>LOADING....</p>;

  // TODO: fix the question UI

  if (error) return <p>error</p>;
  if (!data) return <p>No data found</p>;

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
              <span className="text-primary font-semibold">
                {data.questions.length}
              </span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold">Questions</h2>

          {data.questions.map((question) => (
            <div key={question.id} className="space-y-2 mb-6">
              <p className="font-semibold">{question.text}</p>

              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                {question.options.map((option) => (
                  <li key={option.id}>{option.text}</li>
                ))}
              </ul>
            </div>
          ))}

          {data.questions.map((question, idx) => (
            <details key={question.id} className="mb-2 border p-2 rounded-md">
              <summary className="font-semibold">
                {idx + 1}. {question.text}
              </summary>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
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

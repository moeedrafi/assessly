import { Suspense } from "react";
import { QuizDetails } from "./QuizDetails";
import { Skeleton } from "@/components/Skeleton";
import { QuestionDetails } from "./QuestionDetails";

const QuizIdPage = async ({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) => {
  const { quizId } = await params;

  return (
    <section className="w-full font-lato space-y-4 px-2 py-4">
      <QuizDetails />

      <Suspense fallback={<Skeleton max={1} />}>
        <QuestionDetails quizId={quizId} />
      </Suspense>
    </section>
  );
};

export default QuizIdPage;

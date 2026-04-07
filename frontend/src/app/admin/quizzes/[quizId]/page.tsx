import { QuizDetails } from "./QuizDetails";
import { QuestionDetails } from "./QuestionDetails";

const QuizIdPage = async ({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) => {
  const { quizId } = await params;

  return (
    <section className="w-full font-lato space-y-4 px-2 py-4">
      <QuizDetails quizId={quizId} />
      <QuestionDetails quizId={quizId} />
    </section>
  );
};

export default QuizIdPage;

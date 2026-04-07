import { QuizForm } from "@/components/forms/QuizForm";

const EditQuizPage = async ({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) => {
  const { quizId } = await params;

  return (
    <section className="w-full font-lato space-y-4 px-2 py-4">
      <h1 className="text-2xl sm:text-3xl font-bold">Edit Quiz</h1>

      <div className="space-y-2 bg-bg p-6 sm:p-8 border border-color shadow-lg rounded-lg">
        <QuizForm mode="edit" quizId={quizId} />
      </div>
    </section>
  );
};

export default EditQuizPage;

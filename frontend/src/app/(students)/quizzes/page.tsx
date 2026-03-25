import { Quizzes } from "@/components/quiz/Quizzes";

const QuizzesPage = async () => {
  return (
    <main>
      <section className="w-full font-lato space-y-4 px-2 py-4">
        {/* Heading */}
        <div className="space-y-2 text-center p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome</h1>
          <p className="text-sm text-muted-foreground">
            View Details of the courses quizzes you are enrolled in
          </p>
        </div>

        <div className="space-y-2 bg-bg p-6 sm:p-8 border border-color shadow rounded-lg">
          <h3 className="text-xl sm:text-2xl font-bold">Quiz</h3>
          <Quizzes />
        </div>
      </section>
    </main>
  );
};

export default QuizzesPage;

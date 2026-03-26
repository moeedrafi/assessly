import { QuizStats } from "./QuizStats";
import { Leaderboard } from "./Leaderboard";
import { Quizzes } from "@/components/quiz/Quizzes";

const CourseIdPage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const { courseId } = await params;

  if (!courseId) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <section className="w-full max-w-md font-lato p-6 sm:p-8">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold">error 404</h1>
            <p className="text-sm text-muted-foreground">
              This page doesn&apos;t exists. Go to Dashboard page and join a
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="w-full font-lato space-y-4 p-2">
        {/* Heading */}
        <div className="space-y-2 text-center p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Course Name</h1>
          <h2 className="text-xl text-muted-foreground">Total Students: 30</h2>
          <h3 className="text-lg text-muted-foreground">
            Your Rank: <span className="text-primary font-semibold">2nd</span>
          </h3>
        </div>

        <QuizStats courseId={courseId} />
        <Leaderboard courseId={courseId} />

        <div className="shadow-inset-lg space-y-4 p-6 sm:p-8 rounded-lg">
          <h3 className="text-xl sm:text-2xl font-bold">Quiz</h3>
          <Quizzes courseId={courseId} scope="course" />
        </div>
      </section>
    </main>
  );
};

export default CourseIdPage;

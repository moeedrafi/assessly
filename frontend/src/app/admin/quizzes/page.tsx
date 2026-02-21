import Link from "next/link";
import { UpcomingQuizzes } from "@/components/UpcomingQuizzes";
import { CompletedQuizzes } from "@/components/CompletedQuizzes";

const AdminQuizzesPage = () => {
  return (
    <main>
      <section className="w-full font-lato space-y-4 px-2 py-4">
        {/* Heading */}
        <div className="space-y-2 text-center p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome</h1>
          <p className="text-sm text-muted-foreground">
            View Details of the courses you are enrolled in
          </p>
          <Link href="/admin/quizzes/create">
            <button className="border border-primary px-4 py-2 text-primary rounded-md hover:bg-secondary hover:text-white hover:border-transparent transition">
              Create Quiz
            </button>
          </Link>
        </div>

        <div className="space-y-2 bg-bg p-6 sm:p-8 border border-color shadow rounded-lg">
          <h2 className="text-xl sm:text-2xl font-bold">Upcoming Quizzes</h2>

          <UpcomingQuizzes url="/admin/quiz/upcoming" />
        </div>

        <div className="space-y-2 bg-bg p-6 sm:p-8 border border-color shadow rounded-lg">
          <h2 className="text-xl sm:text-2xl font-bold">Completed Quizzes</h2>

          <CompletedQuizzes url="/admin/quiz/completed" />
        </div>
      </section>
    </main>
  );
};

export default AdminQuizzesPage;

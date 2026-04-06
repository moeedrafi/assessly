import { RecentQuizzes } from "./RecentQuizzes";
import { AvailableQuizzes } from "@/components/quiz/AvailableQuiz";
import { StudentCourseSnapshot } from "@/components/courses/StudentCourseSnapshot";

const DashboardPage = async () => {
  return (
    <section className="w-full font-lato space-y-4 px-2 py-4">
      {/* Heading */}
      <div className="space-y-2 text-center p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Welcome</h1>
        <p className="text-sm text-muted-foreground">
          View Details of the courses you are studying
        </p>
      </div>

      <div className="space-y-6 bg-bg p-6 sm:p-8 border border-color shadow rounded-lg">
        <h2 className="text-xl sm:text-2xl font-bold">Available Quiz</h2>

        <AvailableQuizzes />
      </div>

      <RecentQuizzes />
      <StudentCourseSnapshot />
    </section>
  );
};

export default DashboardPage;

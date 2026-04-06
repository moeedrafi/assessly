import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { DateRangeQuizzes } from "@/components/quiz/DateRangeQuizzes";

const AdminQuizzesPage = () => {
  return (
    <section className="w-full font-lato space-y-4 px-2 py-4">
      {/* Heading */}
      <div className="space-y-2 text-center p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Welcome</h1>
        <p className="text-sm text-muted-foreground">
          View Details of the courses you are enrolled in
        </p>
      </div>

      <div className="space-y-2 bg-bg p-6 sm:p-8 border border-color shadow rounded-lg">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xl sm:text-2xl font-bold">Quiz</h3>
          <Link
            href="/admin/quizzes/create"
            className="inline-flex items-center gap-2 rounded-md text-white px-4 py-2 bg-secondary hover:bg-secondary/80"
          >
            <PlusCircle />
            Create Quiz
          </Link>
        </div>

        <DateRangeQuizzes role="admin" />
      </div>
    </section>
  );
};

export default AdminQuizzesPage;

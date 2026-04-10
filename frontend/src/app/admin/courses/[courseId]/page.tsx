import Image from "next/image";
import { CourseQuizzes } from "@/components/quiz/CourseQuizzes";
import { CourseStats } from "./CourseStats";

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
    <section className="w-full font-lato space-y-4 p-2">
      {/* Heading */}
      <div className="space-y-2 text-center p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Course Name</h1>
        <h2 className="text-xl text-muted-foreground">Total Students: 30</h2>
      </div>

      <CourseStats courseId={courseId} />

      <div className="bg-bg flex flex-col shadow col-span-12 xl:col-span-4 space-y-2 p-6 sm:p-8 rounded-lg border border-color">
        <h3 className="text-xl font-bold">Leaderboard</h3>

        <div className="max-h-40 overflow-y-scroll hide-scrollbar space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 rounded-md bg-light px-3 py-2 border border-color"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-sm font-semibold text-muted-foreground">
                  {i + 1}.
                </span>

                <Image
                  src="https://images.unsplash.com/photo-1526779259212-939e64788e3c"
                  alt=""
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />

                <span className="font-medium">John Doe</span>
              </div>

              <span className="text-sm font-semibold text-primary">
                120 pts
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* QUIZ */}
      <div className="shadow-inset-lg space-y-2 p-6 sm:p-8 rounded-lg">
        <h3 className="text-xl sm:text-2xl font-bold">Quiz</h3>
        <CourseQuizzes courseId={courseId} role="admin" />
      </div>
    </section>
  );
};

export default CourseIdPage;

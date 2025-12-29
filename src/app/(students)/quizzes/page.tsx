import Link from "next/link";

const QuizzesPage = () => {
  const quizzes = 1;

  if (!quizzes) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <section className="w-full max-w-md font-lato p-6 sm:p-8">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold">Join a Course</h1>
            <p className="text-sm text-muted-foreground">
              You haven&apos;t joined any course yet. Enter the code provided by
              your teacher.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const upcomingQuizzes = 10;
  const completedQuizzes = 0;

  return (
    <main>
      <section className="w-full font-lato space-y-4">
        {/* Heading */}
        <div className="space-y-2 text-center p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome</h1>
          <p className="text-sm text-muted-foreground">
            View Details of the courses you are enrolled in
          </p>
        </div>

        <div className="space-y-2 bg-bg p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold">Upcoming Quizzes</h2>

          {upcomingQuizzes ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pb-3 overflow-y-auto hide-scrollbar max-h-64">
              <div className="bg-light p-4 space-y-4 border border-color rounded-lg shadow">
                <div>
                  <h3 className="text-lg font-semibold">Quiz Name</h3>
                  <p className="text-muted-foreground">Course Name</p>
                </div>

                {/* Time */}
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">29 Dec 2025</span> · 11:00 -
                  11:30
                </div>

                <div className="text-sm">
                  <div className="space-x-1">
                    <span className="text-muted-foreground">Duration: </span>
                    <span className="text-primary font-semibold">30m</span>
                  </div>

                  <div className="space-x-1">
                    <span className="text-muted-foreground">Questions: </span>
                    <span className="text-primary font-semibold">20</span>
                  </div>
                </div>

                <Link href="/quizzes/1">
                  <button className="w-full bg-primary px-4 py-2 text-white rounded-md hover:opacity-90 transition">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No Upcoming Quizzes</p>
          )}
        </div>

        <div className="space-y-2 bg-bg p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold">Completed Quizzes</h2>

          {completedQuizzes ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pb-3 overflow-y-auto hide-scrollbar max-h-64">
              <div className="bg-light p-4 space-y-4 border border-color rounded-lg shadow">
                <div>
                  <h3 className="text-lg font-semibold">Quiz Name</h3>
                  <p className="text-muted-foreground">Course Name</p>
                </div>

                {/* Time */}
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">29 Dec 2025</span> · 11:00 -
                  11:30
                </div>

                <div className="text-sm">
                  <div className="space-x-1">
                    <span className="text-muted-foreground">Duration: </span>
                    <span className="text-primary font-semibold">30m</span>
                  </div>

                  <div className="space-x-1">
                    <span className="text-muted-foreground">Result: </span>
                    <span className="text-primary font-semibold">20 / 30</span>
                  </div>
                </div>

                <Link href="/quizzes/1">
                  <button className="w-full bg-primary px-4 py-2 text-white rounded-md hover:opacity-90 transition">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              No Completed Quizzes
            </p>
          )}
        </div>
      </section>
    </main>
  );
};

export default QuizzesPage;

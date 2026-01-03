import Link from "next/link";

const AdminCreateQuizzesPage = () => {
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
          <form>FORM</form>
        </div>
      </section>
    </main>
  );
};

export default AdminCreateQuizzesPage;

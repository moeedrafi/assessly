import Link from "next/link";

const AdminCoursesPage = () => {
  const courses = 3;

  if (!courses) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <section className="w-full max-w-md rounded-2xl font-lato border border-color bg-bg p-6 sm:p-8 shadow-lg">
          {/* Heading */}
          <div className="space-y-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold">Join a Course</h1>
            <p className="text-sm text-muted-foreground">
              You haven&apos;t joined any course yet. Enter the code provided by
              your teacher.
            </p>
          </div>

          {/* Form */}
          <form className="mt-6 space-y-4">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="courseCode"
                className="text-sm font-medium text-text"
              >
                Course Code
              </label>
              <input
                required
                id="courseCode"
                name="courseCode"
                type="text"
                placeholder="e.g. QZ-8F4K"
                className="bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
            >
              Join Course
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="w-full font-lato space-y-4 px-2 py-4">
        {/* Heading */}
        <div className="space-y-2 text-center p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome</h1>
          <p className="text-sm text-muted-foreground">
            View Details of the courses you are enrolled in
          </p>
        </div>

        <div className="space-y-2 bg-bg p-6 sm:p-8 border border-color shadow rounded-lg">
          <h2 className="text-xl sm:text-2xl font-bold">Your Courses</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-light p-4 space-y-4 border border-color rounded-lg shadow">
              <div>
                <h3 className="text-lg font-semibold">Course Name</h3>
                <h4 className="text-muted-foreground">Instructor Name</h4>
              </div>

              <Link href="/admin/courses/1">
                <button className="w-full bg-primary px-4 py-2 text-white rounded-md hover:opacity-90 transition">
                  View Details
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminCoursesPage;

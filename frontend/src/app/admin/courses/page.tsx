import { Courses } from "@/components/Courses";

const AdminCoursesPage = () => {
  return (
    <main>
      <section className="w-full font-lato space-y-4 px-2 py-4">
        <div className="space-y-2 text-center p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome</h1>
          <p className="text-sm text-muted-foreground">
            View Details of the courses you are teaching
          </p>
        </div>

        <Courses />
      </section>
    </main>
  );
};

export default AdminCoursesPage;

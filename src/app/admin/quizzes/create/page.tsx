import { CreateQuizForm } from "@/components/forms/CreateQuizForm";

const AdminCreateQuizzesPage = () => {
  return (
    <main>
      <section className="font-lato space-y-4 px-2 py-4">
        {/* Heading */}
        <div className="space-y-2 text-center p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome</h1>
          <p className="text-sm text-muted-foreground">
            View Details of the courses you are enrolled in
          </p>
        </div>

        <div className="space-y-2 bg-bg p-6 sm:p-8 border border-color shadow rounded-lg">
          <CreateQuizForm />
        </div>
      </section>
    </main>
  );
};

export default AdminCreateQuizzesPage;

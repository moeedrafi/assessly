import { CourseForm } from "./CourseForm";

const CreateCoursesPage = () => {
  return (
    <main>
      <div className="w-full font-lato space-y-4 px-2 py-4">
        <div className="space-y-2 text-center p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Create Course</h1>
          <p className="text-sm text-muted-foreground">
            Fill details for the courses you want to teach
          </p>
        </div>

        <CourseForm />
      </div>
    </main>
  );
};

export default CreateCoursesPage;

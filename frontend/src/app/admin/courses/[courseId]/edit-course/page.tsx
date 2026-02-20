import { CourseForm } from "../../create-course/CourseForm";

const CourseIdPage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const { courseId } = await params;

  return (
    <main>
      <div className="w-full font-lato space-y-4 px-2 py-4">
        <div className="space-y-2 text-center p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Edit Course</h1>
          <p className="text-sm text-muted-foreground">
            Update details of the course you are to teaching
          </p>
        </div>

        <CourseForm mode="edit" courseId={courseId} />
      </div>
    </main>
  );
};

export default CourseIdPage;

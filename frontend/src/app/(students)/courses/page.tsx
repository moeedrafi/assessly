import { JoinCourse } from "./JoinCourse";
import { StudentCourses } from "@/components/courses/StudentCourses";

const CoursesPage = () => {
  return (
    <section className="w-full font-lato space-y-4 px-2 py-8">
      {/* Heading */}
      <div className="space-y-2 text-center p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Welcome</h1>
        <p className="text-sm text-muted-foreground">
          View Details of the courses you are teaching in
        </p>
      </div>

      <div className="space-y-2 bg-bg p-6 sm:p-8 border border-color shadow rounded-lg max-w-md">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold">Join a Course</h2>
          <p className="text-sm text-muted-foreground">
            Enter the course code provided by your instructor.
          </p>
        </div>

        <JoinCourse />
      </div>

      <div className="space-y-2 bg-bg p-6 sm:p-8 border border-color shadow rounded-lg">
        <h2 className="text-xl sm:text-2xl font-bold">Your Courses</h2>
        <StudentCourses />
      </div>
    </section>
  );
};

export default CoursesPage;

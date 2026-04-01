"use client";
import { useAppForm } from "@/hooks/form";
import { QuestionForm } from "./QuestionForm";
import { useCourses } from "@/hooks/useCourses";
import { TeachingCourse } from "@/types/course";
import { createQuizFormOptions } from "@/lib/shared-form";

export const QuizForm = () => {
  const { data: courses } = useCourses<TeachingCourse[]>("/admin/courses/all");
  const form = useAppForm({ ...createQuizFormOptions });

  return (
    <form
      className="space-y-6"
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await form.handleSubmit();
      }}
    >
      {/* NAME + COURS */}
      <div className="flex flex-col md:flex-row gap-3">
        <form.AppField name="name">
          {(field) => (
            <field.TextField
              required
              label="Name"
              placeholder="Enter quiz name"
            />
          )}
        </form.AppField>

        <form.AppField name="courseId">
          {(field) => (
            <div className="w-full flex flex-col gap-1">
              <field.SelectField
                label="Course"
                required
                placeholder="Choose option"
                options={(courses ?? []).map((course) => ({
                  label: course.name,
                  value: course.id,
                }))}
              />
            </div>
          )}
        </form.AppField>
      </div>

      {/* TIME LIMIT + START AND END TIME */}
      <div className="flex flex-col md:flex-row gap-3">
        <form.AppField name="timeLimit">
          {(field) => (
            <field.NumberField
              required
              label="Time Limit"
              placeholder="Enter time limit"
            />
          )}
        </form.AppField>

        <form.AppField name="startsAt">
          {(field) => (
            <field.DateTimeField required label="Start Date & Time" />
          )}
        </form.AppField>

        <form.AppField name="endsAt">
          {(field) => <field.DateTimeField required label="End Date & Time" />}
        </form.AppField>
      </div>

      {/* TOTAL MARKS + PASSING MARKS */}
      <div className="flex flex-col md:flex-row gap-3">
        <form.AppField name="totalMarks">
          {(field) => (
            <field.NumberField
              required
              label="Total Marks"
              placeholder="Enter Total Marks"
            />
          )}
        </form.AppField>

        <form.AppField name="passingMarks">
          {(field) => (
            <field.NumberField
              required
              label="Passing Marks"
              placeholder="Enter passing marks"
            />
          )}
        </form.AppField>
      </div>

      <form.AppField name="description">
        {(field) => (
          <field.TextArea
            required
            label="Quiz Description"
            placeholder="Enter quiz description"
          />
        )}
      </form.AppField>

      <QuestionForm form={form} />

      <div className="flex items-center gap-3">
        <form.AppForm>
          <form.SubscribeButton
            type="submit"
            label="Create Quiz"
            className="px-8 py-3"
            onClick={() => form.setFieldValue("isPublished", true)}
          />
        </form.AppForm>

        <form.AppForm>
          <form.SubscribeButton
            type="submit"
            variant="ghost"
            label="Save as Draft"
            className="px-8 py-3"
            onClick={() => form.setFieldValue("isPublished", false)}
          />
        </form.AppForm>
      </div>
    </form>
  );
};

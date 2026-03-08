"use client";
import { useAppForm } from "@/hooks/form";
import { useCourses } from "@/hooks/useCourses";
import { TeachingCourse } from "@/types/course";
import { createQuizFormOptions } from "@/lib/shared-form";
import { QuestionForm } from "./forms/QuestionForm";

export const QuizForm = () => {
  const { data: courses } = useCourses<TeachingCourse[]>("/admin/courses");
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

        <form.Field name="startsAt">
          {(field) => (
            <div className="w-full flex flex-col gap-1">
              <label htmlFor={field.name}>Start Date & Time</label>
              <input
                id={field.name}
                name={field.name}
                type="datetime-local"
                value={field.state.value}
                aria-invalid={!field.state.meta.isValid}
                onChange={(e) => field.handleChange(e.target.value)}
                className="bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none"
              />
              {field.state.meta.isTouched && !field.state.meta.isValid && (
                <em role="alert" className="text-sm text-red-500">
                  {field.state.meta.errors
                    .map((err) => err?.message)
                    .join(", ")}
                </em>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="endsAt">
          {(field) => (
            <div className="w-full flex flex-col gap-1">
              <label htmlFor={field.name}>End Date & Time</label>
              <input
                id={field.name}
                name={field.name}
                type="datetime-local"
                value={field.state.value}
                aria-invalid={!field.state.meta.isValid}
                onChange={(e) => field.handleChange(e.target.value)}
                className="bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none"
              />
              {field.state.meta.isTouched && !field.state.meta.isValid && (
                <em role="alert" className="text-sm text-red-500">
                  {field.state.meta.errors
                    .map((err) => err?.message)
                    .join(", ")}
                </em>
              )}
            </div>
          )}
        </form.Field>
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

      {/* DESC */}
      <form.AppField name="description">
        {(field) => (
          <field.TextArea
            label="Quiz Description"
            placeholder="Enter quiz description"
          />
        )}
      </form.AppField>

      {/* QUESTIONS */}
      <QuestionForm form={form} />

      <div className="flex items-center gap-3">
        <form.AppForm>
          <form.SubscribeButton
            type="submit"
            label="Create Quiz"
            className="px-8 py-3"
          />
        </form.AppForm>

        <form.AppForm>
          <form.SubscribeButton
            type="submit"
            variant="ghost"
            label="Save as Draft"
            className="px-8 py-3"
          />
        </form.AppForm>
      </div>
    </form>
  );
};

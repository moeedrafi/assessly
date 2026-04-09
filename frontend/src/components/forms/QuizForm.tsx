"use client";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/error";
import { useAppForm } from "@/hooks/form";
import { QuestionForm } from "./QuestionForm";
import { useCourses } from "@/hooks/useCourses";
import { useQuery } from "@tanstack/react-query";
import type { TeachingCourse } from "@/types/course";
import { mapQuizToFormValues } from "@/lib/shared-form";
import { CreateQuizFormData, createQuizSchema } from "@/schemas/quiz.schemas";

export const QuizForm = ({
  mode,
  quizId,
}: {
  mode: "create" | "edit";
  quizId?: string;
}) => {
  const { data: courses } = useCourses<TeachingCourse[]>("/admin/courses/all");
  const { data, isLoading } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: async () => {
      const res = await api.get<CreateQuizFormData>(
        `/admin/quiz/${quizId}/form`,
      );
      return res.data;
    },
    enabled: !!quizId,
  });

  const form = useAppForm({
    defaultValues: mapQuizToFormValues(data),
    validators: { onChange: createQuizSchema },
    onSubmit: async ({ value }: { value: CreateQuizFormData }) => {
      const validatedData = createQuizSchema.safeParse(value);
      if (!validatedData.success) {
        toast.error("Please fix errors in the form");
        return;
      }

      try {
        if (mode === "create") {
          const res = await api.post<void, CreateQuizFormData>(
            "/admin/quiz",
            validatedData.data,
          );
          toast.success(res.message);
        } else {
          const res = await api.patch<void, CreateQuizFormData>(
            `/admin/quiz/${quizId}/form`,
            validatedData.data,
          );
          toast.success(res.message);
        }
      } catch (error) {
        if (error instanceof ApiError) {
          toast.error(error.message);
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong");
        }
      }
    },
  });

  if (isLoading) {
    return <p>LOADING</p>;
  }

  if (!data) {
    return (
      <div>
        <p>Not found quiz</p>
        <p>Go back to quizzes page</p>
      </div>
    );
  }

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
            label={mode === "create" ? "Create Quiz" : "Update Quiz"}
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

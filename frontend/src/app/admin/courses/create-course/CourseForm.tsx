"use client";
import Link from "next/link";
import { api } from "@/lib/api";
import { useEffect } from "react";
import { ApiError } from "@/lib/error";
import { toast } from "react-hot-toast";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/Button";
import { useQuery } from "@tanstack/react-query";
import { CourseFormData, courseSchema } from "@/schemas/course.schemas";

const defaultFormValues: CourseFormData = {
  name: "",
  description: "",
  allowStudentJoin: true,
  isActive: true,
};

export const CourseForm = ({
  courseId,
  mode = "create",
}: {
  mode: "create" | "edit";
  courseId?: string;
}) => {
  const form = useForm({
    defaultValues: defaultFormValues,
    validators: { onBlur: courseSchema },
    onSubmit: async ({ value }) => {
      const validatedData = courseSchema.safeParse(value);
      if (!validatedData.success) {
        toast.error("Please fix errors in the form");
        return;
      }

      try {
        let res;
        if (mode === "create") {
          res = await api.post<void, CourseFormData>(
            "/admin/courses",
            validatedData.data,
          );
        } else {
          res = await api.patch<void, CourseFormData>(
            `/admin/courses/${courseId}`,
            validatedData.data,
          );
        }

        toast.success(res.message);
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

  const { data, isLoading, error } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => api.get<CourseFormData>(`/admin/courses/${courseId}`),
    staleTime: Infinity,
    enabled: !!courseId,
  });

  useEffect(() => {
    if (data?.data) {
      form.reset(data.data);
    }
  }, [data?.data]);

  if (isLoading) return <p>Loading...</p>;

  if (error) {
    return (
      <div>
        <p>Not found</p>
        <Link href="/admin/courses">Go back to courses</Link>
      </div>
    );
  }

  return (
    <form
      className="space-y-6 bg-bg p-6 sm:p-8 border border-color shadow rounded-lg"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <>
            {/* Name */}
            <form.Field name="name">
              {(field) => (
                <div className="flex flex-col gap-1">
                  <label htmlFor={field.name}>Name</label>
                  <input
                    id={field.name}
                    name={field.name}
                    disabled={isSubmitting}
                    value={field.state.value}
                    placeholder="Enter course name"
                    onBlur={field.handleBlur}
                    aria-invalid={!field.state.meta.isValid}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:focus-visible:ring-0"
                  />
                  {field.state.meta.isTouched && !field.state.meta.isValid && (
                    <em role="alert" className="text-xs text-red-500">
                      {field.state.meta.errors
                        .map((err) => err?.message)
                        .join(", ")}
                    </em>
                  )}
                </div>
              )}
            </form.Field>

            {/* Desc */}
            <form.Field name="description">
              {(field) => (
                <div className="flex flex-col gap-1">
                  <label htmlFor={field.name}>Description</label>
                  <textarea
                    id={field.name}
                    name={field.name}
                    disabled={isSubmitting}
                    value={field.state.value}
                    placeholder="Enter course description"
                    aria-invalid={!field.state.meta.isValid}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:focus-visible:ring-0"
                  />
                  {field.state.meta.isTouched && !field.state.meta.isValid && (
                    <em role="alert" className="text-xs text-red-500">
                      {field.state.meta.errors
                        .map((err) => err?.message)
                        .join(", ")}
                    </em>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="allowStudentJoin">
              {(field) => (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={field.name}
                    name={field.name}
                    disabled={isSubmitting}
                    checked={field.state.value}
                    onChange={() =>
                      form.setFieldValue("allowStudentJoin", !field.state.value)
                    }
                    aria-invalid={!field.state.meta.isValid}
                    className="bg-light w-4 h-4"
                  />
                  <label htmlFor={field.name}>
                    Allow Students to Join Course
                  </label>
                </div>
              )}
            </form.Field>

            {/* BUTTONS */}
            <div className="flex items-center gap-2">
              <Button
                type="submit"
                disabled={!canSubmit}
                className="px-8 py-3 rounded-lg"
                onClick={() => form.setFieldValue("isActive", true)}
              >
                {isSubmitting ? "Submitting..." : "Create Quiz"}
              </Button>

              <Button
                type="submit"
                variant="ghost"
                disabled={!canSubmit}
                className="px-8 py-3 rounded-lg"
                onClick={() => form.setFieldValue("isActive", false)}
              >
                {isSubmitting ? "Submitting..." : "Save as Draft"}
              </Button>
            </div>
          </>
        )}
      </form.Subscribe>
    </form>
  );
};

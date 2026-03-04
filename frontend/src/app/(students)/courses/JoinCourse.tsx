"use client";

import { api } from "@/lib/api";
import { toast } from "react-hot-toast";
import { ApiError } from "@/lib/error";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/Button";
import { JoinCourseFormData, joinCourseSchema } from "@/schemas/course.schemas";

const initialState: JoinCourseFormData = {
  code: "",
};

export const JoinCourse = () => {
  const form = useForm({
    defaultValues: initialState,
    validators: { onBlur: joinCourseSchema },
    onSubmit: async ({ value }) => {
      const validatedData = joinCourseSchema.safeParse(value);
      if (!validatedData.success) {
        toast.error("Please fix errors in the form");
        return;
      }

      try {
        const res = await api.post<void, JoinCourseFormData>(
          "/courses/join",
          validatedData.data,
        );
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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <>
            <form.Field name="code">
              {(field) => (
                <div className="space-y-1">
                  <label htmlFor={field.name} className="text-sm font-medium">
                    Course Code
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    disabled={isSubmitting}
                    value={field.state.value}
                    placeholder="ABC101XD"
                    aria-invalid={!field.state.meta.isValid}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(e.target.value.toUpperCase())
                    }
                    className={`w-full px-4 py-2.5 rounded-lg bg-bg border focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                      field.state.meta.isTouched && !field.state.meta.isValid
                        ? "border-red-500 focus:ring-red-500"
                        : "border-color focus:ring-primary"
                    }
                    `}
                  />
                  {field.state.meta.isTouched && !field.state.meta.isValid && (
                    <p className="text-sm text-red-500">
                      {field.state.meta.errors
                        .map((err) => err?.message)
                        .join(", ")}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <Button
              type="submit"
              disabled={!canSubmit}
              className="w-full py-2.5 text-sm font-medium"
            >
              {isSubmitting ? "Joining..." : "Join Course"}
            </Button>
          </>
        )}
      </form.Subscribe>
    </form>
  );
};

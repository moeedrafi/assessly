"use client";
import { toast } from "react-hot-toast";
import { useForm } from "@tanstack/react-form";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { ApiError } from "@/lib/error";
import {
  resetPasswordSchema,
  ResetPasswordFormData,
} from "@/schemas/auth.schemas";

const initialState: ResetPasswordFormData = {
  password: "",
  confirmPassword: "",
};

export const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm({
    defaultValues: initialState,
    validators: { onBlur: resetPasswordSchema },
    onSubmit: async ({ value }) => {
      const validatedData = resetPasswordSchema.safeParse(value);
      if (!validatedData.success) {
        toast.error("Please fix errors in the form");
        return;
      }

      try {
        const res = await api.post<void, ResetPasswordFormData>(
          `/auth/reset-password?token=${token}`,
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
      className="space-y-6"
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
            <form.Field name="password">
              {(field) => (
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={field.name}
                    className="text-text text-base leading-[1.6em]"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    placeholder="******"
                    disabled={isSubmitting}
                    aria-invalid={!field.state.meta.isValid}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none disabled:opacity-70 disabled:cursor-not-allowed disabled:ring-0 disabled:focus-visible:ring-0"
                  />
                  {field.state.meta.isTouched && !field.state.meta.isValid && (
                    <em role="alert" className="text-red-500">
                      {field.state.meta.errors
                        .map((err) => err?.message)
                        .join(", ")}
                    </em>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="confirmPassword">
              {(field) => (
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={field.name}
                    className="text-text text-base leading-[1.6em]"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    placeholder="******"
                    disabled={isSubmitting}
                    aria-invalid={!field.state.meta.isValid}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none disabled:opacity-70 disabled:cursor-not-allowed disabled:ring-0 disabled:focus-visible:ring-0"
                  />
                  {field.state.meta.isTouched && !field.state.meta.isValid && (
                    <em role="alert" className="text-red-500">
                      {field.state.meta.errors
                        .map((err) => err?.message)
                        .join(", ")}
                    </em>
                  )}
                </div>
              )}
            </form.Field>

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-5 w-full bg-primary p-2 text-white rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {isSubmitting ? "Submitting..." : "Reset Password"}
            </button>
          </>
        )}
      </form.Subscribe>
    </form>
  );
};

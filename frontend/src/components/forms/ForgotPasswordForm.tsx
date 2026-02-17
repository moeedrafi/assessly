"use client";
import { toast } from "react-hot-toast";
import { useForm } from "@tanstack/react-form";
import { api } from "@/lib/api";
import { ApiError } from "@/lib/error";
import {
  ForgotPasswordFormData,
  forgotPasswordSchema,
} from "@/schemas/auth.schemas";

const initialState: ForgotPasswordFormData = {
  email: "",
};

export const ForgotPasswordForm = () => {
  const form = useForm({
    defaultValues: initialState,
    validators: { onBlur: forgotPasswordSchema },
    onSubmit: async ({ value }) => {
      const validatedData = forgotPasswordSchema.safeParse(value);
      if (!validatedData.success) {
        toast.error("Please fix errors in the form");
        return;
      }

      try {
        const res = await api.post<void, ForgotPasswordFormData>(
          "/auth/forgot-password",
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
            <form.Field name="email">
              {(field) => (
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={field.name}
                    className="text-text text-base leading-[1.6em]"
                  >
                    Email
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    disabled={isSubmitting}
                    value={field.state.value}
                    placeholder="john.doe@gmail.com"
                    aria-invalid={!field.state.meta.isValid}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:ring-0 disabled:focus-visible:ring-0"
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
              {isSubmitting ? "Sending..." : "Send email"}
            </button>
          </>
        )}
      </form.Subscribe>
    </form>
  );
};

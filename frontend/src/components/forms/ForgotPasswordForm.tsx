"use client";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "@tanstack/react-form";
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
        const res = await fetch("http://localhost:8000/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(validatedData.data),
        });

        if (!res.ok) {
          toast.error("Invalid email");
          return;
        }

        const response = await res.json();

        toast.success(response.message);
      } catch (error) {
        toast.error("An unexpected error occured");
      }
    },
  });

  return (
    <section
      aria-labelledby="forgot-password-heading"
      className="px-2 h-screen flex items-center justify-center"
    >
      <div className="bg-bg p-6 w-full max-w-100 rounded-lg font-lato space-y-4 shadow-lg border border-color">
        <h1 className="text-xl sm:text-3xl md:text-4xl leading-[1.2em] font-bold text-center">
          Forgot Password
        </h1>

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
                      {field.state.meta.isTouched &&
                        !field.state.meta.isValid && (
                          <em role="alert" className="text-red-500">
                            {field.state.meta.errors.join(", ")}
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
      </div>

      <Toaster />
    </section>
  );
};

"use client";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useForm } from "@tanstack/react-form";
import { LoginFormData, loginSchema } from "@/schemas/auth.schemas";

const initialState: LoginFormData = {
  email: "",
  password: "",
};

export const LoginForm = () => {
  const form = useForm({
    defaultValues: initialState,
    validators: { onBlur: loginSchema },
    onSubmit: async ({ value }) => {
      const validatedData = loginSchema.safeParse(value);
      if (!validatedData.success) {
        toast.error("Please fix errors in the form");
        return;
      }

      try {
        const res = await fetch("http://localhost:8000/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(validatedData.data),
        });

        if (!res.ok) {
          toast.error("Invalid email or password");
          return;
        }

        toast.success("Signed in successfully");
      } catch (error) {
        toast.error("An unexpected error occured");
      }
    },
  });

  return (
    <>
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
                      className="bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:focus-visible:ring-0"
                    />
                    {field.state.meta.isTouched &&
                      !field.state.meta.isValid && (
                        <em role="alert" className="text-red-500">
                          {field.state.meta.errors
                            .map((err) => err?.message)
                            .join(", ")}
                        </em>
                      )}
                  </div>
                )}
              </form.Field>

              <form.Field name="password">
                {(field) => (
                  <div className="space-y-3">
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
                        className="bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none disabled:opacity-70 disabled:cursor-not-allowed disabled:focus-visible:ring-0"
                      />
                      {field.state.meta.isTouched &&
                        !field.state.meta.isValid && (
                          <em role="alert" className="text-red-500">
                            {field.state.meta.errors
                              .map((err) => err?.message)
                              .join(", ")}
                          </em>
                        )}
                    </div>

                    <Link
                      href="/forgot-password"
                      className="text-sm text-secondary"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                )}
              </form.Field>

              <button
                type="submit"
                disabled={!canSubmit}
                className="mt-5 w-full bg-primary p-2 text-white rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </>
          )}
        </form.Subscribe>
      </form>

      <Link
        href="/register"
        className="w-full flex items-center justify-center text-sm text-secondary underline underline-offset-2"
      >
        Don&apos;t have an account?
      </Link>
    </>
  );
};

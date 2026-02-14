"use client";
import Link from "next/link";
import { useActionState } from "react";
import { register } from "@/lib/action";
import { RegisterFormData } from "@/schemas/auth.schemas";
import type { ActionResponse } from "@/types/action";

const initialState: ActionResponse<RegisterFormData> = {
  message: "",
  success: false,
};

export const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(register, initialState);

  // TODO: NOTIFICATION

  return (
    <section
      aria-labelledby="register-heading"
      className="h-screen px-2 flex items-center justify-center"
    >
      <div className="bg-bg p-6 w-full max-w-100 rounded-lg font-lato space-y-4 shadow-lg border border-color">
        <h1 className="text-xl sm:text-3xl md:text-4xl leading-[1.2em] font-bold text-center">
          Register
        </h1>

        <form className="space-y-6" action={formAction}>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="name"
              className="text-text text-base leading-[1.6em]"
            >
              Name
            </label>
            <input
              required
              id="name"
              name="name"
              disabled={isPending}
              placeholder="John Doe"
              className="bg-light px-3 py-2 rounded-lg ring-1 ring-color outline-none focus-visible:ring-2"
            />
            {state.errors?.name?.[0] && (
              <p className="text-sm text-red-500">{state.errors.name[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-text text-base leading-[1.6em]"
            >
              Email
            </label>
            <input
              required
              id="email"
              type="email"
              name="email"
              disabled={isPending}
              placeholder="john.doe@gmail.com"
              className="bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none"
            />
            {state.errors?.email?.[0] && (
              <p className="text-sm text-red-500">{state.errors.email[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="text-text text-base leading-[1.6em]"
            >
              Password
            </label>
            <input
              required
              id="password"
              type="password"
              name="password"
              disabled={isPending}
              placeholder="******"
              className="bg-light px-3 py-2 rounded-lg ring-1 ring-color outline-none focus-visible:ring-2"
            />
            {state.errors?.password?.[0] && (
              <p className="text-sm text-red-500">{state.errors.password[0]}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-5 w-full bg-primary p-2 text-white rounded-lg hover:opacity-80 disabled:opacity-90 disabled:cursor-not-allowed transition-opacity"
          >
            Create an Account
          </button>
        </form>

        <Link
          href="/login"
          className="w-full flex items-center justify-center text-sm text-secondary underline underline-offset-2"
        >
          Already have an account?
        </Link>
      </div>
    </section>
  );
};

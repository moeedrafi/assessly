import Link from "next/link";

export const LoginForm = () => {
  return (
    <section
      aria-labelledby="login-heading"
      className="h-screen px-2 flex items-center justify-center"
    >
      <div className="bg-bg p-6 w-full max-w-100 rounded-lg font-lato space-y-4 shadow-lg border border-color">
        <h1 className="text-[3rem] leading-[1.2em] font-bold text-center">
          Login
        </h1>

        <form className="space-y-6">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-text text-base leading-[1.6em]"
            >
              email
            </label>
            <input
              required
              id="email"
              type="email"
              name="email"
              placeholder="john.doe@gmail.com"
              className="bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none"
            />
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
              placeholder="******"
              className="bg-light px-3 py-2 rounded-lg ring-1 ring-color outline-none focus-visible:ring-2"
            />

            <Link
              href="/forgot-password"
              className="w-max mt-2 text-secondary text-sm self-end"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="mt-5 w-full bg-primary p-2 text-white rounded-lg hover:opacity-80 disabled:opacity-90 disabled:cursor-not-allowed transition-opacity"
          >
            Login
          </button>
        </form>

        <Link
          href="/register"
          className="w-full flex items-center justify-center text-sm text-secondary underline underline-offset-2"
        >
          Don&apos;t have an account?
        </Link>
      </div>
    </section>
  );
};

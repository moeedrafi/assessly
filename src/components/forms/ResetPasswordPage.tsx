export const ResetPasswordForm = () => {
  return (
    <section
      aria-labelledby="reset-password-heading"
      className="px-2 h-screen flex items-center justify-center"
    >
      <div className="bg-bg p-6 w-full max-w-100 rounded-lg font-lato space-y-4 shadow-lg border border-color">
        <h1 className="text-xl sm:text-3xl md:text-4xl leading-[1.2em] font-bold text-center">
          Reset Password
        </h1>

        <form className="space-y-6">
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
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="confirmPassword"
              className="text-text text-base leading-[1.6em]"
            >
              Confirm Password
            </label>
            <input
              required
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="******"
              className="bg-light px-3 py-2 rounded-lg ring-1 ring-color outline-none focus-visible:ring-2"
            />
          </div>

          <button
            type="submit"
            className="mt-5 w-full bg-primary p-2 text-white rounded-lg hover:opacity-80 disabled:opacity-90 disabled:cursor-not-allowed transition-opacity"
          >
            Reset Password
          </button>
        </form>
      </div>
    </section>
  );
};

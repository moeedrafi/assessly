export const ForgotPasswordForm = () => {
  return (
    <section
      aria-labelledby="forgot-password-heading"
      className="px-2 h-screen flex items-center justify-center"
    >
      <div className="bg-bg p-6 w-full max-w-100 rounded-lg font-lato space-y-4 shadow-lg border border-color">
        <h1 className="text-xl sm:text-3xl md:text-4xl leading-[1.2em] font-bold text-center">
          Forgot Password
        </h1>

        <form>
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
              name="email"
              type="email"
              placeholder="john.doe@gmail.com"
              className="bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none"
            />
          </div>

          <button
            type="submit"
            className="mt-5 w-full bg-primary p-2 text-white rounded-lg hover:opacity-80 disabled:opacity-90 disabled:cursor-not-allowed transition-opacity"
          >
            Send Mail
          </button>
        </form>
      </div>
    </section>
  );
};

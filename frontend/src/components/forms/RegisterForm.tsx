"use client";
import Link from "next/link";
import { useState } from "react";

export const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password, email }),
      });

      const data = await response.json();
      console.log("Success:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <section
      aria-labelledby="register-heading"
      className="h-screen px-2 flex items-center justify-center"
    >
      <div className="bg-bg p-6 w-full max-w-100 rounded-lg font-lato space-y-4 shadow-lg border border-color">
        <h1 className="text-xl sm:text-3xl md:text-4xl leading-[1.2em] font-bold text-center">
          Register
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
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
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="bg-light px-3 py-2 rounded-lg ring-1 ring-color outline-none focus-visible:ring-2"
            />
          </div>

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
              onChange={(e) => setemail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              className="bg-light px-3 py-2 rounded-lg ring-1 ring-color outline-none focus-visible:ring-2"
            />
          </div>

          <button
            type="submit"
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

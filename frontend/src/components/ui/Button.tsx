"use client";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

export const Button = ({
  variant = "primary",
  children,
  className,
  icon,
  ...props
}: ButtonProps) => {
  const variantClasses = {
    primary: "bg-primary hover:bg-primary/80",
    secondary: "bg-secondary hover:bg-secondary/80",
    ghost: "border border-secondary text-secondary hover:bg-secondary/5",
  }[variant];

  return (
    <button
      {...props}
      className={twMerge(
        "flex items-center justify-center gap-2 text-white dark:text-black py-2 px-4 whitespace-nowrap rounded-md transition duration-200 disabled:opacity-75 disabled:cursor-not-allowed",
        variantClasses,
        className,
      )}
    >
      {icon}
      {children}
    </button>
  );
};

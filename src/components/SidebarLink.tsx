"use client";

import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";

export const SidebarLink = ({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li>
      <Link
        href={href}
        className={twMerge(
          "flex items-center gap-3 rounded-lg p-4 text-sm font-lato font-medium transition-colors",
          isActive
            ? "bg-light text-text ring-1 ring-primary"
            : "text-muted-foreground hover:text-text hover:bg-light border border-transparent hover:border-color",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
        )}
      >
        <span className="h-5 w-5">{icon}</span>
        <span>{label}</span>
      </Link>
    </li>
  );
};

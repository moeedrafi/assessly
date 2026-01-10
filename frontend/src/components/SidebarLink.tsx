"use client";

import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";
import {
  CircleQuestionMark,
  LayoutDashboard,
  TextSelectionIcon,
} from "lucide-react";

const iconMap = {
  dashboard: LayoutDashboard,
  quiz: CircleQuestionMark,
  courses: TextSelectionIcon,
};

export const SidebarLink = ({
  href,
  icon,
  label,
}: {
  href: string;
  icon: keyof typeof iconMap;
  label: string;
}) => {
  const Icon = iconMap[icon];
  const pathname = usePathname();

  const isActive = pathname === href || pathname.startsWith(`${href}/`);

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
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </Link>
    </li>
  );
};

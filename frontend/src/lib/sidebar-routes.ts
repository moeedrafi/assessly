import { UserRole } from "@/types/user";

export type SidebarRoute = {
  id: number;
  path: string;
  label: string;
  icon: "dashboard" | "quiz" | "courses";
  roles: UserRole[];
};

export const SIDEBAR_ROUTES: SidebarRoute[] = [
  {
    id: 1,
    path: "dashboard",
    label: "Dashboard",
    icon: "dashboard",
    roles: [UserRole.ADMIN, UserRole.USER],
  },
  {
    id: 2,
    path: "quizzes",
    label: "Quizzes",
    icon: "quiz",
    roles: [UserRole.ADMIN, UserRole.USER],
  },
  {
    id: 3,
    path: "courses",
    label: "Courses",
    icon: "courses",
    roles: [UserRole.ADMIN, UserRole.USER],
  },
];

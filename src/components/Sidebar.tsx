import {
  History,
  LayoutDashboard,
  TestTube,
  TextSelectionIcon,
} from "lucide-react";
import { SidebarLink } from "./SidebarLink";

export const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col border-r border-color min-h-screen bg-bg py-6 px-4">
      <div className="p-6">
        <div className="text-4xl text-center font-bold uppercase leading-[1em] tracking-wide">
          Assesly
        </div>
      </div>

      {/* LINKS */}
      <nav className="flex-1">
        <ul className="space-y-3">
          <SidebarLink
            href="/dashboard"
            icon={<LayoutDashboard />}
            label="Dashboard"
          />
          <SidebarLink href="/quizzes" icon={<TestTube />} label="Quizzes" />
          <SidebarLink
            href="/courses"
            icon={<TextSelectionIcon />}
            label="Courses"
          />
          <SidebarLink href="/history" icon={<History />} label="History" />
        </ul>
      </nav>

      <button className="w-full self-center bg-light p-2 border border-color shadow rounded-md hover:-translate-y-0.5 transition-transform">
        Sign Out
      </button>
    </aside>
  );
};

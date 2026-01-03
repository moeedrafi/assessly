import { SidebarRoute, UserRole } from "@/lib/sidebar-routes";
import { SidebarLink } from "./SidebarLink";

export const Sidebar = ({
  basePath,
  routes,
  role,
}: {
  basePath: string;
  routes: SidebarRoute[];
  role: UserRole;
}) => {
  const filteredRoutes = routes.filter((route) => route.roles.includes(role));

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
          {filteredRoutes.map((route) => {
            const href = `${basePath}/${route.path}`;

            return (
              <SidebarLink
                key={route.id}
                href={href}
                icon={route.icon}
                label={route.label}
              />
            );
          })}
        </ul>
      </nav>

      <button className="w-full self-center bg-light p-2 border border-color shadow rounded-md hover:-translate-y-0.5 transition-transform">
        Sign Out
      </button>
    </aside>
  );
};

import { NavLink } from "react-router-dom";
import { LayoutDashboard, FolderKanban, PlaySquare, Server, Settings } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "./Logo";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Projects", path: "/project/1", icon: FolderKanban },
  { name: "Test Runs", path: "/run/1", icon: PlaySquare },
  { name: "Environments", path: "/environments", icon: Server },
  { name: "Settings", path: "/settings", icon: Settings },
];

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen border-r border-border bg-secondary flex flex-col shrink-0">
      <div className="p-6 border-b border-border">
        <Logo />
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 relative group ${
                isActive ? "text-accent" : "text-secondary hover:text-primary hover:bg-tertiary"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 ${isActive ? "text-accent" : "group-hover:text-primary"}`} />
                <span className="font-medium text-sm">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-sidebar-pill"
                    className="absolute inset-0 bg-accent/10 rounded-md -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="bg-tertiary rounded-lg p-4 text-sm border border-border">
          <p className="text-secondary mb-2">Plan: <span className="text-primary font-semibold">Pro</span></p>
          <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
            <div className="bg-accent h-full w-[82%]" />
          </div>
          <p className="text-xs text-secondary mt-2">82k / 100k snapshots used</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

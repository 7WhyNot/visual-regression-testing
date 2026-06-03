import { NavLink } from "react-router-dom";
import { LayoutDashboard, Settings } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "./Logo";
import { useTranslation } from "react-i18next";

const Sidebar = () => {
  const { t } = useTranslation();

  const navItems = [
    { name: t("nav.projects"), path: "/", icon: LayoutDashboard },
    { name: t("nav.settings"), path: "/settings", icon: Settings }
  ];

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
    </aside>
  );
};

export default Sidebar;

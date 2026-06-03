import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LayoutDashboard, Settings, FileText } from "lucide-react";
import { motion } from "framer-motion";

const Sidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    { id: "projects", path: "/", icon: LayoutDashboard, label: t("nav.projects") },
    { id: "reports", path: "/reports", icon: FileText, label: t("nav.reports") },
    { id: "settings", path: "/settings", icon: Settings, label: t("nav.settings") }
  ];

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-200 bg-gray-50/50 transition-colors dark:border-gray-800 dark:bg-gray-900/50">
      <div className="flex h-16 items-center px-6">
        <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-xl font-black tracking-tight text-transparent">
          VRT Platform
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-600 hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-100"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-indigo-50 shadow-[0_0_15px_rgba(99,102,241,0.5)] dark:bg-indigo-500/10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <div className="relative z-10 flex items-center gap-3">
                <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400 }}>
                  <Icon className="h-5 w-5" />
                </motion.div>
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;

import { Camera, LayoutGrid, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navigationItems = [
  {
    label: "Проекты",
    path: "/",
    icon: LayoutGrid
  },
  {
    label: "Настройки",
    path: "/settings",
    icon: Settings
  }
];

const Sidebar = () => {
  const location = useLocation();

  const isActivePath = (path) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname.startsWith("/project") || location.pathname.startsWith("/run");
    }

    return location.pathname === path;
  };

  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col overflow-hidden bg-gray-900 text-gray-100 shadow-2xl">
      <div className="flex h-20 items-center border-b border-white/10 px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-400/30">
            <Camera className="h-6 w-6" />
          </div>
          <span className="bg-gradient-to-r from-indigo-300 via-sky-200 to-cyan-300 bg-clip-text text-xl font-bold text-transparent">
            VisionQA
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActivePath(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950/30"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon
                className={`h-5 w-5 transition-transform duration-200 ${
                  isActive ? "scale-105" : "group-hover:translate-x-1 group-hover:scale-105"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;

import { useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { ChevronRight, Sun, Moon, Terminal, Bell } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const { theme, setSpecificTheme } = useTheme();
  const location = useLocation();
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  // Generate breadcrumbs from path
  const paths = location.pathname.split("/").filter(Boolean);
  let breadcrumbs = ["Dashboard"];
  if (paths.length > 0) {
    if (paths[0] === "project") breadcrumbs = ["Projects", `Project #${paths[1]}`, "Overview"];
    if (paths[0] === "run") breadcrumbs = ["Projects", "E-commerce App", `Run #${paths[1]}`];
    if (paths[0] === "settings") breadcrumbs = ["Settings"];
  }

  return (
    <header className="h-16 border-b border-border bg-primary flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center text-sm font-medium text-secondary">
        {breadcrumbs.map((crumb, idx) => (
          <div key={idx} className="flex items-center">
            {idx > 0 && <ChevronRight className="w-4 h-4 mx-2 text-border" />}
            <span className={idx === breadcrumbs.length - 1 ? "text-primary" : "hover:text-primary cursor-pointer transition-colors"}>
              {crumb}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button className="text-secondary hover:text-primary transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-danger rounded-full ring-2 ring-primary"></span>
        </button>

        <div className="relative">
          <button 
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
            className="flex items-center justify-center w-8 h-8 rounded-md bg-tertiary border border-border text-secondary hover:text-primary transition-colors"
          >
            {theme === "light" && <Sun className="w-4 h-4" />}
            {theme === "dark" && <Moon className="w-4 h-4" />}
            {theme === "matrix" && <Terminal className="w-4 h-4" />}
          </button>
          
          {isThemeMenuOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-primary border border-border rounded-md shadow-lg py-1 z-50">
              <button 
                onClick={() => { setSpecificTheme("light"); setIsThemeMenuOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-secondary ${theme === 'light' ? 'text-accent' : 'text-primary'}`}
              >
                <Sun className="w-4 h-4" /> Light
              </button>
              <button 
                onClick={() => { setSpecificTheme("dark"); setIsThemeMenuOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-secondary ${theme === 'dark' ? 'text-accent' : 'text-primary'}`}
              >
                <Moon className="w-4 h-4" /> Dark
              </button>
              <button 
                onClick={() => { setSpecificTheme("matrix"); setIsThemeMenuOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-secondary ${theme === 'matrix' ? 'text-accent' : 'text-primary'}`}
              >
                <Terminal className="w-4 h-4" /> Matrix
              </button>
            </div>
          )}
        </div>

        <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-semibold text-sm cursor-pointer shadow-md">
          AJ
        </div>
      </div>
    </header>
  );
};

export default Header;

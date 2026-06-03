import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, ChevronRight, Check } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";
import { useLocation } from "react-router-dom";

const Header = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const breadcrumbs = [
    { name: "VRT", path: "/" },
    ...location.pathname
      .split("/")
      .filter((p) => p)
      .map((path, idx, arr) => ({
        name: path.charAt(0).toUpperCase() + path.slice(1),
        path: `/${arr.slice(0, idx + 1).join("/")}`
      }))
  ];

  const toggleLang = (lng) => {
    i18n.changeLanguage(lng);
    setLangMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/70 px-6 backdrop-blur-md transition-colors dark:border-gray-800 dark:bg-gray-950/70">
      <nav className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
        {breadcrumbs.map((crumb, idx) => (
          <div key={crumb.path} className="flex items-center">
            {idx > 0 && <ChevronRight className="mx-2 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-600" />}
            <span className={idx === breadcrumbs.length - 1 ? "text-gray-950 dark:text-gray-100" : ""}>{crumb.name}</span>
          </div>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="flex h-9 items-center gap-2 rounded-xl bg-gray-100 px-3 text-sm font-bold uppercase text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {i18n.language.split("-")[0]}
          </button>
          
          <AnimatePresence>
            {langMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-32 origin-top-right overflow-hidden rounded-xl border border-gray-200 bg-white p-1 shadow-xl dark:border-gray-800 dark:bg-gray-900"
              >
                {[
                  { code: "ru", label: "Русский" },
                  { code: "en", label: "English" }
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => toggleLang(lang.code)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    {lang.label}
                    {i18n.language.startsWith(lang.code) && <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={toggleTheme}
          className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <AnimatePresence mode="wait" initial={false}>
            {theme === "dark" ? (
              <motion.div
                key="moon"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="h-4 w-4" />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="h-4 w-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </header>
  );
};

export default Header;

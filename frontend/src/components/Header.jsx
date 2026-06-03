import { useState, useRef, useEffect } from "react";
import { Bell, Search, User, Globe, Moon, Sun, Monitor, LogOut, Check, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Header = () => {
  const { t, i18n } = useTranslation();
  const { user, notifications, markAllAsRead } = useAppContext();
  const navigate = useNavigate();
  
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const notifRef = useRef();
  const profileRef = useRef();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark", "hacker");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLangSwitch = (lang) => {
    i18n.changeLanguage(lang);
    setShowProfile(false);
  };

  return (
    <header className="h-16 bg-secondary border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Global Search Mock */}
        <div className="relative hidden md:block w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input 
            type="text" 
            placeholder="Search projects or runs... (Press '/')" 
            className="w-full bg-tertiary border border-border text-primary text-sm rounded-md pl-9 pr-4 py-1.5 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        
        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 text-secondary hover:text-primary hover:bg-tertiary rounded-full transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-secondary"></span>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 bg-primary border border-border rounded-xl shadow-2xl overflow-hidden z-50"
              >
                <div className="p-4 border-b border-border flex justify-between items-center bg-tertiary/50">
                  <h3 className="font-semibold text-primary">{t("header.notifications")}</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-xs text-accent hover:underline">
                      {t("header.markAllRead")}
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-secondary text-sm">{t("header.noNotifications")}</div>
                  ) : (
                    <div className="divide-y divide-border">
                      {notifications.map(notif => (
                        <div key={notif.id} className={`p-4 hover:bg-secondary transition-colors ${!notif.read ? 'bg-accent/5' : ''}`}>
                          <div className="flex gap-3">
                            <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                              notif.type === 'success' ? 'bg-success' : 
                              notif.type === 'error' ? 'bg-danger' : 'bg-accent'
                            }`} />
                            <div>
                              <p className={`text-sm ${!notif.read ? 'text-primary font-medium' : 'text-secondary'}`}>{notif.text}</p>
                              <span className="text-xs text-tertiary mt-1 block">{notif.time}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full border border-border bg-tertiary hover:border-accent/50 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-accent to-pink-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
              {user.name.charAt(0)}
            </div>
            <span className="text-sm font-medium text-primary hidden sm:block">{user.name}</span>
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-64 bg-primary border border-border rounded-xl shadow-2xl overflow-hidden z-50 py-2"
              >
                <div className="px-4 py-3 border-b border-border mb-2 min-w-0">
                  <p className="text-sm font-bold text-primary truncate">{user.name}</p>
                  <p className="text-xs text-secondary truncate">{user.email}</p>
                  <div className="mt-2 inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-accent/20 text-accent border border-accent/30">
                    {user.role}
                  </div>
                </div>

                <div className="px-2">
                  <button onClick={() => { toast.success(t("header.profile") || "Profile"); setShowProfile(false); }} className="w-full text-left px-3 py-2 text-sm text-secondary hover:text-primary hover:bg-secondary rounded-md flex items-center gap-2">
                    <User className="w-4 h-4" /> {t("header.profile")}
                  </button>
                  <button onClick={() => { toast.success(t("header.workspace") || "Workspace settings"); setShowProfile(false); }} className="w-full text-left px-3 py-2 text-sm text-secondary hover:text-primary hover:bg-secondary rounded-md flex items-center gap-2">
                    <Settings className="w-4 h-4" /> {t("header.workspace")}
                  </button>
                </div>

                <div className="border-t border-border my-2"></div>

                {/* Theme Switcher */}
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold text-tertiary uppercase tracking-wider mb-2">{t("header.theme")}</p>
                  <div className="flex gap-1 bg-secondary p-1 rounded-lg border border-border">
                    {[
                      { id: "light", icon: Sun },
                      { id: "dark", icon: Moon },
                      { id: "hacker", icon: Monitor }
                    ].map(tObj => (
                      <button
                        key={tObj.id}
                        onClick={() => setTheme(tObj.id)}
                        className={`flex-1 flex justify-center py-1.5 rounded-md transition-all ${theme === tObj.id ? "bg-primary shadow border border-border text-accent" : "text-secondary hover:text-primary"}`}
                        title={t(`header.themes.${tObj.id}`)}
                      >
                        <tObj.icon className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language Switcher */}
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold text-tertiary uppercase tracking-wider mb-2">{t("header.switchLang")}</p>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleLangSwitch('en')}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md border transition-all ${i18n.language.startsWith('en') ? 'bg-accent/10 border-accent/50 text-accent' : 'bg-primary border-border text-secondary hover:border-secondary'}`}
                    >
                      English
                    </button>
                    <button 
                      onClick={() => handleLangSwitch('ru')}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md border transition-all ${i18n.language.startsWith('ru') ? 'bg-accent/10 border-accent/50 text-accent' : 'bg-primary border-border text-secondary hover:border-secondary'}`}
                    >
                      Русский
                    </button>
                  </div>
                </div>

                <div className="border-t border-border my-2"></div>

                <div className="px-2">
                  <button onClick={() => navigate('/')} className="w-full text-left px-3 py-2 text-sm text-danger hover:bg-danger/10 rounded-md flex items-center gap-2 transition-colors">
                    <LogOut className="w-4 h-4" /> {t("header.logout")}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;

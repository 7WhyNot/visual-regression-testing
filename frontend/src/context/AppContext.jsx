import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

const initialNotifications = [
  { id: 1, type: "success", text: "Run #12 completed: 0 mismatches", time: "2 min ago", read: false },
  { id: 2, type: "error", text: "Run #11 failed: 3 visual bugs found", time: "1 hour ago", read: true },
  { id: 3, type: "info", text: "Workspace 'Marketing' was updated", time: "1 day ago", read: true }
];

const initialSettings = {
  general: { workspaceName: "My Workspace", defaultLanguage: "ru" },
  notifications: { email: true, slack: false, browser: true }
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({ name: "Alex Engineer", email: "alex@visionqa.dev", role: "Admin" });
  
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("vrt_notifications");
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("vrt_settings");
    return saved ? JSON.parse(saved) : initialSettings;
  });

  useEffect(() => {
    localStorage.setItem("vrt_notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("vrt_settings", JSON.stringify(settings));
  }, [settings]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (notif) => {
    setNotifications(prev => [{ id: Date.now(), ...notif, read: false, time: "Just now" }, ...prev]);
  };

  const updateSettings = (section, updates) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
  };

  return (
    <AppContext.Provider value={{ user, notifications, markAllAsRead, addNotification, settings, updateSettings }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

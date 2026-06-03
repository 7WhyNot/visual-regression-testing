import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../context/AppContext";
import { 
  Settings as SettingsIcon, Bell, Key, Users, AlertOctagon, 
  Copy, Check, Trash2, Mail, MessageSquare, Globe 
} from "lucide-react";
import toast from "react-hot-toast";

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { settings, updateSettings, user } = useAppContext();
  const [activeTab, setActiveTab] = useState("general");
  const [copiedKey, setCopiedKey] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  const fakeApiKey = "vq_live_x8F9jKp2mN5qL0rT4wY7zV1b";

  const handleCopy = () => {
    navigator.clipboard.writeText(fakeApiKey);
    setCopiedKey(true);
    toast.success(t("settings.apiConfig.copied"));
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleToggle = (section, key) => {
    updateSettings(section, { [key]: !settings[section][key] });
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (deleteInput === settings.general.workspaceName) {
      toast.error("Project deleted! (Fake action for MVP)");
      setShowDeleteModal(false);
      setDeleteInput("");
    } else {
      toast.error("Name does not match.");
    }
  };

  const tabs = [
    { id: "general", label: t("settings.tabs.general"), icon: SettingsIcon },
    { id: "notifications", label: t("settings.tabs.notifications"), icon: Bell },
    { id: "api", label: t("settings.tabs.api"), icon: Key },
    { id: "team", label: t("settings.tabs.team"), icon: Users },
    { id: "danger", label: t("settings.tabs.danger"), icon: AlertOctagon, danger: true }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-primary">{t("settings.title")}</h1>
        <p className="text-secondary mt-1">{t("settings.desc")}</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 shrink-0 max-h-[80vh] overflow-y-auto">
          <nav className="flex flex-col space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors relative ${
                  activeTab === tab.id 
                    ? (tab.danger ? "bg-danger/10 text-danger" : "bg-accent/10 text-accent")
                    : (tab.danger ? "text-danger hover:bg-danger/5" : "text-secondary hover:bg-secondary hover:text-primary")
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
                {activeTab === tab.id && !tab.danger && (
                  <motion.div layoutId="settings-tab" className="absolute left-0 w-1 h-6 bg-accent rounded-r-full" />
                )}
                {activeTab === tab.id && tab.danger && (
                  <motion.div layoutId="settings-tab" className="absolute left-0 w-1 h-6 bg-danger rounded-r-full" />
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          <div className="bg-primary border border-border rounded-xl shadow-sm p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* GENERAL TAB */}
                {activeTab === "general" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-primary border-b border-border pb-4">{t("settings.tabs.general")}</h2>
                    
                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-2">{t("settings.general.workspaceName")}</label>
                        <input
                          type="text"
                          value={settings.general.workspaceName}
                          onChange={(e) => updateSettings("general", { workspaceName: e.target.value })}
                          className="w-full bg-secondary border border-border rounded-md px-4 py-2 text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-2">{t("settings.general.timezone")}</label>
                        <select className="w-full bg-secondary border border-border rounded-md px-4 py-2 text-primary focus:outline-none focus:border-accent">
                          <option>UTC (Coordinated Universal Time)</option>
                          <option>Europe/Moscow</option>
                          <option>America/New_York</option>
                        </select>
                      </div>

                      <div className="pt-4">
                        <button onClick={() => toast.success(t("settings.saved") || "Settings saved successfully!")} className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent-hover transition-colors shadow-sm shadow-accent/20">
                          {t("settings.save")}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* NOTIFICATIONS TAB */}
                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-primary border-b border-border pb-4">{t("settings.tabs.notifications")}</h2>
                    
                    <div className="space-y-6">
                      {/* Email */}
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="mt-0.5 p-2 bg-tertiary rounded-lg border border-border text-primary"><Mail className="w-5 h-5" /></div>
                          <div>
                            <h4 className="font-medium text-primary">{t("settings.notifs.email")}</h4>
                            <p className="text-sm text-secondary mt-1">{t("settings.notifs.emailDesc")}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleToggle("notifications", "email")}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.email ? 'bg-accent' : 'bg-tertiary border border-border'}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications.email ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>

                      {/* Slack */}
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="mt-0.5 p-2 bg-tertiary rounded-lg border border-border text-primary"><MessageSquare className="w-5 h-5" /></div>
                          <div>
                            <h4 className="font-medium text-primary">{t("settings.notifs.slack")}</h4>
                            <p className="text-sm text-secondary mt-1">{t("settings.notifs.slackDesc")}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleToggle("notifications", "slack")}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.slack ? 'bg-accent' : 'bg-tertiary border border-border'}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications.slack ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>

                      {/* Browser */}
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="mt-0.5 p-2 bg-tertiary rounded-lg border border-border text-primary"><Globe className="w-5 h-5" /></div>
                          <div>
                            <h4 className="font-medium text-primary">{t("settings.notifs.browser")}</h4>
                            <p className="text-sm text-secondary mt-1">{t("settings.notifs.browserDesc")}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleToggle("notifications", "browser")}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.browser ? 'bg-accent' : 'bg-tertiary border border-border'}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications.browser ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* API & CI/CD TAB */}
                {activeTab === "api" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-primary border-b border-border pb-4">{t("settings.tabs.api")}</h2>
                    
                    <div>
                      <h4 className="font-medium text-primary mb-1">{t("settings.apiConfig.key")}</h4>
                      <p className="text-sm text-secondary mb-4">{t("settings.apiConfig.keyDesc")}</p>
                      
                      <div className="flex max-w-md">
                        <input
                          type="text"
                          readOnly
                          value={fakeApiKey}
                          className="flex-1 bg-secondary border border-r-0 border-border rounded-l-md px-4 py-2 text-primary font-mono text-sm focus:outline-none"
                        />
                        <button
                          onClick={handleCopy}
                          className="px-4 py-2 bg-tertiary border border-border rounded-r-md text-secondary hover:text-primary hover:bg-secondary transition-colors flex items-center gap-2"
                        >
                          {copiedKey ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                          {copiedKey ? "Copied" : t("settings.apiConfig.copy")}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TEAM TAB */}
                {activeTab === "team" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-border pb-4">
                      <h2 className="text-xl font-semibold text-primary">{t("settings.tabs.team")}</h2>
                      <button onClick={() => toast.success("Invite dialog opened")} className="px-3 py-1.5 bg-primary border border-border rounded-md text-sm text-secondary hover:text-primary transition-colors">
                        Invite Member
                      </button>
                    </div>
                    
                    <div className="border border-border rounded-lg overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-tertiary border-b border-border text-secondary text-xs uppercase tracking-wider">
                            <th className="px-6 py-3 font-medium">{t("settings.teamModule.name")}</th>
                            <th className="px-6 py-3 font-medium">{t("settings.teamModule.role")}</th>
                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          <tr className="bg-primary hover:bg-secondary transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-pink-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                                  {user.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-medium text-primary flex items-center gap-2">
                                    {user.name} <span className="px-1.5 py-0.5 rounded text-[10px] bg-tertiary border border-border text-secondary">You</span>
                                  </div>
                                  <div className="text-xs text-secondary mt-0.5">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-secondary">{t("settings.teamModule.admin")}</td>
                            <td className="px-6 py-4 text-right">
                              <button className="text-secondary hover:text-primary" disabled>Edit</button>
                            </td>
                          </tr>
                          <tr className="bg-primary hover:bg-secondary transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-teal-400 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                                  S
                                </div>
                                <div>
                                  <div className="font-medium text-primary">Sarah QA</div>
                                  <div className="text-xs text-secondary mt-0.5">sarah@visionqa.dev</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-secondary">{t("settings.teamModule.qa")}</td>
                            <td className="px-6 py-4 text-right">
                              <button onClick={() => toast.success("Edit member dialog opened")} className="text-secondary hover:text-primary">Edit</button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* DANGER ZONE TAB */}
                {activeTab === "danger" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-danger border-b border-border pb-4">{t("settings.tabs.danger")}</h2>
                    
                    <div className="bg-danger/5 border border-danger/20 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h4 className="font-medium text-primary mb-1">{t("settings.dangerZone.deleteProject")}</h4>
                        <p className="text-sm text-secondary">{t("settings.dangerZone.deleteDesc")}</p>
                      </div>
                      <button 
                        onClick={() => setShowDeleteModal(true)}
                        className="shrink-0 px-4 py-2 bg-danger text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> {t("settings.dangerZone.deleteBtn")}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-primary border border-danger/20 rounded-xl shadow-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4 text-danger">
                <AlertOctagon className="w-6 h-6" />
                <h2 className="text-xl font-bold">{t("settings.dangerZone.deleteProject")}</h2>
              </div>
              <p className="text-sm text-secondary mb-4">
                This action cannot be undone. This will permanently delete the <strong>{settings.general.workspaceName}</strong> workspace, projects, scenarios, and all test runs.
              </p>
              <p className="text-sm text-secondary mb-2">
                Please type <strong className="text-primary bg-tertiary px-1 rounded">{settings.general.workspaceName}</strong> to confirm.
              </p>
              
              <form onSubmit={handleDelete}>
                <input
                  type="text"
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-md px-4 py-2 text-primary focus:outline-none focus:border-danger focus:ring-1 focus:ring-danger transition-all mb-6"
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => { setShowDeleteModal(false); setDeleteInput(""); }}
                    className="px-4 py-2 text-sm font-medium text-secondary hover:text-primary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={deleteInput !== settings.general.workspaceName}
                    className="px-4 py-2 bg-danger text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    I understand, delete workspace
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;

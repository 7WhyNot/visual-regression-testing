import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Clock, Layers, Activity, FolderKanban, Plus, X, HeartHandshake } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import * as api from "../api.js";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const data = await api.getProjects();
      setProjects(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    const hasRunning = projects.some(p => p.testRuns?.some(r => r.status === "RUNNING"));
    if (!hasRunning) return;

    const interval = setInterval(async () => {
      try {
        const data = await api.getProjects();
        setProjects(data);
        const stillRunning = data.some(p => p.testRuns?.some(r => r.status === "RUNNING"));
        if (!stillRunning) {
          toast.success(t("dashboard.testsCompleted"));
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [projects, t]);

  const handleCreateProject = async (event) => {
    event.preventDefault();
    const name = projectName.trim();
    if (!name) return;

    try {
      setIsCreating(true);
      await api.createProject({ name });
      toast.success(t("dashboard.created"));
      setIsModalOpen(false);
      setProjectName("");
      await loadProjects();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const stats = useMemo(() => {
    let totalScenarios = 0;
    let passed = 0;
    let failed = 0;
    
    projects.forEach(p => {
      totalScenarios += p.testScenarios?.length || 0;
      p.testRuns?.forEach(run => {
        if (run.status === "PASSED") passed++;
        if (run.status === "FAILED") failed++;
      });
    });

    const totalRuns = passed + failed;
    const passRate = totalRuns > 0 ? Math.round((passed / totalRuns) * 100) : 100;
    const hoursSaved = totalRuns * 0.5; // fake metric (30 mins saved per test run)

    return [
      { label: t("dashboard.total"), value: projects.length, icon: Layers, color: "text-accent" },
      { label: t("dashboard.success"), value: `${passRate}%`, icon: CheckCircle, color: "text-success" },
      { label: t("dashboard.active"), value: failed, icon: XCircle, color: "text-danger" },
      { label: t("dashboard.savedHours"), value: hoursSaved, icon: Clock, color: "text-warning" },
    ];
  }, [projects, t]);

  const recentRuns = useMemo(() => {
    let runs = [];
    projects.forEach(p => {
      p.testRuns?.forEach(run => {
        runs.push({
          id: run.id,
          project: p.name,
          projectId: p.id,
          status: run.status === "COMPLETED" ? "Passed" : run.status === "FAILED" ? "Failed" : "Running",
          time: new Date(run.createdAt).toLocaleString(i18n.language.split("-")[0] === "en" ? "en-US" : "ru-RU"),
          timestamp: new Date(run.createdAt).getTime(),
          author: "Alex Engineer" // Fake author
        });
      });
    });
    return runs.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
  }, [projects, i18n.language]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-secondary font-medium">{t("dashboard.loading", "Loading dashboard...")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">{t("dashboard.overview")}</h1>
          <p className="text-secondary mt-1">{t("dashboard.overviewDesc")}</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent-hover transition-colors flex items-center gap-2 shadow-sm shadow-accent/20"
        >
          <Plus className="w-4 h-4" />
          {t("dashboard.createBtn")}
        </button>
      </header>

      {/* Stats Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            className="bg-primary border border-border p-6 rounded-xl shadow-sm flex items-center justify-between hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon className={`w-24 h-24 ${stat.color}`} />
            </div>
            <div className="z-10">
              <p className="text-secondary text-sm font-medium">{stat.label}</p>
              <h3 className="text-3xl font-bold mt-2 text-primary">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-full bg-tertiary z-10 ${stat.color} shadow-inner`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Projects List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-primary mb-4">{t("nav.projects")}</h2>
          {projects.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {projects.map((project) => (
                <motion.button
                  variants={itemVariants}
                  key={project.id}
                  onClick={() => navigate(`/project/${project.id}`)}
                  className="text-left bg-primary border border-border p-5 rounded-xl shadow-sm hover:border-accent hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-2.5 rounded-lg bg-tertiary text-accent group-hover:scale-110 transition-transform shadow-sm">
                      <FolderKanban className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20">Active</span>
                  </div>
                  <h3 className="text-lg font-bold text-primary truncate">{project.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full border-2 border-primary bg-gradient-to-tr from-accent to-pink-500 z-10"></div>
                      <div className="w-6 h-6 rounded-full border-2 border-primary bg-secondary flex items-center justify-center text-[8px]">+2</div>
                    </div>
                    <p className="text-xs text-secondary">{project.testScenarios?.length || 0} scenarios</p>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
             <div className="bg-primary border border-border rounded-xl p-12 text-center shadow-sm">
               <Layers className="w-12 h-12 text-secondary mx-auto mb-4 opacity-50" />
               <h3 className="text-lg font-medium text-primary mb-1">{t("dashboard.noProjects")}</h3>
               <p className="text-secondary text-sm">{t("dashboard.overviewDesc")}</p>
             </div>
          )}
        </div>

        {/* Recent Activity Timeline */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-accent" />
            {t("dashboard.recentActivity")}
          </h2>
          <div className="bg-primary border border-border rounded-xl shadow-sm overflow-hidden h-full">
            {recentRuns.length > 0 ? (
              <div className="divide-y divide-border">
                {recentRuns.map((run, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={run.id} 
                    onClick={() => navigate(`/run/${run.id}`)} 
                    className="p-5 flex items-start gap-4 hover:bg-secondary transition-colors cursor-pointer group"
                  >
                    <div className="shrink-0 mt-1">
                      <div className={`w-2.5 h-2.5 rounded-full ring-4 ring-primary ${
                        run.status === "Passed" ? "bg-success" : 
                        run.status === "Failed" ? "bg-danger" : "bg-warning animate-pulse"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-primary truncate">
                        {run.project}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                        <span className="text-xs text-secondary">{run.author}</span>
                        <span className="text-[10px] text-tertiary bg-secondary px-1.5 py-0.5 rounded border border-border">#{run.id.slice(0, 8)}</span>
                      </div>
                      <p className="text-xs text-secondary mt-1.5 opacity-70 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {run.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-secondary text-sm h-full flex flex-col items-center justify-center min-h-[300px]">
                <Clock className="w-8 h-8 opacity-20 mb-3" />
                {t("dashboard.noActivity")}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Create Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
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
              className="w-full max-w-md bg-primary border border-border rounded-xl shadow-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">{t("dashboard.modalTitle")}</h2>
                <button onClick={() => !isCreating && setIsModalOpen(false)} className="text-secondary hover:text-primary transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-secondary mb-5">{t("dashboard.modalDesc")}</p>
              <form onSubmit={handleCreateProject}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-secondary mb-2">{t("dashboard.projectName")}</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    autoFocus
                    placeholder={t("dashboard.placeholder")}
                    className="w-full bg-secondary border border-border rounded-md px-4 py-2 text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isCreating}
                    className="px-4 py-2 text-sm font-medium text-secondary hover:text-primary transition-colors"
                  >
                    {t("dashboard.cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || !projectName.trim()}
                    className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isCreating ? t("dashboard.creating") : t("dashboard.create")}
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

export default Dashboard;

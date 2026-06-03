import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Activity,
  CheckCircle2,
  FolderKanban,
  Plus,
  Rocket,
  Sparkles,
  X
} from "lucide-react";
import * as api from "../api.js";

const listVariants = {
  hidden: {
    opacity: 1
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 18
    }
  }
};

const skeletonItems = Array.from({ length: 4 }, (_, index) => index);

const formatDate = (value, locale) => {
  if (!value) return "";
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(value));
};

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const stats = useMemo(() => {
    return [
      {
        label: t("dashboard.total"),
        value: projects.length,
        icon: FolderKanban,
        iconClassName: "bg-indigo-50 text-indigo-600 ring-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-400 dark:ring-indigo-800"
      },
      {
        label: t("dashboard.success"),
        value: "98%",
        icon: CheckCircle2,
        iconClassName: "bg-emerald-50 text-emerald-600 ring-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-400 dark:ring-emerald-800"
      },
      {
        label: t("dashboard.active"),
        value: "3",
        icon: Activity,
        iconClassName: "bg-cyan-50 text-cyan-600 ring-cyan-100 dark:bg-cyan-900/50 dark:text-cyan-400 dark:ring-cyan-800"
      }
    ];
  }, [projects.length, t]);

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

  const handleOpenModal = () => setIsModalOpen(true);

  const handleCloseModal = () => {
    if (!isCreating) {
      setIsModalOpen(false);
      setProjectName("");
    }
  };

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

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
            <Sparkles className="h-3.5 w-3.5" />
            {t("dashboard.console")}
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-950 dark:text-gray-100">{t("dashboard.overview")}</h1>
        </div>

        <button
          type="button"
          onClick={handleOpenModal}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-600/25 dark:shadow-indigo-900/20"
        >
          <Plus className="h-5 w-5" />
          {t("dashboard.createBtn")}
        </button>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-200/70 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</div>
                  <div className="mt-2 text-3xl font-bold tracking-tight text-gray-950 dark:text-gray-100">{item.value}</div>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ring-1 ${item.iconClassName}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {isLoading ? (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skeletonItems.map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-start justify-between">
                <div className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-800" />
                <div className="h-7 w-20 rounded-full bg-gray-200 dark:bg-gray-800" />
              </div>
              <div className="mt-6 h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="mt-3 h-4 w-1/2 rounded bg-gray-100 dark:bg-gray-800/50" />
              <div className="mt-7 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800/50" />
            </div>
          ))}
        </section>
      ) : projects.length > 0 ? (
        <motion.section
          variants={listVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project) => (
            <motion.button
              key={project.id}
              type="button"
              variants={cardVariants}
              onClick={() => navigate(`/project/${project.id}`)}
              className="group rounded-xl border border-gray-200 bg-white p-6 text-left shadow-sm shadow-gray-200/70 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/70 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none dark:hover:border-indigo-500/30 dark:hover:shadow-indigo-900/20"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100 transition-transform duration-300 group-hover:scale-105 dark:bg-indigo-900/30 dark:text-indigo-400 dark:ring-indigo-800/50">
                  <FolderKanban className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-800/50">
                  Active
                </span>
              </div>

              <div className="mt-6">
                <h2 className="line-clamp-2 text-lg font-bold text-gray-950 dark:text-gray-100">{project.name}</h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t("dashboard.created")} {formatDate(project.createdAt, i18n.language.split("-")[0])}</p>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                  <span>{t("dashboard.coverage")}</span>
                  <span>76%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div className="h-full w-[76%] rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 dark:from-indigo-600 dark:to-cyan-500" />
                </div>
              </div>
            </motion.button>
          ))}
        </motion.section>
      ) : (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:shadow-none"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:ring-indigo-800/50">
            <Rocket className="h-10 w-10" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-950 dark:text-gray-100">{t("dashboard.noProjects")}</h2>
          <button
            type="button"
            onClick={handleOpenModal}
            className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-600/25 dark:shadow-indigo-900/20"
          >
            <Plus className="h-5 w-5" />
            {t("dashboard.createBtn")}
          </button>
        </motion.section>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm dark:bg-black/60"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
              className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl shadow-gray-950/20 dark:bg-gray-900 dark:ring-1 dark:ring-gray-800"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-950 dark:text-gray-100">{t("dashboard.modalTitle")}</h2>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t("dashboard.modalDesc")}</p>
                </div>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="mt-6 space-y-5">
                <div>
                  <label htmlFor="project-name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t("dashboard.projectName")}
                  </label>
                  <input
                    id="project-name"
                    value={projectName}
                    onChange={(event) => setProjectName(event.target.value)}
                    autoFocus
                    className="mt-2 h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-indigo-500"
                    placeholder={t("dashboard.placeholder")}
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={isCreating}
                    className="h-11 rounded-xl border border-gray-300 px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    {t("dashboard.cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300 dark:shadow-indigo-900/20"
                  >
                    <Plus className="h-5 w-5" />
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

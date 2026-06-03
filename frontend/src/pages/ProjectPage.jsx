import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Laptop, Monitor, Smartphone, Tablet, Play, AlertCircle, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { createScenario, getProjectById, runTests } from "../api.js";
import toast from "react-hot-toast";

const devicePresets = [
  { id: "desktop", label: "Desktop (1920x1080)", width: 1920, height: 1080, icon: Monitor },
  { id: "macbook", label: "MacBook (1440x900)", width: 1440, height: 900, icon: Laptop },
  { id: "ipad", label: "iPad Pro (1024x1366)", width: 1024, height: 1366, icon: Tablet },
  { id: "iphone", label: "iPhone 14 (390x844)", width: 390, height: 844, icon: Smartphone }
];

const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

const ProjectPage = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  const [scenarioName, setScenarioName] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(devicePresets[0]);
  const [savingScenario, setSavingScenario] = useState(false);

  const isValidUrl = useMemo(() => {
    if (!targetUrl) return true;
    return urlRegex.test(targetUrl);
  }, [targetUrl]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const data = await getProjectById(id);
      setProject(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  const handleCreateScenario = async (e) => {
    e.preventDefault();
    if (!scenarioName.trim() || !targetUrl.trim() || !isValidUrl) return;

    try {
      setSavingScenario(true);
      await createScenario(id, {
        name: scenarioName.trim(),
        targetUrl: targetUrl.trim(),
        width: selectedPreset.width,
        height: selectedPreset.height
      });
      setScenarioName("");
      setTargetUrl("");
      toast.success(t("dashboard.created")); // or some other success message
      await loadProject();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingScenario(false);
    }
  };

  const handleRunTests = async () => {
    try {
      setRunning(true);
      await runTests(id);
      toast.success("OK"); // The backend handles it, UI gets refreshed
      await loadProject();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRunning(false);
    }
  };

  if (loading && !project) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 dark:border-indigo-900 dark:border-t-indigo-400"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-lg dark:border-red-900/50 dark:bg-red-900/20">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 dark:text-red-400" />
        <h3 className="mt-4 text-lg font-bold text-red-900 dark:text-red-300">Ошибка загрузки проекта</h3>
        <p className="mt-2 text-sm text-red-700 dark:text-red-400">{error || "Проект не найден"}</p>
      </motion.div>
    );
  }

  return (
    <div className="relative min-h-screen pb-32">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 rounded-3xl border border-gray-200/80 bg-white/50 p-6 shadow-xl shadow-gray-200/40 backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-950/50 dark:shadow-none">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 transition hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
              <ChevronLeft className="h-4 w-4" /> {t("project.back")}
            </Link>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-950 dark:text-gray-100">{project.name}</h1>
          </div>

          <button
            onClick={handleRunTests}
            disabled={running || project.testScenarios.length === 0}
            className="group relative flex h-14 items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gray-950 px-8 font-bold text-white transition-all hover:bg-indigo-600 disabled:pointer-events-none disabled:opacity-50 dark:bg-white dark:text-gray-950 dark:hover:bg-indigo-400 dark:hover:text-gray-950"
          >
            <AnimatePresence mode="popLayout">
              {running ? (
                <motion.div
                  key="running"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center gap-3"
                >
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent opacity-60"></div>
                  {t("project.running")}
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center gap-2"
                >
                  <Play className="h-5 w-5 fill-current transition-transform group-hover:scale-110" />
                  {t("project.runTests")}
                </motion.div>
              )}
            </AnimatePresence>
            {!running && <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full dark:bg-black/10"></div>}
          </button>
        </div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-5">
          <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xl shadow-gray-200/40 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none">
            <h2 className="text-lg font-bold text-gray-950 dark:text-gray-100">{t("project.addScenario")}</h2>

            <form onSubmit={handleCreateScenario} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">{t("project.scenarioName")}</label>
                <input
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  placeholder={t("project.scenarioNamePh")}
                  className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 text-sm font-medium text-gray-950 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-indigo-500 dark:focus:bg-gray-950"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">{t("project.url")}</label>
                <div className="relative">
                  <input
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://example.com"
                    className={`h-12 w-full rounded-xl border px-4 text-sm font-medium text-gray-950 outline-none transition-all focus:bg-white focus:ring-4 dark:text-gray-100 dark:focus:bg-gray-950 ${!isValidUrl ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/10 dark:border-red-800 dark:bg-red-900/20" : "border-gray-200 bg-gray-50/50 focus:border-indigo-500 focus:ring-indigo-500/10 dark:border-gray-800 dark:bg-gray-950"}`}
                  />
                  {!isValidUrl && targetUrl && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 dark:text-red-400">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                  )}
                </div>
                {!isValidUrl && targetUrl && <p className="mt-1.5 text-xs font-semibold text-red-500 dark:text-red-400">{t("project.urlError")}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">{t("project.preset")}</label>
                <div className="grid grid-cols-2 gap-3">
                  {devicePresets.map((preset) => {
                    const isSelected = selectedPreset.id === preset.id;
                    const Icon = preset.icon;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setSelectedPreset(preset)}
                        className={`flex flex-col items-start gap-2 rounded-xl border p-3 transition-all ${isSelected ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-500 dark:ring-indigo-500" : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"}`}
                      >
                        <Icon className={`h-5 w-5 ${isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-gray-500"}`} />
                        <div className="text-left">
                          <div className={`text-sm font-bold ${isSelected ? "text-indigo-900 dark:text-indigo-300" : "text-gray-700 dark:text-gray-300"}`}>{preset.label.split(" (")[0]}</div>
                          <div className={`text-xs font-semibold ${isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-gray-500"}`}>{preset.width} × {preset.height}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={savingScenario || !scenarioName || !targetUrl || !isValidUrl}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-bold text-white transition-all hover:bg-indigo-500 disabled:opacity-50 dark:shadow-indigo-900/20"
              >
                <Plus className="h-4 w-4" /> {t("project.addBtn")}
              </button>
            </form>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-7">
          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xl shadow-gray-200/40 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none">
              <h2 className="mb-4 text-lg font-bold text-gray-950 dark:text-gray-100">{t("project.scenarios")} ({project.testScenarios.length})</h2>
              <div className="space-y-3">
                {project.testScenarios.map((scenario) => (
                  <div key={scenario.id} className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/50 p-4 transition-colors hover:bg-white hover:shadow-md hover:shadow-gray-100 dark:border-gray-800 dark:bg-gray-950/50 dark:hover:bg-gray-800 dark:hover:shadow-none">
                    <div>
                      <div className="font-bold text-gray-900 dark:text-gray-100">{scenario.name}</div>
                      <a href={scenario.targetUrl} target="_blank" rel="noreferrer" className="mt-1 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">{scenario.targetUrl}</a>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700">
                      <Monitor className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{scenario.width} × {scenario.height}</span>
                    </div>
                  </div>
                ))}
                {project.testScenarios.length === 0 && (
                  <div className="flex h-32 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 text-gray-400 dark:border-gray-800 dark:bg-gray-950">
                    <Monitor className="mb-2 h-8 w-8 opacity-20" />
                    <span className="text-sm font-bold">{t("project.noScenarios")}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xl shadow-gray-200/40 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none">
              <h2 className="mb-4 text-lg font-bold text-gray-950 dark:text-gray-100">{t("project.runHistory")}</h2>
              <div className="overflow-hidden rounded-2xl border border-gray-100 ring-1 ring-inset ring-gray-950/5 dark:border-gray-800 dark:ring-white/5">
                <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
                  <thead className="bg-gray-50/50 dark:bg-gray-950">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t("project.runId")}</th>
                      <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t("project.status")}</th>
                      <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t("project.date")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-900">
                    {project.testRuns.map((run) => (
                      <tr key={run.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="whitespace-nowrap px-6 py-4">
                          <Link to={`/run/${run.id}`} className="font-bold text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                            #{run.id.slice(0, 8)}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${run.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-800/50" : run.status === "FAILED" ? "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-800/50" : "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-800/50"}`}>
                            {run.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                          {new Intl.DateTimeFormat(i18n.language.split("-")[0] === "en" ? "en-US" : "ru-RU", { dateStyle: "medium", timeStyle: "short" }).format(new Date(run.createdAt))}
                        </td>
                      </tr>
                    ))}
                    {project.testRuns.length === 0 && (
                      <tr>
                        <td colSpan="3" className="px-6 py-8 text-center text-sm font-bold text-gray-400 dark:text-gray-500">
                          {t("project.noRuns")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectPage;

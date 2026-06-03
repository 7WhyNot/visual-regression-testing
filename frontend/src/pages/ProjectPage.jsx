import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Laptop, Monitor, Smartphone, Tablet, Play, AlertCircle, Plus } from "lucide-react";
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
      toast.success("Сценарий успешно добавлен");
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
      toast.success("Тесты успешно завершены");
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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-lg">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-4 text-lg font-bold text-red-900">Ошибка загрузки проекта</h3>
        <p className="mt-2 text-sm text-red-700">{error || "Проект не найден"}</p>
      </motion.div>
    );
  }

  return (
    <div className="relative min-h-screen pb-32">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 rounded-3xl border border-gray-200/80 bg-white/50 p-6 shadow-xl shadow-gray-200/40 backdrop-blur-xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 transition hover:text-indigo-600">
              <ChevronLeft className="h-4 w-4" /> Назад к списку проектов
            </Link>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-950">{project.name}</h1>
          </div>

          <button
            onClick={handleRunTests}
            disabled={running || project.testScenarios.length === 0}
            className="group relative flex h-14 items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gray-950 px-8 font-bold text-white transition-all hover:bg-indigo-600 disabled:pointer-events-none disabled:opacity-50"
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
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  Браузер делает снимки...
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center gap-2"
                >
                  <Play className="h-5 w-5 fill-white transition-transform group-hover:scale-110" />
                  Запустить тесты
                </motion.div>
              )}
            </AnimatePresence>
            {!running && <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full"></div>}
          </button>
        </div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-5">
          <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xl shadow-gray-200/40">
            <h2 className="text-lg font-bold text-gray-950">Добавить сценарий</h2>

            <form onSubmit={handleCreateScenario} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Название компонента / страницы</label>
                <input
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  placeholder="Например: Главная страница"
                  className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 text-sm font-medium text-gray-950 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">URL для проверки</label>
                <div className="relative">
                  <input
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://example.com"
                    className={`h-12 w-full rounded-xl border px-4 text-sm font-medium text-gray-950 outline-none transition-all focus:bg-white focus:ring-4 ${!isValidUrl ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/10" : "border-gray-200 bg-gray-50/50 focus:border-indigo-500 focus:ring-indigo-500/10"}`}
                  />
                  {!isValidUrl && targetUrl && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                  )}
                </div>
                {!isValidUrl && targetUrl && <p className="mt-1.5 text-xs font-semibold text-red-500">Введите корректный URL (с http:// или https://)</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Пресет устройства</label>
                <div className="grid grid-cols-2 gap-3">
                  {devicePresets.map((preset) => {
                    const isSelected = selectedPreset.id === preset.id;
                    const Icon = preset.icon;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setSelectedPreset(preset)}
                        className={`flex flex-col items-start gap-2 rounded-xl border p-3 transition-all ${isSelected ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600" : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"}`}
                      >
                        <Icon className={`h-5 w-5 ${isSelected ? "text-indigo-600" : "text-gray-400"}`} />
                        <div className="text-left">
                          <div className={`text-sm font-bold ${isSelected ? "text-indigo-900" : "text-gray-700"}`}>{preset.label.split(" (")[0]}</div>
                          <div className={`text-xs font-semibold ${isSelected ? "text-indigo-600" : "text-gray-400"}`}>{preset.width} × {preset.height}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={savingScenario || !scenarioName || !targetUrl || !isValidUrl}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-bold text-white transition-all hover:bg-indigo-500 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" /> Добавить в проект
              </button>
            </form>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-7">
          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xl shadow-gray-200/40">
              <h2 className="mb-4 text-lg font-bold text-gray-950">Сценарии ({project.testScenarios.length})</h2>
              <div className="space-y-3">
                {project.testScenarios.map((scenario) => (
                  <div key={scenario.id} className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/50 p-4 transition-colors hover:bg-white hover:shadow-md hover:shadow-gray-100">
                    <div>
                      <div className="font-bold text-gray-900">{scenario.name}</div>
                      <a href={scenario.targetUrl} target="_blank" rel="noreferrer" className="mt-1 text-sm font-medium text-indigo-600 hover:underline">{scenario.targetUrl}</a>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 shadow-sm ring-1 ring-gray-200">
                      <Monitor className="h-4 w-4 text-gray-400" />
                      <span className="text-xs font-bold text-gray-600">{scenario.width} × {scenario.height}</span>
                    </div>
                  </div>
                ))}
                {project.testScenarios.length === 0 && (
                  <div className="flex h-32 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 text-gray-400">
                    <Monitor className="mb-2 h-8 w-8 opacity-20" />
                    <span className="text-sm font-bold">Сценариев пока нет</span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xl shadow-gray-200/40">
              <h2 className="mb-4 text-lg font-bold text-gray-950">История прогонов</h2>
              <div className="overflow-hidden rounded-2xl border border-gray-100 ring-1 ring-inset ring-gray-950/5">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-gray-500">ID Прогона</th>
                      <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-gray-500">Статус</th>
                      <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-gray-500">Дата запуска</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {project.testRuns.map((run) => (
                      <tr key={run.id} className="transition-colors hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4">
                          <Link to={`/run/${run.id}`} className="font-bold text-indigo-600 hover:text-indigo-900">
                            #{run.id.slice(0, 8)}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${run.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200" : run.status === "FAILED" ? "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200" : "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200"}`}>
                            {run.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-500">
                          {new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short" }).format(new Date(run.createdAt))}
                        </td>
                      </tr>
                    ))}
                    {project.testRuns.length === 0 && (
                      <tr>
                        <td colSpan="3" className="px-6 py-8 text-center text-sm font-bold text-gray-400">
                          Нет запущенных тестов
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

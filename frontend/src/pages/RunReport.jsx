import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { CheckCircle2, ChevronLeft, Clock, Filter, Layers, LayoutGrid, XCircle } from "lucide-react";
import { getRunReport, reviewTest } from "../api.js";
import DiffViewer from "../components/DiffViewer.jsx";

const formatNumber = (value) => new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 }).format(value || 0);

const RunReport = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  const loadReport = async () => {
    try {
      setLoading(true);
      const data = await getRunReport(id);
      setReport(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [id]);

  const handleReview = async (resultId, status) => {
    try {
      setReviewing(true);
      await reviewTest(resultId, { status });
      toast.success(status === "PASSED" ? "Утверждено как эталон" : "Помечено как баг");
      await loadReport();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setReviewing(false);
    }
  };

  const handleBulkReview = async (status) => {
    try {
      setReviewing(true);
      const failedResults = report.results.filter((r) => r.status === "FAILED");
      await Promise.all(failedResults.map((r) => reviewTest(r.id, { status })));
      toast.success(`Все изменения ${status === "PASSED" ? "одобрены" : "отклонены"}`);
      await loadReport();
    } catch (err) {
      toast.error("Ошибка при массовом действии: " + err.message);
    } finally {
      setReviewing(false);
    }
  };

  const filteredResults = useMemo(() => {
    if (!report) return [];
    if (filter === "failed") return report.results.filter((r) => r.status === "FAILED");
    if (filter === "passed") return report.results.filter((r) => r.status === "PASSED");
    return report.results;
  }, [report, filter]);

  const stats = useMemo(() => {
    if (!report) return { total: 0, passed: 0, failed: 0, percent: 0, duration: 0 };
    const passed = report.results.filter((r) => r.status === "PASSED").length;
    const failed = report.results.filter((r) => r.status === "FAILED").length;
    const total = report.results.length;
    const percent = total === 0 ? 100 : (passed / total) * 100;
    let duration = 0;
    if (report.testRun.completedAt && report.testRun.createdAt) {
      duration = Math.round((new Date(report.testRun.completedAt) - new Date(report.testRun.createdAt)) / 1000);
    }
    return { total, passed, failed, percent, duration };
  }, [report]);

  const hasFailed = stats.failed > 0;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-lg">
        <XCircle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-4 text-lg font-bold text-red-900">Ошибка загрузки отчета</h3>
        <p className="mt-2 text-sm text-red-700">{error || "Отчет не найден"}</p>
      </motion.div>
    );
  }

  return (
    <div className="relative min-h-screen pb-32">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 rounded-3xl border border-gray-200/80 bg-white/50 p-6 shadow-xl shadow-gray-200/40 backdrop-blur-xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Link to={`/project/${report.project.id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 transition hover:text-indigo-600">
              <ChevronLeft className="h-4 w-4" /> Назад к проекту {report.project.name}
            </Link>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-950">Отчет прогона <span className="text-gray-400">#{id.slice(0, 8)}</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
              <Clock className="h-4 w-4 text-gray-400" />
              {stats.duration} сек
            </div>
            <div className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold ${stats.percent === 100 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
              {stats.percent === 100 ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              {stats.percent === 100 ? "Успешно" : "Обнаружены изменения"}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between text-sm font-bold text-gray-700">
            <span>Прогресс выполнения</span>
            <span>{Math.round(stats.percent)}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-gray-100 ring-1 ring-inset ring-gray-950/5">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${stats.percent}%` }} 
              transition={{ duration: 1, ease: "easeOut" }} 
              className={`h-full rounded-full ${stats.percent === 100 ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : "bg-gradient-to-r from-red-400 to-red-500"}`} 
            />
          </div>
          <div className="mt-3 flex gap-6 text-sm font-medium text-gray-500">
            <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-gray-300"></div>Всего: {stats.total}</span>
            <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-emerald-500"></div>Успешно: {stats.passed}</span>
            <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-red-500"></div>Ошибки: {stats.failed}</span>
          </div>
        </div>
      </motion.div>

      <div className="mb-6 flex items-center gap-2">
        <Filter className="mr-2 h-5 w-5 text-gray-400" />
        {[{ id: "all", label: "Все тесты" }, { id: "failed", label: "Только ошибки" }, { id: "passed", label: "Успешные" }].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${filter === tab.id ? "bg-gray-950 text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredResults.map((result) => {
            const isExpanded = expandedId === result.id;
            const isPassed = result.status === "PASSED";
            
            return (
              <motion.div
                layout
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`overflow-hidden rounded-2xl border transition-colors ${isExpanded ? "border-indigo-200 bg-white shadow-2xl shadow-indigo-100/50" : "border-gray-200 bg-white hover:border-gray-300"}`}
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : result.id)}
                  className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-gray-50/50"
                >
                  <div className="flex items-center gap-6">
                    <div className="relative h-16 w-24 overflow-hidden rounded-lg bg-gray-100 ring-1 ring-inset ring-gray-950/10">
                      {(result.currentUrl || result.baselineUrl) ? (
                        <img src={result.currentUrl || result.baselineUrl} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center"><LayoutGrid className="h-6 w-6 text-gray-300" /></div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-950">{result.scenario?.name || "Scenario"}</h3>
                      <div className="mt-1 flex items-center gap-3 text-sm font-medium text-gray-500">
                        <span className="truncate max-w-[300px] text-indigo-600">{result.scenario?.targetUrl}</span>
                        <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                        <span>{result.scenario?.width} × {result.scenario?.height}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">{formatNumber(result.mismatchPercentage)}%</div>
                      <div className="text-xs font-medium text-gray-400">расхождение</div>
                    </div>
                    <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${isPassed ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200" : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200"}`}>
                      {isPassed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                      {result.status}
                    </span>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-100 bg-gray-50/30"
                    >
                      <div className="p-5">
                        <DiffViewer
                          baselineUrl={result.baselineUrl}
                          currentUrl={result.currentUrl}
                          diffUrl={result.diffUrl}
                          onAccept={() => handleReview(result.id, "PASSED")}
                          onReject={() => handleReview(result.id, "FAILED")}
                        />
                        
                        <div className="mt-4 flex justify-end gap-3">
                          <button
                            onClick={() => handleReview(result.id, "PASSED")}
                            disabled={reviewing}
                            className="flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-600/30 disabled:opacity-50"
                          >
                            <CheckCircle2 className="h-4 w-4" /> Утвердить эталон
                          </button>
                          <button
                            onClick={() => handleReview(result.id, "FAILED")}
                            disabled={reviewing}
                            className="flex h-11 items-center gap-2 rounded-xl bg-red-600 px-6 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-all hover:-translate-y-0.5 hover:bg-red-500 hover:shadow-xl hover:shadow-red-600/30 disabled:opacity-50"
                          >
                            <XCircle className="h-4 w-4" /> Пометить как баг
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {hasFailed && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.2 }}
            className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-full border border-gray-200/50 bg-white/80 px-6 py-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center gap-2 pr-4 border-r border-gray-200">
              <Layers className="h-5 w-5 text-indigo-600" />
              <span className="text-sm font-bold text-gray-900">Найдено ошибок: {stats.failed}</span>
            </div>
            <button
              onClick={() => handleBulkReview("PASSED")}
              disabled={reviewing}
              className="rounded-xl bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-800 transition hover:bg-emerald-200 disabled:opacity-50"
            >
              Одобрить все
            </button>
            <button
              onClick={() => handleBulkReview("FAILED")}
              disabled={reviewing}
              className="rounded-xl bg-red-100 px-4 py-2 text-sm font-bold text-red-800 transition hover:bg-red-200 disabled:opacity-50"
            >
              Отклонить все
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RunReport;

import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Settings, Search, Filter, Plus, Monitor, AlertCircle, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { createScenario, getProjectById, runTests } from "../api.js";
import toast from "react-hot-toast";

const devicePresets = [
  { id: "desktop", label: "Desktop (1920x1080)", width: 1920, height: 1080 },
  { id: "macbook", label: "MacBook (1440x900)", width: 1440, height: 900 },
  { id: "ipad", label: "iPad Pro (1024x1366)", width: 1024, height: 1366 },
  { id: "iphone", label: "iPhone 14 (390x844)", width: 390, height: 844 }
];

const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

const ProjectPage = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [scenarioName, setScenarioName] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(devicePresets[0]);
  const [ignoredSelectors, setIgnoredSelectors] = useState("");
  const [threshold, setThreshold] = useState(0.1);
  const [savingScenario, setSavingScenario] = useState(false);

  const isValidUrl = useMemo(() => {
    if (!targetUrl) return true;
    return urlRegex.test(targetUrl);
  }, [targetUrl]);

  const loadProject = async () => {
    try {
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

  useEffect(() => {
    if (!project) return;
    const isRunning = project.testRuns?.[0]?.status === "RUNNING";
    if (!isRunning) return;

    const interval = setInterval(async () => {
      try {
        const data = await getProjectById(id);
        setProject(data);
        if (data.testRuns?.[0]?.status !== "RUNNING") {
          toast.success(t("Tests completed!"));
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [project?.testRuns?.[0]?.status, id, t]);

  const handleCreateScenario = async (e) => {
    e.preventDefault();
    if (!scenarioName.trim() || !targetUrl.trim() || !isValidUrl) return;

    try {
      setSavingScenario(true);
      await createScenario(id, {
        name: scenarioName.trim(),
        targetUrl: targetUrl.trim(),
        width: selectedPreset.width,
        height: selectedPreset.height,
        threshold: parseFloat(threshold),
        ignoredSelectors: ignoredSelectors.split(',').map(s => s.trim()).filter(Boolean)
      });
      setScenarioName("");
      setTargetUrl("");
      setIgnoredSelectors("");
      setThreshold(0.1);
      toast.success(t("dashboard.created"));
      setIsModalOpen(false);
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
      toast.success("Tests started");
      await loadProject();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRunning(false);
    }
  };

  if (loading && !project) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent"></div></div>;
  }

  if (error || !project) {
    return (
      <div className="bg-danger/10 border border-danger/20 rounded-xl p-6 text-center">
        <AlertCircle className="w-8 h-8 text-danger mx-auto mb-3" />
        <h3 className="text-danger font-medium">Error loading project</h3>
        <p className="text-danger/80 text-sm mt-1">{error || "Project not found"}</p>
      </div>
    );
  }

  // Combine scenarios with their latest run status
  const scenariosData = (project.testScenarios || []).map(sc => {
    // find the most recent run for this project, then find the result for this scenario
    const latestRun = project.testRuns?.[0];
    let status = "Not run";
    let link = null;
    let threshold = "0.1%"; // default or from settings
    
    if (latestRun) {
      const result = latestRun.testResults?.find(r => r.testScenarioId === sc.id);
      if (result) {
        status = result.status === "COMPLETED" || result.status === "PASSED" ? "Passed" : result.status === "FAILED" ? "Failed" : "Running";
        link = `/run/${latestRun.id}`;
      } else {
        status = latestRun.status === "RUNNING" ? "Running" : "Not run";
      }
    }

    return {
      id: sc.id,
      name: sc.name,
      url: sc.targetUrl,
      resolutions: [`${sc.width}x${sc.height}`],
      threshold,
      lastRun: status,
      runLink: link
    };
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-primary">{project.name}</h1>
            <span className="bg-tertiary border border-border text-xs px-2 py-1 rounded-md text-secondary">ID: #{project.id.slice(0,8)}</span>
          </div>
          <p className="text-secondary mt-1">Manage visual test scenarios and view test runs for this project.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-primary border border-border rounded-md text-sm font-medium text-secondary hover:text-primary hover:bg-secondary transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Scenario
          </button>
          <button 
            onClick={handleRunTests}
            disabled={running || project.testScenarios.length === 0}
            className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent-hover transition-colors flex items-center gap-2 shadow-sm shadow-accent/20 disabled:opacity-50"
          >
            <Play className={`w-4 h-4 ${running ? "animate-pulse" : ""}`} fill="currentColor" /> 
            {running ? t("project.running") : "Trigger Manual Run"}
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input 
            type="text" 
            placeholder="Search scenarios..." 
            className="w-full bg-primary border border-border text-primary text-sm rounded-md pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
          />
        </div>
        <button className="px-3 py-2 bg-primary border border-border rounded-md text-sm text-secondary hover:text-primary flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-primary border border-border rounded-xl shadow-sm overflow-hidden">
        {scenariosData.length === 0 ? (
          <div className="p-12 text-center">
            <Monitor className="w-12 h-12 text-border mx-auto mb-4" />
            <h3 className="text-lg font-medium text-primary">No scenarios</h3>
            <p className="text-secondary mt-1">Create your first scenario to start testing.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-tertiary border-b border-border text-secondary text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Scenario</th>
                <th className="px-6 py-4 font-medium">URL Path</th>
                <th className="px-6 py-4 font-medium">Resolutions</th>
                <th className="px-6 py-4 font-medium">Threshold</th>
                <th className="px-6 py-4 font-medium">Last Run</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {scenariosData.map((scenario, idx) => (
                <motion.tr 
                  key={scenario.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-secondary transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-primary">{scenario.name}</div>
                    <div className="text-xs text-secondary mt-0.5">#{scenario.id.slice(0,8)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <a href={scenario.url} target="_blank" rel="noreferrer" className="font-mono text-xs bg-tertiary px-2 py-1 rounded border border-border text-secondary hover:text-accent transition-colors">
                      {scenario.url}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap">
                      {scenario.resolutions.map(res => (
                        <span key={res} className="text-xs text-primary bg-secondary border border-border px-1.5 py-0.5 rounded">{res}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary">{scenario.threshold}</td>
                  <td className="px-6 py-4">
                    {scenario.lastRun === "Failed" && scenario.runLink ? (
                      <Link to={scenario.runLink} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20 transition-colors">
                        Failed (View)
                      </Link>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                      ${scenario.lastRun === 'Passed' ? 'bg-success/10 text-success border-success/20' : 
                        scenario.lastRun === 'Running' ? 'bg-warning/10 text-warning border-warning/20' : 'bg-tertiary text-secondary border-border'}`}>
                      {scenario.lastRun}
                    </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Scenario Modal */}
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
              className="w-full max-w-lg bg-primary border border-border rounded-xl shadow-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">{t("project.addScenario")}</h2>
                <button onClick={() => !savingScenario && setIsModalOpen(false)} className="text-secondary hover:text-primary transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleCreateScenario} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">{t("project.scenarioName")}</label>
                  <input
                    value={scenarioName}
                    onChange={(e) => setScenarioName(e.target.value)}
                    placeholder={t("project.scenarioNamePh")}
                    className="w-full bg-secondary border border-border rounded-md px-4 py-2 text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">{t("project.url")}</label>
                  <input
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://example.com"
                    className={`w-full bg-secondary border rounded-md px-4 py-2 text-primary focus:outline-none focus:ring-1 transition-all ${!isValidUrl ? "border-danger focus:border-danger focus:ring-danger" : "border-border focus:border-accent focus:ring-accent"}`}
                  />
                  {!isValidUrl && <p className="mt-1.5 text-xs text-danger">{t("project.urlError")}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">{t("project.preset")}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {devicePresets.map((preset) => {
                      const isSelected = selectedPreset.id === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setSelectedPreset(preset)}
                          className={`flex flex-col items-start gap-1 rounded-md border p-3 transition-all ${isSelected ? "border-accent bg-accent/10" : "border-border bg-primary hover:bg-secondary"}`}
                        >
                          <div className={`text-sm font-bold ${isSelected ? "text-accent" : "text-primary"}`}>{preset.label.split(" (")[0]}</div>
                          <div className={`text-xs ${isSelected ? "text-accent/80" : "text-secondary"}`}>{preset.width} × {preset.height}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Ignored Selectors (comma separated)</label>
                  <input
                    value={ignoredSelectors}
                    onChange={(e) => setIgnoredSelectors(e.target.value)}
                    placeholder=".ads, #cookie-banner, [data-dynamic]"
                    className="w-full bg-secondary border border-border rounded-md px-4 py-2 text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all font-mono text-sm"
                  />
                  <p className="mt-1.5 text-xs text-secondary">Elements matching these CSS selectors will be hidden before taking the screenshot.</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-secondary">Sensitivity (Threshold)</label>
                    <span className="text-sm font-bold text-accent">{threshold}</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.99"
                    step="0.01"
                    value={threshold}
                    onChange={(e) => setThreshold(parseFloat(e.target.value))}
                    className="w-full accent-accent"
                  />
                  <p className="mt-1.5 text-xs text-secondary">Lower value means higher sensitivity to visual changes.</p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={savingScenario}
                    className="px-4 py-2 text-sm font-medium text-secondary hover:text-primary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingScenario || !scenarioName || !targetUrl || !isValidUrl}
                    className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {savingScenario ? "Adding..." : "Add Scenario"}
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

export default ProjectPage;

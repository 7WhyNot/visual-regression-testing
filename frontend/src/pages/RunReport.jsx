import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, X, ChevronLeft, CheckSquare, Square } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getRunReport, reviewTest, bulkReviewTests } from "../api.js";
import toast from "react-hot-toast";
import DiffViewer from "../components/DiffViewer";

const RunReport = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [selectedResultId, setSelectedResultId] = useState(null);
  const [filter, setFilter] = useState("all"); // all, passed, failed
  const [selectedIds, setSelectedIds] = useState(new Set()); // For bulk actions
  const [reviewing, setReviewing] = useState(false);

  const [isBulkLoading, setIsBulkLoading] = useState(false);

  const loadReport = async () => {
    try {
      setLoading(true);
      const data = await getRunReport(id);
      setReport(data);
      if (data.results?.length > 0 && !selectedResultId) {
        setSelectedResultId(data.results[0].id);
      }
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
      toast.success(status === "PASSED" ? "Approved as Baseline" : "Marked as Bug");
      await loadReport(); 
    } catch (err) {
      toast.error(err.message);
    } finally {
      setReviewing(false);
    }
  };

  const handleBulkReview = async (status) => {
    if (selectedIds.size === 0) return;
    try {
      setIsBulkLoading(true);
      await bulkReviewTests(Array.from(selectedIds), status);
      toast.success(`Bulk marked ${selectedIds.size} results as ${status}`);
      setSelectedIds(new Set());
      await loadReport();
    } catch (err) {
      toast.error("Bulk action failed: " + err.message);
    } finally {
      setIsBulkLoading(false);
    }
  };

  const filteredResults = useMemo(() => {
    const results = report?.results || [];
    if (filter === "passed") return results.filter(r => r.status === "PASSED" || r.status === "COMPLETED");
    if (filter === "failed") return results.filter(r => r.status === "FAILED");
    return results;
  }, [report, filter]);

  const toggleSelect = (rId, e) => {
    e.stopPropagation();
    const newSet = new Set(selectedIds);
    if (newSet.has(rId)) newSet.delete(rId);
    else newSet.add(rId);
    setSelectedIds(newSet);
  };

  const selectAll = () => {
    const failedResults = filteredResults.filter(r => r.status === "FAILED");
    if (selectedIds.size === failedResults.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(failedResults.map(r => r.id)));
    }
  };

  if (loading && !report) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent"></div></div>;
  }

  if (error || !report) {
    return (
      <div className="bg-danger/10 border border-danger/20 rounded-xl p-6 text-center">
        <X className="w-8 h-8 text-danger mx-auto mb-3" />
        <h3 className="text-danger font-medium">Error loading report</h3>
        <p className="text-danger/80 text-sm mt-1">{error || "Report not found"}</p>
      </div>
    );
  }

  const selectedResult = (report.results || []).find(r => r.id === selectedResultId) || report.results?.[0];

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-6 overflow-hidden">
      
      {/* Sidebar - Result List */}
      <div className="w-72 bg-secondary border-r border-border flex flex-col shrink-0">
        <div className="p-4 border-b border-border flex flex-col gap-3">
          <Link to={`/project/${report.project.id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:text-primary transition-colors">
            <ChevronLeft className="h-3 w-3" /> {t("runReport.back", "Back to Project")}
          </Link>
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-primary truncate">Run #{id.slice(0,8)}</h2>
          </div>
          
          {/* Filters */}
          <div className="flex bg-tertiary p-1 rounded-md border border-border">
            {["all", "passed", "failed"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 text-xs py-1 rounded text-center capitalize font-medium transition-colors ${filter === f ? "bg-primary text-primary shadow-sm border border-border/50" : "text-secondary hover:text-primary"}`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Bulk Actions Toolbar */}
          {(filter === "failed" || filter === "all") && filteredResults.some(r => r.status === "FAILED") && (
            <div className="flex items-center justify-between text-xs mt-1">
              <button onClick={selectAll} className="flex items-center gap-1 text-secondary hover:text-primary transition-colors">
                {selectedIds.size === filteredResults.filter(r => r.status === "FAILED").length ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                {t("runReport.selectFailed", "Select Failed")}
              </button>
              {selectedIds.size > 0 && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleBulkReview("PASSED")} 
                    disabled={isBulkLoading}
                    className="text-success hover:underline disabled:opacity-50 disabled:no-underline flex items-center gap-1"
                  >
                    {isBulkLoading && <div className="w-3 h-3 border-2 border-success border-t-transparent rounded-full animate-spin"></div>}
                    {t("runReport.approve", "Approve")} ({selectedIds.size})
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredResults.length === 0 ? (
            <div className="p-4 text-center text-xs text-secondary">{t("runReport.noResults", "No results match this filter.")}</div>
          ) : (
            filteredResults.map(result => {
              const isSelected = result.id === selectedResultId;
              const isChecked = selectedIds.has(result.id);
              const statusColor = result.status === "PASSED" ? "text-success bg-success/10" : result.status === "FAILED" ? "text-danger bg-danger/10" : "text-secondary bg-tertiary";
              return (
                <button
                  key={result.id}
                  onClick={() => setSelectedResultId(result.id)}
                  className={`w-full text-left p-3 rounded-md transition-all flex gap-3 ${isSelected ? "bg-primary border border-border shadow-sm" : "hover:bg-primary/50 border border-transparent"}`}
                >
                  {result.status === "FAILED" && (
                    <div onClick={(e) => toggleSelect(result.id, e)} className="mt-0.5 shrink-0 text-secondary hover:text-primary">
                      {isChecked ? <CheckSquare className="w-4 h-4 text-accent" /> : <Square className="w-4 h-4" />}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm text-primary truncate">{result.scenario?.name || "Scenario"}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${statusColor}`}>{result.status}</span>
                      <span className="text-xs font-mono text-secondary">{result.mismatchPercentage ? result.mismatchPercentage.toFixed(1) : 0}%</span>
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-primary">
        {!selectedResult ? (
          <div className="flex-1 flex items-center justify-center p-12 text-center text-secondary">
            <p>{t("runReport.selectToView", "Select a scenario to view diffs.")}</p>
          </div>
        ) : (
          <>
            <div className="border-b border-border p-4 flex items-center justify-between shrink-0 shadow-sm">
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-primary truncate">{selectedResult.scenario?.name}</h1>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${selectedResult.status === "PASSED" ? "bg-success/10 text-success border border-success/20" : "bg-danger/10 text-danger border border-danger/20"}`}>
                    {selectedResult.status}
                  </span>
                </div>
                <div className="text-sm text-secondary mt-1 flex items-center gap-4">
                  <span>{t("runReport.resolution", "Resolution:")} {selectedResult.scenario?.width}x{selectedResult.scenario?.height}</span>
                  <span>{t("runReport.diff", "Diff:")} <span className={selectedResult.status === "FAILED" ? "text-danger font-mono font-medium" : "text-success font-mono font-medium"}>{(selectedResult.mismatchPercentage || 0).toFixed(2)}%</span></span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 shrink-0">
                <button 
                  onClick={() => handleReview(selectedResult.id, "FAILED")}
                  disabled={reviewing}
                  className="px-4 py-2 bg-primary border border-danger text-danger rounded-md text-sm font-medium hover:bg-danger hover:text-white transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <X className="w-4 h-4" /> {t("runReport.markBug", "Mark as Bug")}
                </button>
                <button 
                  onClick={() => handleReview(selectedResult.id, "PASSED")}
                  disabled={reviewing}
                  className="px-4 py-2 bg-success text-white rounded-md text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-sm shadow-success/20 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" /> {t("runReport.approveBaseline", "Approve as Baseline")}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden p-6 bg-tertiary">
              <DiffViewer 
                baselineUrl={selectedResult.baselineUrl} 
                currentUrl={selectedResult.currentUrl} 
                diffUrl={selectedResult.diffUrl}
                onAccept={() => handleReview(selectedResult.id, "PASSED")}
                onReject={() => handleReview(selectedResult.id, "FAILED")}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RunReport;

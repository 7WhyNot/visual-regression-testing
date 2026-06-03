import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  ChevronsLeftRight,
  Columns,
  Image as ImageIcon,
  Layers,
  Maximize,
  Palette,
  PanelLeft,
  ScanLine,
  ZoomOut,
  ZoomIn
} from "lucide-react";

const EmptyImageState = ({ label }) => (
  <div className="flex aspect-video min-h-[500px] items-center justify-center rounded-2xl border border-dashed border-border bg-secondary text-sm font-medium text-secondary">
    {label}
  </div>
);

const DiffViewer = ({ baselineUrl, currentUrl, diffUrl, onAccept, onReject }) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState("overlay");
  const [swipePosition, setSwipePosition] = useState(50);
  const [scale, setScale] = useState(1);
  const [diffColorId, setDiffColorId] = useState("red");
  const containerRef = useRef(null);

  const modes = useMemo(() => [
    { id: "side-by-side", label: t("diffViewer.modes.sideBySide", "Side-by-Side"), icon: Columns, key: "1" },
    { id: "overlay", label: t("diffViewer.modes.overlay", "Overlay"), icon: Layers, key: "2" },
    { id: "swipe", label: t("diffViewer.modes.swipe", "Swipe"), icon: PanelLeft, key: "3" },
    { id: "diff", label: t("diffViewer.modes.diff", "Diff Highlight"), icon: ImageIcon, key: "4" }
  ], [t]);

  const colors = useMemo(() => [
    { id: "red", filter: "none", label: t("diffViewer.colors.red", "Red Highlight") },
    { id: "pink", filter: "hue-rotate(280deg) saturate(200%)", label: t("diffViewer.colors.pink", "Pink Highlight") },
    { id: "yellow", filter: "hue-rotate(60deg) saturate(200%)", label: t("diffViewer.colors.yellow", "Yellow Highlight") }
  ], [t]);

  const activeColor = useMemo(() => colors.find((c) => c.id === diffColorId), [diffColorId, colors]);

  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const isSyncingLeft = useRef(false);
  const isSyncingRight = useRef(false);

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.25, 3));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.25, 0.5));
  const handleZoomReset = () => setScale(1);

  const toggleColor = () => {
    const nextIndex = (colors.findIndex((c) => c.id === diffColorId) + 1) % colors.length;
    setDiffColorId(colors[nextIndex].id);
  };

  const handleKeyDown = useCallback(
    (e) => {
      // Hotkeys for modes
      if (["1", "2", "3", "4"].includes(e.key)) {
        const selected = modes.find(m => m.key === e.key);
        if (selected) setMode(selected.id);
      } else if (e.key === "Enter" && onAccept) {
        onAccept();
      } else if (e.key === "Escape" && onReject) {
        onReject();
      } else if (e.key.toLowerCase() === "z") {
        setScale((s) => (s === 1 ? 2 : 1));
      }
    },
    [onAccept, onReject, modes]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleLeftScroll = () => {
    if (isSyncingLeft.current) {
      isSyncingLeft.current = false;
      return;
    }
    if (rightRef.current && leftRef.current) {
      isSyncingRight.current = true;
      rightRef.current.scrollTop = leftRef.current.scrollTop;
      rightRef.current.scrollLeft = leftRef.current.scrollLeft;
    }
  };

  const handleRightScroll = () => {
    if (isSyncingRight.current) {
      isSyncingRight.current = false;
      return;
    }
    if (leftRef.current && rightRef.current) {
      isSyncingLeft.current = true;
      leftRef.current.scrollTop = rightRef.current.scrollTop;
      leftRef.current.scrollLeft = rightRef.current.scrollLeft;
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Toolbar */}
      <div className="bg-primary border border-border rounded-xl shadow-sm p-3 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-1.5 rounded-lg bg-secondary p-1">
          {modes.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === mode;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id)}
                className={`relative flex h-9 items-center gap-2 rounded-md px-3 text-sm font-semibold transition-colors ${
                  isActive ? "text-primary" : "text-secondary hover:text-primary"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mode-indicator"
                    className="absolute inset-0 rounded-md bg-primary shadow-sm ring-1 ring-border"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {item.label}
                  <span className="text-[10px] text-secondary border border-border px-1 rounded ml-1 bg-tertiary">{item.key}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
            <button onClick={handleZoomOut} className="flex h-9 w-9 items-center justify-center rounded-md text-secondary transition hover:bg-primary hover:text-primary">
              <ZoomOut className="h-4 w-4" />
            </button>
            <div className="flex w-12 justify-center text-xs font-bold text-primary">
              {Math.round(scale * 100)}%
            </div>
            <button onClick={handleZoomIn} className="flex h-9 w-9 items-center justify-center rounded-md text-secondary transition hover:bg-primary hover:text-primary">
              <ZoomIn className="h-4 w-4" />
            </button>
            <div className="mx-1 h-4 w-px bg-border" />
            <button onClick={handleZoomReset} className="flex h-9 w-9 items-center justify-center rounded-md text-secondary transition hover:bg-primary hover:text-primary">
              <Maximize className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={toggleColor}
            className="flex h-11 items-center gap-2 rounded-lg bg-secondary px-3 text-sm font-medium text-secondary transition hover:bg-tertiary hover:text-primary"
          >
            <Palette className="h-4 w-4" />
            {activeColor.label}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-xs font-medium text-secondary px-2">
        <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded border border-border bg-secondary font-mono">1-4</kbd> {t("diffViewer.keys.switch", "Switch Modes")}</span>
        <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded border border-border bg-secondary font-mono">Z</kbd> {t("diffViewer.keys.zoom", "Zoom")}</span>
        <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded border border-success/30 bg-success/10 text-success font-mono">Enter</kbd> {t("diffViewer.keys.approve", "Approve")}</span>
        <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded border border-danger/30 bg-danger/10 text-danger font-mono">Esc</kbd> {t("diffViewer.keys.reject", "Reject/Bug")}</span>
      </div>

      {/* Viewer Canvas */}
      <div 
        ref={containerRef}
        className="flex-1 min-h-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] bg-tertiary rounded-xl border border-border overflow-hidden relative"
      >
        <motion.div 
          className="absolute inset-0 flex items-center justify-center w-full h-full cursor-grab active:cursor-grabbing"
          drag={scale > 1}
          dragConstraints={containerRef}
          initial={false}
          animate={{ scale }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {mode === "overlay" && (
            <div className="relative max-w-4xl w-full bg-primary border border-border rounded-lg shadow-lg overflow-hidden pointer-events-none">
              {baselineUrl ? <img src={baselineUrl} alt="Baseline" className="w-full object-contain opacity-50 absolute inset-0 mix-blend-difference" /> : <EmptyImageState label={t("diffViewer.noBaseline", "No Baseline")} />}
              {currentUrl && <img src={currentUrl} alt="Current" className="w-full object-contain opacity-50" />}
            </div>
          )}

          {mode === "swipe" && (
            <div 
              className="relative max-w-4xl w-full bg-primary border border-border rounded-lg shadow-lg overflow-hidden select-none pointer-events-auto"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                setSwipePosition((x / rect.width) * 100);
              }}
            >
              {baselineUrl ? <img src={baselineUrl} alt="Baseline" className="w-full object-contain pointer-events-none" /> : <EmptyImageState label={t("diffViewer.noBaseline", "No Baseline")} />}
              <div 
                className="absolute top-0 bottom-0 left-0 overflow-hidden border-r-2 border-accent pointer-events-none"
                style={{ width: `${swipePosition}%` }}
              >
                {currentUrl && <img src={currentUrl} alt="Current" className="max-w-none h-full object-cover" style={{ width: '100vw', maxWidth: '896px' }} />}
              </div>
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-accent rounded-full text-white flex items-center justify-center shadow-lg -ml-4 pointer-events-none"
                style={{ left: `${swipePosition}%` }}
              >
                <ChevronsLeftRight className="w-4 h-4 rotate-90" />
              </div>
            </div>
          )}

          {mode === "diff" && (
            <div className="relative max-w-4xl w-full bg-primary border border-danger/50 rounded-lg shadow-lg overflow-hidden ring-4 ring-danger/10 pointer-events-none">
              {diffUrl ? <img src={diffUrl} alt="Diff" className="w-full object-contain" style={{ filter: activeColor.filter }} /> : <EmptyImageState label={t("diffViewer.noDiff", "No Diff Image")} />}
            </div>
          )}

          {mode === "side-by-side" && (
            <div className="grid h-full w-full max-w-7xl grid-cols-2 gap-8 p-4 pointer-events-auto">
              <div ref={leftRef} onScroll={handleLeftScroll} className="h-full overflow-auto rounded-xl bg-primary border border-border shadow-lg cursor-auto">
                <div className="bg-secondary border-b border-border px-4 py-2 text-sm font-medium text-secondary sticky top-0 z-10 shadow-sm">{t("diffViewer.baseline", "Baseline")}</div>
                {baselineUrl ? <img src={baselineUrl} className="block w-full object-contain" alt="Baseline" /> : <EmptyImageState label={t("diffViewer.noBaseline", "No Baseline")} />}
              </div>
              <div ref={rightRef} onScroll={handleRightScroll} className="h-full overflow-auto rounded-xl bg-primary border border-danger/50 ring-2 ring-danger/20 shadow-lg cursor-auto">
                <div className="bg-danger/10 border-b border-danger/20 px-4 py-2 text-sm font-medium text-danger sticky top-0 z-10 shadow-sm">{t("diffViewer.current", "Current")}</div>
                {currentUrl ? <img src={currentUrl} className="block w-full object-contain" alt="Current" /> : <EmptyImageState label={t("diffViewer.noCurrent", "No Current")} />}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DiffViewer;

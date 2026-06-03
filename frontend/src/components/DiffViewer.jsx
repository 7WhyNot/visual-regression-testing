import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
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
  <div className="flex aspect-video min-h-80 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 text-sm font-medium text-gray-500 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400">
    {label}
  </div>
);

const DiffViewer = ({ baselineUrl, currentUrl, diffUrl, onAccept, onReject }) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState("overlay");
  const [swipePosition, setSwipePosition] = useState(50);
  const [scale, setScale] = useState(1);
  const [diffColorId, setDiffColorId] = useState("red");

  const modes = useMemo(() => [
    { id: "baseline", label: t("diff.modes.baseline"), icon: ImageIcon },
    { id: "current", label: t("diff.modes.current"), icon: ScanLine },
    { id: "swipe", label: t("diff.modes.swipe"), icon: PanelLeft },
    { id: "overlay", label: t("diff.modes.overlay"), icon: Layers },
    { id: "side-by-side", label: t("diff.modes.sideBySide"), icon: Columns }
  ], [t]);

  const colors = useMemo(() => [
    { id: "red", filter: "none", label: t("diff.colors.red") },
    { id: "pink", filter: "hue-rotate(280deg) saturate(200%)", label: t("diff.colors.pink") },
    { id: "yellow", filter: "hue-rotate(60deg) saturate(200%)", label: t("diff.colors.yellow") }
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
      if (e.key.toLowerCase() === "z") {
        setScale((s) => (s === 1 ? 2 : 1));
      } else if (e.key === "[") {
        setMode((m) => {
          const idx = modes.findIndex((x) => x.id === m);
          return modes[idx > 0 ? idx - 1 : modes.length - 1].id;
        });
      } else if (e.key === "]") {
        setMode((m) => {
          const idx = modes.findIndex((x) => x.id === m);
          return modes[(idx + 1) % modes.length].id;
        });
      } else if (e.shiftKey && e.key.toLowerCase() === "a" && onAccept) {
        onAccept();
      } else if (e.shiftKey && e.key.toLowerCase() === "r" && onReject) {
        onReject();
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
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-200/80 bg-white/50 p-4 shadow-xl shadow-gray-200/40 backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-950/50 dark:shadow-none">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 rounded-xl bg-gray-100/80 p-1 backdrop-blur-md dark:bg-gray-900/80">
          {modes.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === mode;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id)}
                className={`relative flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition-colors ${
                  isActive ? "text-gray-950 dark:text-gray-100" : "text-gray-500 hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mode-indicator"
                    className="absolute inset-0 rounded-lg bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-800 dark:ring-white/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl bg-gray-100/80 p-1 backdrop-blur-md dark:bg-gray-900/80">
            <button onClick={handleZoomOut} className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition hover:bg-white hover:text-gray-950 hover:shadow-sm dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100">
              <ZoomOut className="h-4 w-4" />
            </button>
            <div className="flex w-12 justify-center text-xs font-bold text-gray-700 dark:text-gray-300">
              {Math.round(scale * 100)}%
            </div>
            <button onClick={handleZoomIn} className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition hover:bg-white hover:text-gray-950 hover:shadow-sm dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100">
              <ZoomIn className="h-4 w-4" />
            </button>
            <div className="mx-1 h-4 w-px bg-gray-300 dark:bg-gray-700" />
            <button onClick={handleZoomReset} className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition hover:bg-white hover:text-gray-950 hover:shadow-sm dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100">
              <Maximize className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={toggleColor}
            className="flex h-11 items-center gap-2 rounded-xl bg-gray-100/80 px-3 text-sm font-medium text-gray-700 backdrop-blur-md transition hover:bg-gray-200 dark:bg-gray-900/80 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Palette className="h-4 w-4" />
            {activeColor.label}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs font-medium text-gray-400 dark:text-gray-500">
        {t("diff.hotkeys")} 
        <kbd className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-600 ring-1 ring-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:ring-gray-800">Z</kbd> {t("diff.zoom")}
        <kbd className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-600 ring-1 ring-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:ring-gray-800">[ ]</kbd> {t("diff.tabs")}
        <kbd className="rounded bg-gray-100 px-1.5 py-0.5 text-emerald-600 ring-1 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-800">Shift + A</kbd> {t("diff.approve")}
        <kbd className="rounded bg-gray-100 px-1.5 py-0.5 text-red-600 ring-1 ring-red-200 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-800">Shift + R</kbd> {t("diff.reject")}
      </div>

      <div className="relative min-h-[500px] w-full overflow-hidden rounded-2xl bg-gray-900/5 ring-1 ring-inset ring-gray-950/10 dark:bg-gray-950/50 dark:ring-white/10">
        <motion.div 
          className="absolute inset-0 h-full w-full"
          initial={false}
          animate={{ scale }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {mode === "baseline" && (baselineUrl ? <div className="h-full w-full overflow-auto p-4"><img src={baselineUrl} className="mx-auto block" /></div> : <EmptyImageState label={t("diff.emptyBaseline")} />)}
          {mode === "current" && (currentUrl ? <div className="h-full w-full overflow-auto p-4"><img src={currentUrl} className="mx-auto block" /></div> : <EmptyImageState label={t("diff.emptyCurrent")} />)}
          
          {mode === "overlay" && (
            <div className="h-full w-full overflow-auto p-4">
              <div className="relative mx-auto w-max">
                <img src={baselineUrl} className="block" />
                <img src={diffUrl} className="absolute inset-0 block mix-blend-screen opacity-80" style={{ filter: activeColor.filter }} />
              </div>
            </div>
          )}

          {mode === "swipe" && (
            <div className="h-full w-full overflow-hidden p-4">
              <div className="relative mx-auto w-max overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10">
                <img src={baselineUrl} className="block" />
                <div className="absolute inset-0 overflow-hidden" style={{ width: `${swipePosition}%` }}>
                  <img src={currentUrl} className="absolute left-0 top-0 max-w-none" style={{ width: "100%", height: "100%" }} />
                </div>
                <div className="absolute inset-y-0 w-1 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]" style={{ left: `calc(${swipePosition}% - 2px)` }}>
                  <div className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-white text-cyan-600 shadow-lg ring-1 ring-cyan-400">
                    <ChevronsLeftRight className="h-4 w-4" />
                  </div>
                </div>
                <input type="range" min="0" max="100" value={swipePosition} onChange={(e) => setSwipePosition(Number(e.target.value))} className="absolute inset-0 z-10 w-full cursor-ew-resize opacity-0" />
              </div>
            </div>
          )}

          {mode === "side-by-side" && (
            <div className="grid h-full w-full grid-cols-2 gap-4 p-4">
              <div ref={leftRef} onScroll={handleLeftScroll} className="h-full overflow-auto rounded-xl bg-white ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800">
                <img src={baselineUrl} className="block" />
              </div>
              <div ref={rightRef} onScroll={handleRightScroll} className="h-full overflow-auto rounded-xl bg-white ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800">
                <img src={currentUrl} className="block" />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DiffViewer;

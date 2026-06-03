import { useState } from "react";
import { Check, X, Columns, Layers, SlidersHorizontal, Image as ImageIcon, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const RunReport = () => {
  const [viewMode, setViewMode] = useState("side-by-side"); // side-by-side, overlay, swipe, diff
  const [swipePosition, setSwipePosition] = useState(50);
  
  // Dummy image placeholders with distinct colors for diffing visualization
  const baselineImg = "https://placehold.co/800x600/1e293b/ffffff?text=Baseline+UI";
  const currentImg = "https://placehold.co/800x600/0f172a/f8fafc?text=Current+UI+(Changes)";
  const diffImg = "https://placehold.co/800x600/ef4444/ffffff?text=Diff+Highlight";

  return (
    <div className="flex flex-col h-full -m-6"> {/* Negative margin to expand to layout edges */}
      {/* Top Bar */}
      <div className="bg-primary border-b border-border p-4 flex items-center justify-between shrink-0 sticky top-0 z-20 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-primary">SC-01: Homepage Hero Section</h1>
            <span className="bg-danger/10 text-danger border border-danger/20 text-xs px-2 py-0.5 rounded-full font-medium">Failed</span>
          </div>
          <div className="text-sm text-secondary mt-1 flex items-center gap-4">
            <span>Run #1044</span>
            <span>Resolution: 1920x1080</span>
            <span>Diff: <span className="text-danger font-mono font-medium">1.2%</span> (Threshold: 0.1%)</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-primary border border-danger text-danger rounded-md text-sm font-medium hover:bg-danger hover:text-white transition-colors flex items-center gap-2">
            <X className="w-4 h-4" /> Mark as Bug
          </button>
          <button className="px-4 py-2 bg-success text-white rounded-md text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-sm shadow-success/20">
            <Check className="w-4 h-4" /> Approve as Baseline
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-secondary border-b border-border p-2 flex justify-center shrink-0">
        <div className="bg-primary border border-border rounded-lg p-1 flex gap-1 shadow-sm">
          <button 
            onClick={() => setViewMode("side-by-side")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${viewMode === 'side-by-side' ? 'bg-secondary text-primary shadow-sm border border-border/50' : 'text-secondary hover:text-primary'}`}
          >
            <Columns className="w-4 h-4" /> Side by Side
          </button>
          <button 
            onClick={() => setViewMode("overlay")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${viewMode === 'overlay' ? 'bg-secondary text-primary shadow-sm border border-border/50' : 'text-secondary hover:text-primary'}`}
          >
            <Layers className="w-4 h-4" /> Overlay
          </button>
          <button 
            onClick={() => setViewMode("swipe")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${viewMode === 'swipe' ? 'bg-secondary text-primary shadow-sm border border-border/50' : 'text-secondary hover:text-primary'}`}
          >
            <SlidersHorizontal className="w-4 h-4" /> Swipe
          </button>
          <button 
            onClick={() => setViewMode("diff")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${viewMode === 'diff' ? 'bg-danger/10 text-danger shadow-sm border border-danger/20' : 'text-secondary hover:text-danger'}`}
          >
            <ImageIcon className="w-4 h-4" /> Diff Highlight
          </button>
        </div>
      </div>

      {/* Viewer Area */}
      <div className="flex-1 bg-[url('https://transparenttextures.com/patterns/cubes.png')] dark:bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] bg-tertiary overflow-auto p-8 flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          {viewMode === "side-by-side" && (
            <motion.div 
              key="side-by-side"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex gap-8 items-start justify-center w-full max-w-7xl"
            >
              <div className="flex-1 bg-primary border border-border rounded-lg shadow-lg overflow-hidden">
                <div className="bg-secondary border-b border-border px-4 py-2 text-sm font-medium text-secondary flex items-center justify-between">
                  Baseline
                  <span className="text-xs font-mono bg-tertiary px-2 py-0.5 rounded border border-border">master (2 days ago)</span>
                </div>
                <img src={baselineImg} alt="Baseline" className="w-full object-cover" />
              </div>
              <div className="flex-1 bg-primary border border-border rounded-lg shadow-lg overflow-hidden ring-2 ring-danger/50">
                <div className="bg-danger/5 border-b border-danger/20 px-4 py-2 text-sm font-medium text-danger flex items-center justify-between">
                  Current
                  <span className="text-xs font-mono bg-danger/10 px-2 py-0.5 rounded border border-danger/20">feature/header (now)</span>
                </div>
                <img src={currentImg} alt="Current" className="w-full object-cover" />
              </div>
            </motion.div>
          )}

          {viewMode === "overlay" && (
            <motion.div 
              key="overlay"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-4xl bg-primary border border-border rounded-lg shadow-lg overflow-hidden"
            >
              <img src={baselineImg} alt="Baseline" className="w-full object-cover opacity-50 absolute inset-0 mix-blend-difference" />
              <img src={currentImg} alt="Current" className="w-full object-cover opacity-50" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-primary/90 backdrop-blur-sm border border-border text-primary text-xs px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                <Info className="w-4 h-4 text-accent" />
                Overlay mode blends both images.
              </div>
            </motion.div>
          )}

          {viewMode === "swipe" && (
            <motion.div 
              key="swipe"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-4xl bg-primary border border-border rounded-lg shadow-lg overflow-hidden cursor-ew-resize select-none"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                setSwipePosition((x / rect.width) * 100);
              }}
            >
              <img src={baselineImg} alt="Baseline" className="w-full object-cover" />
              <div 
                className="absolute top-0 bottom-0 left-0 overflow-hidden border-r-2 border-accent"
                style={{ width: `${swipePosition}%` }}
              >
                <img src={currentImg} alt="Current" className="max-w-none h-full object-cover" style={{ width: '100vw', maxWidth: '896px' }} />
              </div>
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-accent rounded-full text-white flex items-center justify-center shadow-lg -ml-4"
                style={{ left: `${swipePosition}%` }}
              >
                <SlidersHorizontal className="w-4 h-4 rotate-90" />
              </div>
              <div className="absolute top-4 left-4 bg-primary/90 text-primary text-xs px-2 py-1 rounded border border-border backdrop-blur">Current</div>
              <div className="absolute top-4 right-4 bg-primary/90 text-primary text-xs px-2 py-1 rounded border border-border backdrop-blur">Baseline</div>
            </motion.div>
          )}

          {viewMode === "diff" && (
            <motion.div 
              key="diff"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-4xl bg-primary border border-danger/50 rounded-lg shadow-lg overflow-hidden ring-4 ring-danger/10"
            >
              <img src={diffImg} alt="Diff" className="w-full object-cover" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-primary/90 backdrop-blur-sm border border-border text-primary text-xs px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                <div className="w-3 h-3 bg-danger rounded-full"></div>
                Red areas indicate pixel mismatches
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RunReport;

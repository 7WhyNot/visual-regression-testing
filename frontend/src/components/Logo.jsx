import { motion } from "framer-motion";

const Logo = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.div 
        className="relative w-8 h-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Abstract Eye / Intersection Concept for Visual Regression */}
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect x="4" y="8" width="16" height="16" rx="4" className="stroke-accent" strokeWidth="2" strokeOpacity="0.5" />
          <rect x="12" y="8" width="16" height="16" rx="4" className="stroke-accent" strokeWidth="2" />
          <path d="M16 4V28" className="stroke-accent" strokeWidth="2" strokeDasharray="4 4" />
        </svg>
      </motion.div>
      <span className="font-bold text-lg tracking-tight text-primary">VRT Hub</span>
    </div>
  );
};

export default Logo;

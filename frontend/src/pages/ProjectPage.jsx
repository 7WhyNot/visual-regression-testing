import { motion } from "framer-motion";
import { Play, Settings, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";

const scenarios = [
  { id: "SC-01", name: "Homepage Hero Section", url: "/", resolutions: ["1920x1080", "390x844"], threshold: "0.1%", lastRun: "Failed" },
  { id: "SC-02", name: "Product Details Layout", url: "/product/shoes-1", resolutions: ["1920x1080"], threshold: "0.5%", lastRun: "Passed" },
  { id: "SC-03", name: "Checkout Form", url: "/checkout", resolutions: ["1920x1080", "390x844"], threshold: "0.0%", lastRun: "Passed" },
  { id: "SC-04", name: "User Dashboard Auth", url: "/account", resolutions: ["1920x1080"], threshold: "0.1%", lastRun: "Running" },
];

const ProjectPage = () => {
  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-primary">E-commerce App</h1>
            <span className="bg-tertiary border border-border text-xs px-2 py-1 rounded-md text-secondary">ID: PRJ-928</span>
          </div>
          <p className="text-secondary mt-1">Manage visual test scenarios and view test runs for this project.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-primary border border-border rounded-md text-sm font-medium text-secondary hover:text-primary hover:bg-secondary transition-colors flex items-center gap-2">
            <Settings className="w-4 h-4" /> Settings
          </button>
          <button className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent-hover transition-colors flex items-center gap-2 shadow-sm shadow-accent/20">
            <Play className="w-4 h-4" fill="currentColor" /> Trigger Manual Run
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
            {scenarios.map((scenario, idx) => (
              <motion.tr 
                key={scenario.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="hover:bg-secondary transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-primary">{scenario.name}</div>
                  <div className="text-xs text-secondary mt-0.5">{scenario.id}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-xs bg-tertiary px-2 py-1 rounded border border-border text-secondary">{scenario.url}</span>
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
                  {scenario.lastRun === "Failed" ? (
                    <Link to="/run/1044" className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20 transition-colors">
                      Failed (View)
                    </Link>
                  ) : (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                    ${scenario.lastRun === 'Passed' ? 'bg-success/10 text-success border-success/20' : 
                      'bg-warning/10 text-warning border-warning/20'}`}>
                    {scenario.lastRun}
                  </span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectPage;

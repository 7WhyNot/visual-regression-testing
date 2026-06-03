import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, Layers, Activity } from "lucide-react";

const stats = [
  { label: "Total Scenarios", value: "1,248", icon: Layers, color: "text-accent" },
  { label: "Passed (24h)", value: "1,102", icon: CheckCircle, color: "text-success" },
  { label: "Failed", value: "146", icon: XCircle, color: "text-danger" },
  { label: "Avg Run Time", value: "2.4m", icon: Clock, color: "text-warning" },
];

const recentRuns = [
  { id: "#1045", project: "E-commerce App", branch: "main", status: "Running", time: "Just now" },
  { id: "#1044", project: "E-commerce App", branch: "feature/checkout", status: "Failed", time: "10 mins ago" },
  { id: "#1043", project: "Marketing Site", branch: "main", status: "Passed", time: "1 hour ago" },
  { id: "#1042", project: "Admin Portal", branch: "fix/table-sort", status: "Passed", time: "2 hours ago" },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h1>
          <p className="text-secondary mt-1">Overview of your visual regression tests across all projects.</p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="bg-primary border border-border p-6 rounded-xl shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-secondary text-sm font-medium">{stat.label}</p>
              <h3 className="text-3xl font-bold mt-2 text-primary">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-full bg-tertiary ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity Timeline */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-primary border border-border rounded-xl shadow-sm overflow-hidden mt-8"
      >
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <Activity className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-primary">Recent Activity</h2>
        </div>
        <div className="divide-y divide-border">
          {recentRuns.map((run) => (
            <div key={run.id} className="p-6 flex items-center justify-between hover:bg-secondary transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${
                  run.status === "Passed" ? "bg-success" : 
                  run.status === "Failed" ? "bg-danger" : "bg-warning animate-pulse"
                }`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-primary">{run.project}</span>
                    <span className="text-xs text-secondary bg-tertiary px-2 py-0.5 rounded-full border border-border">{run.id}</span>
                  </div>
                  <p className="text-sm text-secondary mt-1">Branch: <span className="font-mono text-xs">{run.branch}</span></p>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                  ${run.status === 'Passed' ? 'bg-success/10 text-success border-success/20' : 
                    run.status === 'Failed' ? 'bg-danger/10 text-danger border-danger/20' : 
                    'bg-warning/10 text-warning border-warning/20'}`}>
                  {run.status}
                </span>
                <p className="text-xs text-secondary mt-2 opacity-0 group-hover:opacity-100 transition-opacity">{run.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;

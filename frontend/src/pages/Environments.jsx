import { Server } from "lucide-react";

const Environments = () => {
  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Environments</h1>
        <p className="text-secondary mt-1">Manage staging and production testing environments.</p>
      </header>

      <div className="bg-primary border border-border p-12 rounded-xl shadow-sm text-center">
        <Server className="w-12 h-12 text-secondary mx-auto mb-4 opacity-50" />
        <h2 className="text-xl font-medium text-primary mb-2">Coming Soon</h2>
        <p className="text-secondary max-w-md mx-auto">
          The Environments feature is currently under development. Soon you'll be able to map test scenarios to multiple deployment URLs (e.g., Staging, Pre-prod, Production) to run visual regressions across different stages of your pipeline.
        </p>
      </div>
    </div>
  );
};

export default Environments;

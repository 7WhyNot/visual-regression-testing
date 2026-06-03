import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Database, HardDrive, KeyRound, MonitorSmartphone, Save } from "lucide-react";

const Settings = () => {
  const [saving, setSaving] = useState(false);
  
  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    // Simulate save
    setTimeout(() => {
      setSaving(false);
      toast.success("Настройки успешно сохранены");
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-gray-950">Настройки системы</h1>
        <p className="mt-2 text-sm text-gray-500">Управление конфигурацией инфраструктуры и параметров тестирования.</p>
      </section>

      <form onSubmit={handleSave} className="space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
        >
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">База данных PostgreSQL</h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Хост</label>
                <input type="text" defaultValue="localhost" className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Порт</label>
                <input type="number" defaultValue={5432} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Имя базы данных</label>
              <input type="text" defaultValue="vrt_db" className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
        >
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg text-orange-700">
              <HardDrive className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">S3 Хранилище (MinIO)</h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint</label>
                <input type="text" defaultValue="localhost:9000" className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bucket Name</label>
                <input type="text" defaultValue="vrt-bucket" className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Root User</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input type="text" defaultValue="minioadmin" className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm text-gray-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input type="password" defaultValue="minioadmin" className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm text-gray-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
        >
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
              <MonitorSmartphone className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Браузерный движок</h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Допустимая погрешность (%)</label>
                <input type="number" step="0.01" defaultValue={0.1} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Таймаут (мс)</label>
                <input type="number" defaultValue={15000} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-600/25 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
          >
            <Save className="h-5 w-5" />
            {saving ? "Сохранение..." : "Сохранить настройки"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;

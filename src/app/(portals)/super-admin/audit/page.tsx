import React from 'react';
import { Activity, Search, Filter, AlertCircle, CheckCircle, Info } from 'lucide-react';

const logs = [
  { id: 1, action: 'Role Changed', user: 'super.admin@vaadakaro.in', target: 'rajesh.k@gov.in → OFFICER', time: '2026-06-29 14:32', type: 'warning' },
  { id: 2, action: 'User Created', user: 'super.admin@vaadakaro.in', target: 'neha.l@gmail.com (LAWYER)', time: '2026-06-29 13:10', type: 'success' },
  { id: 3, action: 'Login Attempt Failed', user: 'unknown@gmail.com', target: '/admin/dashboard', time: '2026-06-29 12:05', type: 'error' },
  { id: 4, action: 'Department Created', user: 'admin@gov.in', target: 'New Dept: Roads & Transport', time: '2026-06-28 18:22', type: 'info' },
  { id: 5, action: 'Report Generated', user: 'rajesh.k@gov.in', target: 'Monthly Report June 2026', time: '2026-06-28 15:00', type: 'info' },
  { id: 6, action: 'User Deactivated', user: 'super.admin@vaadakaro.in', target: 'dept.a@gov.in', time: '2026-06-27 09:45', type: 'warning' },
];

const typeConfig: Record<string, { icon: typeof AlertCircle; color: string; bg: string }> = {
  success: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  warning: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  error: { icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10' },
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
};

export default function SuperAdminAuditPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">

        <header>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <Activity className="text-amber-500" size={30} />
            Audit Logs
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track all platform actions and security events.</p>
        </header>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 flex-1 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2">
              <Search size={16} className="text-slate-400" />
              <span className="text-sm text-slate-400">Search logs...</span>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-400">
              <Filter size={14} /> Type
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {logs.map((log) => {
              const cfg = typeConfig[log.type];
              const Icon = cfg.icon;
              return (
                <div key={log.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                  <div className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}>
                    <Icon size={16} className={cfg.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">{log.action}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      By <span className="font-medium text-slate-600 dark:text-slate-400">{log.user}</span> → {log.target}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">{log.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

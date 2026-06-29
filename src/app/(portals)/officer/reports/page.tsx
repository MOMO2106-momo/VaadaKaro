import React from 'react';
import { FileText, Download, Calendar, BarChart2 } from 'lucide-react';

const reports = [
  { id: 1, title: 'My Cases Summary – June 2026', date: '2026-06-28', size: '0.8 MB', status: 'Ready' },
  { id: 2, title: 'Verified Documents – Q2 2026', date: '2026-06-20', size: '1.2 MB', status: 'Ready' },
  { id: 3, title: 'Resolution Time Analysis', date: '2026-06-15', size: '0.5 MB', status: 'Ready' },
  { id: 4, title: 'Citizen Feedback Report', date: '2026-06-10', size: '2.1 MB', status: 'Generating' },
];

export default function OfficerReportsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-6">

        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <FileText className="text-teal-500" size={30} />
              My Reports
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Download reports on your cases and performance.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold text-sm transition shadow">
            <BarChart2 size={16} />
            Generate Report
          </button>
        </header>

        {/* Performance Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Cases Handled', value: '24', color: 'text-blue-500' },
            { label: 'Avg Resolution Time', value: '2.1 days', color: 'text-purple-500' },
            { label: 'Satisfaction Rate', value: '94%', color: 'text-emerald-500' },
          ].map((s) => (
            <div key={s.label} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-1 font-semibold">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Reports List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="font-bold text-slate-900 dark:text-slate-100">Available Reports</h2>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {reports.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-50 dark:bg-teal-500/10 rounded-xl flex items-center justify-center">
                    <FileText size={18} className="text-teal-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{r.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{r.date} · {r.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${r.status === 'Ready' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'}`}>
                    {r.status}
                  </span>
                  {r.status === 'Ready' && (
                    <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-400 hover:text-teal-500 text-slate-500 transition">
                      <Download size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

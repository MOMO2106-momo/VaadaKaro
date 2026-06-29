import React from 'react';
import { FileText, Download, Calendar, Filter } from 'lucide-react';

const reports = [
  { id: 1, title: 'Monthly Grievance Summary – June 2026', type: 'Monthly', date: '2026-06-28', size: '2.4 MB', status: 'Ready' },
  { id: 2, title: 'Department Performance Q2 2026', type: 'Quarterly', date: '2026-06-25', size: '5.1 MB', status: 'Ready' },
  { id: 3, title: 'Officer Activity Report – June 2026', type: 'Monthly', date: '2026-06-22', size: '1.8 MB', status: 'Ready' },
  { id: 4, title: 'Category-wise Complaint Analysis', type: 'Ad-hoc', date: '2026-06-18', size: '0.9 MB', status: 'Ready' },
  { id: 5, title: 'Annual Report 2025-26', type: 'Annual', date: '2026-06-01', size: '12.3 MB', status: 'Generating' },
];

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">

        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <FileText className="text-teal-500" size={30} />
              Reports
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Generate and download official grievance reports.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold text-sm transition shadow">
            <Calendar size={16} />
            Generate Report
          </button>
        </header>

        {/* Quick generate cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Monthly Report', desc: 'Complaints, resolutions, department stats for current month', color: 'bg-blue-600', icon: '📊' },
            { title: 'Quarterly Report', desc: 'Comprehensive Q2 2026 performance analysis', color: 'bg-purple-600', icon: '📈' },
            { title: 'Custom Report', desc: 'Choose date range, departments, and categories', color: 'bg-teal-600', icon: '🛠️' },
          ].map((r) => (
            <div key={r.title} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition cursor-pointer group">
              <span className="text-3xl">{r.icon}</span>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mt-3">{r.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{r.desc}</p>
              <button className={`mt-4 w-full py-2 ${r.color} hover:opacity-90 text-white text-sm font-semibold rounded-xl transition`}>
                Generate
              </button>
            </div>
          ))}
        </div>

        {/* Reports list */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="font-bold text-slate-900 dark:text-slate-100">Recent Reports</h2>
            <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              <Filter size={14} />
              Filter
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-teal-50 dark:bg-teal-500/10 rounded-xl flex items-center justify-center">
                    <FileText size={18} className="text-teal-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{report.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{report.type} · {report.date} · {report.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${report.status === 'Ready' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'}`}>
                    {report.status}
                  </span>
                  {report.status === 'Ready' && (
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

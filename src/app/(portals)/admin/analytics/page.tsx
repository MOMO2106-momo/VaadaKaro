import React from 'react';
import { Activity, TrendingUp, TrendingDown, Users, FileText, CheckCircle, Clock } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">

        <header>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <Activity className="text-sky-500" size={30} />
            Analytics Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Grievance trends and performance metrics.</p>
        </header>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Complaints', value: '1,240', change: '+12%', up: true, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
            { label: 'Resolved', value: '988', change: '+8%', up: true, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
            { label: 'Pending', value: '189', change: '-5%', up: false, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
            { label: 'Active Citizens', value: '4,821', change: '+22%', up: true, icon: Users, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <div className={`w-10 h-10 ${kpi.bg} rounded-xl flex items-center justify-center mb-3`}>
                <kpi.icon size={20} className={kpi.color} />
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{kpi.label}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{kpi.value}</p>
              <div className={`flex items-center gap-1 mt-1 text-xs font-semibold ${kpi.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                {kpi.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {kpi.change} this month
              </div>
            </div>
          ))}
        </div>

        {/* Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar chart placeholder */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Complaints by Category</h2>
            <div className="space-y-3">
              {[
                { name: 'Infrastructure', pct: 85, color: '#3b82f6' },
                { name: 'Sanitation', pct: 70, color: '#10b981' },
                { name: 'Electricity', pct: 55, color: '#f59e0b' },
                { name: 'Water Supply', pct: 62, color: '#6366f1' },
                { name: 'Roads', pct: 42, color: '#ef4444' },
              ].map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">{item.name}</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{item.pct}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resolution Rate */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Monthly Resolution Rate</h2>
            <div className="flex items-end gap-2 h-40">
              {[65, 72, 58, 80, 75, 88, 91, 85, 92, 78, 95, 88].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md"
                    style={{ height: `${h}%`, backgroundColor: h > 85 ? '#10b981' : h > 70 ? '#3b82f6' : '#f59e0b' }}
                  />
                  <span className="text-[9px] text-slate-400">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performing Departments */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Department Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="pb-3 px-2">Department</th>
                  <th className="pb-3 px-2">Total Cases</th>
                  <th className="pb-3 px-2">Resolved</th>
                  <th className="pb-3 px-2">Avg. Resolution Time</th>
                  <th className="pb-3 px-2">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  { dept: 'Public Works', total: 320, resolved: 295, time: '2.3 days', score: 92 },
                  { dept: 'Sanitation', total: 280, resolved: 248, time: '1.8 days', score: 89 },
                  { dept: 'Water Supply', total: 210, resolved: 178, time: '3.1 days', score: 76 },
                  { dept: 'Electricity', total: 195, resolved: 144, time: '4.2 days', score: 68 },
                  { dept: 'Roads', total: 180, resolved: 123, time: '5.0 days', score: 61 },
                ].map((row) => (
                  <tr key={row.dept} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                    <td className="py-3 px-2 font-medium text-slate-900 dark:text-slate-100">{row.dept}</td>
                    <td className="py-3 px-2 text-slate-600 dark:text-slate-400">{row.total}</td>
                    <td className="py-3 px-2 text-emerald-600 dark:text-emerald-400 font-semibold">{row.resolved}</td>
                    <td className="py-3 px-2 text-slate-600 dark:text-slate-400">{row.time}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${row.score >= 85 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : row.score >= 70 ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'}`}>
                        {row.score}/100
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

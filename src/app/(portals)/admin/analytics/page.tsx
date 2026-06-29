import React from 'react';
import { BarChart2, TrendingUp, FileText, Download, ShieldAlert } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const MONTHLY = [
  { month: 'Jan', filed: 82, resolved: 71 },
  { month: 'Feb', filed: 94, resolved: 88 },
  { month: 'Mar', filed: 110, resolved: 99 },
  { month: 'Apr', filed: 78, resolved: 70 },
  { month: 'May', filed: 130, resolved: 115 },
  { month: 'Jun', filed: 145, resolved: 128 },
];

const DEPT_STATS = [
  { dept: 'Public Works', complaints: 128, resolved: 102, rate: 80 },
  { dept: 'Sanitation', complaints: 94, resolved: 88, rate: 94 },
  { dept: 'Electricity', complaints: 76, resolved: 75, rate: 99 },
  { dept: 'Water Supply', complaints: 65, resolved: 58, rate: 89 },
  { dept: 'Roads', complaints: 41, resolved: 30, rate: 73 },
];

export default function AnalyticsPage() {
  const maxFiled = Math.max(...MONTHLY.map(m => m.filed));
  return (
    <div className="flex flex-col gap-10 min-h-screen bg-[#020817] text-white p-6 md:p-10">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-4 border-b border-slate-800/80">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
            <ShieldAlert className="text-purple-400" size={16} />
            Platform Analytics
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Analytics & Insights</h1>
          <p className="text-slate-400 text-[15px] leading-relaxed">AI-powered insights, complaint heatmaps, and resolution metrics.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-purple-500/10">
          <Download size={16} /> Export Report
        </button>
      </header>

      {/* KPI stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Filed (YTD)', value: '639', change: '+12%', color: 'text-blue-400' },
          { label: 'Total Resolved', value: '571', change: '+18%', color: 'text-emerald-400' },
          { label: 'Avg Resolution Time', value: '2.1d', change: '-0.4d', color: 'text-amber-400' },
          { label: 'Platform Satisfaction', value: '94%', change: '+3%', color: 'text-purple-400' },
        ].map((s) => (
          <div key={s.label} className="bg-[#0F172A] rounded-xl p-5 border border-slate-800">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
            <p className={`text-3xl font-black mt-1.5 ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-emerald-400 font-bold mt-1 flex items-center gap-1"><TrendingUp size={10} />{s.change} vs last period</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Monthly Volume Chart */}
        <Card padding="lg" className="bg-[#0F172A] border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
            <BarChart2 className="text-blue-400" size={20} /> Monthly Volume
          </h2>
          <div className="flex items-end gap-3 h-40">
            {MONTHLY.map((m) => (
              <div key={m.month} className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full flex gap-1 items-end" style={{ height: '100px' }}>
                  <div className="flex-1 bg-blue-500/20 border border-blue-500/30 rounded-t-md" style={{ height: `${(m.filed / maxFiled) * 100}%` }} />
                  <div className="flex-1 bg-emerald-500/20 border border-emerald-500/30 rounded-t-md" style={{ height: `${(m.resolved / maxFiled) * 100}%` }} />
                </div>
                <span className="text-[10px] font-bold text-slate-500">{m.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-500/30 border border-blue-500/40" /><span className="text-xs text-slate-400 font-semibold">Filed</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/40" /><span className="text-xs text-slate-400 font-semibold">Resolved</span></div>
          </div>
        </Card>

        {/* Department Resolution Rates */}
        <Card padding="lg" className="bg-[#0F172A] border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
            <FileText className="text-emerald-400" size={20} /> Department Resolution Rates
          </h2>
          <div className="space-y-4">
            {DEPT_STATS.map((d) => (
              <div key={d.dept}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold text-slate-300">{d.dept}</span>
                  <span className={`font-black ${d.rate >= 90 ? 'text-emerald-400' : d.rate >= 80 ? 'text-amber-400' : 'text-rose-400'}`}>{d.rate}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div className={`h-full rounded-full ${d.rate >= 90 ? 'bg-emerald-500' : d.rate >= 80 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${d.rate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

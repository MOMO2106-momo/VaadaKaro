'use client';
import React, { useState } from 'react';
import { BarChart2, TrendingUp, TrendingDown, FileText, Download, ShieldAlert, Users, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const DATA: Record<string, { monthly: {month:string;filed:number;resolved:number}[]; kpis: {label:string;value:string;change:string;up:boolean;color:string}[]; deptStats: {dept:string;complaints:number;resolved:number;rate:number}[] }> = {
  'This Week': {
    monthly: [
      { month: 'Mon', filed: 12, resolved: 10 },
      { month: 'Tue', filed: 18, resolved: 15 },
      { month: 'Wed', filed: 9, resolved: 9 },
      { month: 'Thu', filed: 22, resolved: 18 },
      { month: 'Fri', filed: 16, resolved: 14 },
      { month: 'Sat', filed: 6, resolved: 5 },
      { month: 'Sun', filed: 3, resolved: 3 },
    ],
    kpis: [
      { label: 'Filed (This Week)', value: '86', change: '+4%', up: true, color: 'text-blue-400' },
      { label: 'Resolved', value: '74', change: '+9%', up: true, color: 'text-emerald-400' },
      { label: 'Avg Resolution Time', value: '1.8d', change: '-0.3d', up: true, color: 'text-amber-400' },
      { label: 'Satisfaction', value: '96%', change: '+2%', up: true, color: 'text-purple-400' },
    ],
    deptStats: [
      { dept: 'Public Works', complaints: 28, resolved: 23, rate: 82 },
      { dept: 'Sanitation', complaints: 19, resolved: 18, rate: 95 },
      { dept: 'Electricity', complaints: 17, resolved: 17, rate: 100 },
      { dept: 'Water Supply', complaints: 13, resolved: 11, rate: 85 },
      { dept: 'Roads', complaints: 9, resolved: 5, rate: 56 },
    ],
  },
  'This Month': {
    monthly: [
      { month: 'W1', filed: 82, resolved: 71 },
      { month: 'W2', filed: 94, resolved: 88 },
      { month: 'W3', filed: 78, resolved: 70 },
      { month: 'W4', filed: 145, resolved: 128 },
    ],
    kpis: [
      { label: 'Filed (June)', value: '399', change: '+12%', up: true, color: 'text-blue-400' },
      { label: 'Resolved', value: '357', change: '+18%', up: true, color: 'text-emerald-400' },
      { label: 'Avg Resolution Time', value: '2.1d', change: '-0.4d', up: true, color: 'text-amber-400' },
      { label: 'Satisfaction', value: '94%', change: '+3%', up: true, color: 'text-purple-400' },
    ],
    deptStats: [
      { dept: 'Public Works', complaints: 128, resolved: 102, rate: 80 },
      { dept: 'Sanitation', complaints: 94, resolved: 88, rate: 94 },
      { dept: 'Electricity', complaints: 76, resolved: 75, rate: 99 },
      { dept: 'Water Supply', complaints: 65, resolved: 58, rate: 89 },
      { dept: 'Roads', complaints: 41, resolved: 30, rate: 73 },
    ],
  },
  'All Time': {
    monthly: [
      { month: 'Jan', filed: 82, resolved: 71 },
      { month: 'Feb', filed: 94, resolved: 88 },
      { month: 'Mar', filed: 110, resolved: 99 },
      { month: 'Apr', filed: 78, resolved: 70 },
      { month: 'May', filed: 130, resolved: 115 },
      { month: 'Jun', filed: 145, resolved: 128 },
    ],
    kpis: [
      { label: 'Total Filed (YTD)', value: '639', change: '+22%', up: true, color: 'text-blue-400' },
      { label: 'Total Resolved', value: '571', change: '+28%', up: true, color: 'text-emerald-400' },
      { label: 'Avg Resolution Time', value: '2.3d', change: '+0.1d', up: false, color: 'text-amber-400' },
      { label: 'Satisfaction', value: '91%', change: '-1%', up: false, color: 'text-purple-400' },
    ],
    deptStats: [
      { dept: 'Public Works', complaints: 420, resolved: 310, rate: 74 },
      { dept: 'Sanitation', complaints: 310, resolved: 290, rate: 94 },
      { dept: 'Electricity', complaints: 280, resolved: 275, rate: 98 },
      { dept: 'Water Supply', complaints: 220, resolved: 190, rate: 86 },
      { dept: 'Roads', complaints: 150, resolved: 100, rate: 67 },
    ],
  },
};

type Period = 'This Week' | 'This Month' | 'All Time';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>('This Month');
  const [toast, setToast] = useState('');
  const { monthly, kpis, deptStats } = DATA[period];
  const maxFiled = Math.max(...monthly.map(m => m.filed));

  return (
    <div className="flex flex-col gap-10 min-h-screen bg-[#020817] text-white p-6 md:p-10">
      {toast && <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-semibold border border-emerald-500/20">✓ {toast}</div>}

      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-4 border-b border-slate-800/80">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
            <ShieldAlert className="text-purple-400" size={16} /> Platform Analytics
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Analytics & Insights</h1>
          <p className="text-slate-400 text-[15px] leading-relaxed">Complaint volumes, resolution rates, and department performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
            {(['This Week', 'This Month', 'All Time'] as Period[]).map(p => (
              <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${period === p ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>{p}</button>
            ))}
          </div>
          <button onClick={() => { setToast('Report exported successfully'); }} className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-purple-500/10">
            <Download size={16} /> Export
          </button>
        </div>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(s => (
          <div key={s.label} className="bg-[#0F172A] rounded-xl p-5 border border-slate-800">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
            <p className={`text-3xl font-black mt-1.5 ${s.color}`}>{s.value}</p>
            <p className={`text-[11px] font-bold mt-1 flex items-center gap-1 ${s.up ? 'text-emerald-400' : 'text-rose-400'}`}>
              {s.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}{s.change} vs last period
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Volume Chart */}
        <Card padding="lg" className="bg-[#0F172A] border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
            <BarChart2 className="text-blue-400" size={20} /> Complaint Volume — {period}
          </h2>
          <div className="flex items-end gap-2 h-44">
            {monthly.map(m => (
              <div key={m.month} className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full flex gap-0.5 items-end" style={{ height: '140px' }}>
                  <div className="flex-1 bg-blue-500/30 border border-blue-500/40 rounded-t-sm transition-all hover:bg-blue-500/50" style={{ height: `${(m.filed / maxFiled) * 100}%` }} title={`Filed: ${m.filed}`} />
                  <div className="flex-1 bg-emerald-500/30 border border-emerald-500/40 rounded-t-sm transition-all hover:bg-emerald-500/50" style={{ height: `${(m.resolved / maxFiled) * 100}%` }} title={`Resolved: ${m.resolved}`} />
                </div>
                <span className="text-[10px] font-bold text-slate-500">{m.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-500/40 border border-blue-500/50" /><span className="text-xs text-slate-400 font-semibold">Filed</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-500/40 border border-emerald-500/50" /><span className="text-xs text-slate-400 font-semibold">Resolved</span></div>
          </div>
        </Card>

        {/* Department Resolution Rates */}
        <Card padding="lg" className="bg-[#0F172A] border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
            <FileText className="text-emerald-400" size={20} /> Department Resolution Rates
          </h2>
          <div className="space-y-4">
            {deptStats.map(d => (
              <div key={d.dept}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold text-slate-300">{d.dept}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">{d.resolved}/{d.complaints}</span>
                    <span className={`font-black ${d.rate >= 90 ? 'text-emerald-400' : d.rate >= 80 ? 'text-amber-400' : 'text-rose-400'}`}>{d.rate}%</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div className={`h-full rounded-full transition-all duration-500 ${d.rate >= 90 ? 'bg-emerald-500' : d.rate >= 80 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${d.rate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Resolution Rate', value: `${Math.round((deptStats.reduce((s,d)=>s+d.resolved,0)/deptStats.reduce((s,d)=>s+d.complaints,0))*100)}%`, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Avg Officer Load', value: `${Math.round(deptStats.reduce((s,d)=>s+d.complaints,0)/26)} cases`, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'Pending in Queue', value: String(deptStats.reduce((s,d)=>s+d.complaints-d.resolved,0)), icon: BarChart2, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
        ].map(s => (
          <div key={s.label} className="bg-[#0F172A] rounded-xl p-5 border border-slate-800 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${s.bg}`}><s.icon size={18} className={s.color} /></div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
              <p className={`text-2xl font-black mt-0.5 ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

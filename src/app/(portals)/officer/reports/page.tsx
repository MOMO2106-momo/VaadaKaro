import React from 'react';
import { FileText, Download, Calendar, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const REPORTS = [
  { id: 1, title: 'My Cases Summary – June 2026', date: '2026-06-28', size: '0.8 MB', type: 'Summary', status: 'Ready' },
  { id: 2, title: 'Verified Documents – Q2 2026', date: '2026-06-20', size: '1.2 MB', type: 'Documents', status: 'Ready' },
  { id: 3, title: 'Resolution Time Analysis', date: '2026-06-15', size: '0.5 MB', type: 'Analytics', status: 'Ready' },
  { id: 4, title: 'Citizen Feedback Report', date: '2026-06-10', size: '2.1 MB', type: 'Feedback', status: 'Generating' },
];

const TYPE_COLORS: Record<string, string> = {
  Summary: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Documents: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  Analytics: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Feedback: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
};

export default function OfficerReportsPage() {
  return (
    <div className="flex flex-col gap-10 min-h-screen bg-[#020817] text-white p-6 md:p-10">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-4 border-b border-slate-800/80">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
            <ShieldCheck className="text-teal-400" size={16} />
            My Reports
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Reports & Downloads</h1>
          <p className="text-slate-400 text-[15px] leading-relaxed">Download performance summaries and case analytics for your jurisdiction.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-teal-500/10">
          <FileText size={16} /> Generate Report
        </button>
      </header>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Cases Handled', value: '24', color: 'text-blue-400' },
          { label: 'Avg Resolution', value: '2.1d', color: 'text-purple-400' },
          { label: 'Satisfaction', value: '94%', color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="bg-[#0F172A] rounded-xl p-5 border border-slate-800 text-center">
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <Card padding="lg" className="bg-[#0F172A] border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
          <FileText className="text-teal-400" size={20} /> Available Reports
        </h2>
        <div className="space-y-3">
          {REPORTS.map(r => (
            <div key={r.id} className="flex items-center justify-between p-5 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-teal-500/10 border border-teal-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <FileText size={18} className="text-teal-400" />
                </div>
                <div>
                  <p className="font-bold text-slate-200 text-sm group-hover:text-white transition-colors">{r.title}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-slate-500 flex items-center gap-1"><Calendar size={10} /> {r.date}</span>
                    <span className="text-xs text-slate-500">·</span>
                    <span className="text-xs text-slate-500">{r.size}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${TYPE_COLORS[r.type]}`}>{r.type}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${r.status === 'Ready' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20 animate-pulse'}`}>
                  {r.status}
                </span>
                {r.status === 'Ready' && (
                  <button className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-teal-500/50 hover:text-teal-400 text-slate-400 transition-all">
                    <Download size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

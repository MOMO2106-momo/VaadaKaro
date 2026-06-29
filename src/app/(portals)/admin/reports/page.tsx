import React from 'react';
import { FileText, Download, Calendar, ShieldAlert } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const REPORTS = [
  { id: 1, title: 'Monthly Department Performance – June 2026', date: '2026-06-28', size: '2.4 MB', type: 'Performance', status: 'Ready' },
  { id: 2, title: 'Complaint Resolution Rate – Q2 2026', date: '2026-06-20', size: '1.8 MB', type: 'Analytics', status: 'Ready' },
  { id: 3, title: 'Officer Activity Summary – June 2026', date: '2026-06-15', size: '0.9 MB', type: 'Officers', status: 'Ready' },
  { id: 4, title: 'Category-wise Breakdown – H1 2026', date: '2026-06-10', size: '3.1 MB', type: 'Analytics', status: 'Ready' },
  { id: 5, title: 'Citizen Satisfaction Index', date: '2026-06-05', size: '1.2 MB', type: 'Survey', status: 'Generating' },
];

const TYPE_COLORS: Record<string, string> = {
  Performance: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Analytics: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  Officers: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Survey: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
};

export default function AdminReportsPage() {
  return (
    <div className="flex flex-col gap-10 min-h-screen bg-[#020817] text-white p-6 md:p-10">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-4 border-b border-slate-800/80">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
            <ShieldAlert className="text-teal-400" size={16} />
            Reporting Center
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Reports & Exports</h1>
          <p className="text-slate-400 text-[15px] leading-relaxed">Download official departmental performance reports and analytics exports.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-teal-500/10">
          <FileText size={16} /> Generate Report
        </button>
      </header>

      {/* Platform summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Reports Available', value: 5, color: 'text-teal-400' },
          { label: 'Avg. Resolution Rate', value: '89%', color: 'text-emerald-400' },
          { label: 'Last Generated', value: 'Today', color: 'text-slate-300' },
        ].map((s) => (
          <div key={s.label} className="bg-[#0F172A] rounded-xl p-5 border border-slate-800">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
            <p className={`text-2xl font-black mt-1.5 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <Card padding="lg" className="bg-[#0F172A] border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
          <FileText className="text-teal-400" size={20} />
          Available Reports
        </h2>
        <div className="space-y-3">
          {REPORTS.map((r) => (
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
                  <button className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-teal-500/50 hover:bg-teal-500/5 text-slate-400 hover:text-teal-400 transition-all">
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

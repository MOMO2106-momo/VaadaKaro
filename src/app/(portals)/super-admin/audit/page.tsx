import React from 'react';
import { Activity, Search, AlertCircle, CheckCircle, Info, Key } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const LOGS = [
  { id: 1, action: 'Role Changed', user: 'super.admin@vaadakaro.in', target: 'rajesh.k@gov.in → OFFICER', time: '2026-06-29 14:21', type: 'warning' },
  { id: 2, action: 'User Suspended', user: 'super.admin@vaadakaro.in', target: 'ajay.verma@gov.in', time: '2026-06-29 13:05', type: 'critical' },
  { id: 3, action: 'New Department Created', user: 'super.admin@vaadakaro.in', target: 'Transport Auth (DTC)', time: '2026-06-29 11:50', type: 'info' },
  { id: 4, action: 'Admin Login', user: 'sunita.s@gov.in', target: 'IP 103.22.44.1', time: '2026-06-28 09:15', type: 'info' },
  { id: 5, action: 'Password Reset', user: 'super.admin@vaadakaro.in', target: 'deepa.nair@gov.in', time: '2026-06-27 17:00', type: 'warning' },
  { id: 6, action: 'Complaint Category Disabled', user: 'sunita.s@gov.in', target: 'Parks & Open Spaces', time: '2026-06-26 12:30', type: 'critical' },
  { id: 7, action: 'New Officer Added', user: 'sunita.s@gov.in', target: 'kiran.patel@gov.in → Public Works', time: '2026-06-25 10:20', type: 'success' },
];

const TYPE_CONFIG = {
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  warning: { icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  critical: { icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
  success: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
};

export default function SuperAdminAuditPage() {
  return (
    <div className="flex flex-col gap-10 min-h-screen bg-[#020817] text-white p-6 md:p-10">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-4 border-b border-slate-800/80">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
            <Key className="text-rose-400" size={16} />
            Audit & Compliance
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Audit Logs</h1>
          <p className="text-slate-400 text-[15px] leading-relaxed">Immutable records of all administrative actions on the platform.</p>
        </div>
      </header>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: LOGS.length, color: 'text-white' },
          { label: 'Critical', value: LOGS.filter(l => l.type === 'critical').length, color: 'text-rose-400' },
          { label: 'Warnings', value: LOGS.filter(l => l.type === 'warning').length, color: 'text-amber-400' },
          { label: 'Info', value: LOGS.filter(l => l.type === 'info').length, color: 'text-blue-400' },
        ].map(s => (
          <div key={s.label} className="bg-[#0F172A] rounded-xl p-5 border border-slate-800 text-center">
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <Card padding="lg" className="bg-[#0F172A] border-slate-800">
        <div className="flex items-center gap-2 mb-6 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 max-w-sm">
          <Search size={15} className="text-slate-500" />
          <input className="bg-transparent flex-1 text-sm text-slate-300 placeholder-slate-500 outline-none" placeholder="Search audit logs..." />
        </div>
        <div className="space-y-3">
          {LOGS.map(log => {
            const t = TYPE_CONFIG[log.type as keyof typeof TYPE_CONFIG];
            return (
              <div key={log.id} className="flex items-center gap-4 p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${t.bg}`}>
                  <t.icon size={16} className={t.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-slate-200 text-sm">{log.action}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold uppercase ${t.bg} ${t.color}`}>{log.type}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate"><span className="text-slate-400">{log.user}</span> &rarr; <span className="font-mono text-slate-400">{log.target}</span></p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
                  <Activity size={11} /> {log.time}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

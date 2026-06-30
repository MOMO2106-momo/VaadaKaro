'use client';
import React, { useState } from 'react';
import { Activity, Search, AlertCircle, CheckCircle, Info, Key, Download, Filter } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const ALL_LOGS = [
  { id: 1, action: 'Role Changed', user: 'super.admin@vaadakaro.in', target: 'rajesh.k@gov.in → OFFICER', time: '2026-06-29 14:21', type: 'warning' },
  { id: 2, action: 'User Suspended', user: 'super.admin@vaadakaro.in', target: 'ajay.verma@gov.in', time: '2026-06-29 13:05', type: 'critical' },
  { id: 3, action: 'New Department Created', user: 'super.admin@vaadakaro.in', target: 'Transport Auth (DTC)', time: '2026-06-29 11:50', type: 'info' },
  { id: 4, action: 'Admin Login', user: 'sunita.s@gov.in', target: 'IP 103.22.44.1', time: '2026-06-28 09:15', type: 'info' },
  { id: 5, action: 'Password Reset', user: 'super.admin@vaadakaro.in', target: 'deepa.nair@gov.in', time: '2026-06-27 17:00', type: 'warning' },
  { id: 6, action: 'Complaint Category Disabled', user: 'sunita.s@gov.in', target: 'Parks & Open Spaces', time: '2026-06-26 12:30', type: 'critical' },
  { id: 7, action: 'New Officer Added', user: 'sunita.s@gov.in', target: 'kiran.patel@gov.in → Public Works', time: '2026-06-25 10:20', type: 'success' },
  { id: 8, action: 'System Settings Updated', user: 'super.admin@vaadakaro.in', target: 'Maintenance Mode → OFF', time: '2026-06-24 08:05', type: 'info' },
  { id: 9, action: 'JWT Keys Rotated', user: 'super.admin@vaadakaro.in', target: 'RS256 Key — Scheduled', time: '2026-06-23 00:00', type: 'success' },
  { id: 10, action: 'User Account Deleted', user: 'super.admin@vaadakaro.in', target: 'test.user123@gmail.com', time: '2026-06-22 16:45', type: 'critical' },
];

const TYPE_CONFIG = {
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Info' },
  warning: { icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', label: 'Warning' },
  critical: { icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20', label: 'Critical' },
  success: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Success' },
};

type LogType = keyof typeof TYPE_CONFIG | 'all';

export default function SuperAdminAuditPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<LogType>('all');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const filtered = ALL_LOGS.filter(log => {
    const q = search.toLowerCase();
    const matchSearch = log.action.toLowerCase().includes(q) || log.user.toLowerCase().includes(q) || log.target.toLowerCase().includes(q);
    const matchType = typeFilter === 'all' || log.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="flex flex-col gap-10 min-h-screen bg-[#020817] text-white p-6 md:p-10">
      {toast && <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-semibold border border-emerald-500/20">✓ {toast}</div>}

      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-4 border-b border-slate-800/80">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
            <Key className="text-rose-400" size={16} /> Audit & Compliance
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Audit Logs</h1>
          <p className="text-slate-400 text-[15px] leading-relaxed">Immutable records of all administrative actions on the platform.</p>
        </div>
        <button onClick={() => showToast('Audit log exported as CSV')} className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl font-bold text-sm transition">
          <Download size={15} /> Export CSV
        </button>
      </header>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: ALL_LOGS.length, color: 'text-white' },
          { label: 'Critical', value: ALL_LOGS.filter(l => l.type === 'critical').length, color: 'text-rose-400' },
          { label: 'Warnings', value: ALL_LOGS.filter(l => l.type === 'warning').length, color: 'text-amber-400' },
          { label: 'Successful', value: ALL_LOGS.filter(l => l.type === 'success').length, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="bg-[#0F172A] rounded-xl p-5 border border-slate-800 text-center">
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <Card padding="lg" className="bg-[#0F172A] border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-6">
          <div className="flex items-center gap-2 flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5">
            <Search size={15} className="text-slate-500" />
            <input className="bg-transparent flex-1 text-sm text-slate-300 placeholder-slate-500 outline-none" placeholder="Search audit logs by action, user, or target..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-1.5">
            <Filter size={13} className="text-slate-500" />
            {(['all', 'critical', 'warning', 'success', 'info'] as LogType[]).map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${typeFilter === t ? 'bg-rose-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-slate-500">No audit logs match your search or filter.</div>
        )}

        <div className="space-y-3">
          {filtered.map(log => {
            const t = TYPE_CONFIG[log.type as keyof typeof TYPE_CONFIG];
            return (
              <div key={log.id} className="flex items-center gap-4 p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${t.bg}`}>
                  <t.icon size={16} className={t.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-slate-200 text-sm">{log.action}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold uppercase ${t.bg} ${t.color}`}>{t.label}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    <span className="text-slate-400">{log.user}</span> → <span className="font-mono text-slate-400">{log.target}</span>
                  </p>
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

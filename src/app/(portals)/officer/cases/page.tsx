'use client';
import React, { useState } from 'react';
import { Briefcase, Search, Eye, Clock, AlertCircle, CheckCircle, X, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const CASES_DATA = [
  { id: 'CMP-0042', title: 'Waterlogging on MG Road', citizen: 'Rahul S.', category: 'Infrastructure', priority: 'HIGH', date: '2026-06-25', status: 'In Progress' },
  { id: 'CMP-0043', title: 'Overflowing drains Sector 5', citizen: 'Priya M.', category: 'Sanitation', priority: 'CRITICAL', date: '2026-06-26', status: 'Assigned' },
  { id: 'CMP-0044', title: 'Faulty streetlights Sector 9', citizen: 'Aman V.', category: 'Electricity', priority: 'MEDIUM', date: '2026-06-27', status: 'Pending' },
  { id: 'CMP-0045', title: 'No water supply since 3 days', citizen: 'Neha K.', category: 'Water Supply', priority: 'HIGH', date: '2026-06-22', status: 'Resolved' },
  { id: 'CMP-0046', title: 'Pothole near Bus Stand', citizen: 'Suresh T.', category: 'Roads', priority: 'MEDIUM', date: '2026-06-20', status: 'In Progress' },
];
const STATUSES = ['All', 'Pending', 'Assigned', 'In Progress', 'Resolved'];

export default function OfficerCasesPage() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('All');
  const [cases, setCases] = useState(CASES_DATA);
  const [selected, setSelected] = useState<typeof CASES_DATA[0] | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const filtered = cases.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()) || c.citizen.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === 'All' || c.status === tab;
    return matchSearch && matchTab;
  });

  const updateStatus = (id: string, newStatus: string) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    showToast(`${id} marked as ${newStatus}`);
    setSelected(null);
  };

  return (
    <div className="flex flex-col gap-10 min-h-screen bg-[#020817] text-white p-6 md:p-10">
      {toast && <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-semibold border border-emerald-500/20">✓ {toast}</div>}

      {selected && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white">Case Details</h3>
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white transition"><X size={18} /></button>
            </div>
            <div className="space-y-3 mb-6 bg-slate-950 rounded-xl p-4 border border-slate-800">
              {[
                ['Case ID', <span className="font-mono font-bold text-purple-400">{selected.id}</span>],
                ['Citizen', selected.citizen],
                ['Category', selected.category],
                ['Priority', <span className={`font-bold ${selected.priority === 'CRITICAL' ? 'text-rose-400' : selected.priority === 'HIGH' ? 'text-orange-400' : 'text-blue-400'}`}>{selected.priority}</span>],
                ['Status', selected.status],
              ].map(([k, v]) => (
                <div key={String(k)} className="flex justify-between text-sm"><span className="text-slate-500">{k}</span><span className="text-slate-300">{v}</span></div>
              ))}
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Update Status</p>
            <div className="grid grid-cols-2 gap-2">
              {['In Progress', 'Resolved', 'Assigned', 'Pending'].map(s => (
                <button key={s} onClick={() => updateStatus(selected.id, s)} disabled={selected.status === s}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${selected.status === s ? 'opacity-30 cursor-not-allowed bg-slate-900 border-slate-800 text-slate-500' : s === 'Resolved' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' : s === 'In Progress' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-4 border-b border-slate-800/80">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
            <ShieldCheck className="text-purple-400" size={16} />
            Case Management
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">My Cases</h1>
          <p className="text-slate-400 text-[15px] leading-relaxed">All complaints assigned to you for resolution and follow-up.</p>
        </div>
      </header>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Cases', value: cases.length, icon: Briefcase, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
          { label: 'In Progress', value: cases.filter(c => c.status === 'In Progress').length, icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'Pending', value: cases.filter(c => c.status === 'Pending').length, icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
          { label: 'Resolved', value: cases.filter(c => c.status === 'Resolved').length, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
        ].map(s => (
          <div key={s.label} className="bg-[#0F172A] rounded-xl p-5 border border-slate-800 flex items-center gap-4">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${s.bg}`}><s.icon size={16} className={s.color} /></div>
            <div>
              <p className="text-2xl font-black text-white">{s.value}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <Card padding="lg" className="bg-[#0F172A] border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-6">
          <div className="flex items-center gap-2 flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5">
            <Search size={15} className="text-slate-500" />
            <input className="bg-transparent flex-1 text-sm text-slate-300 placeholder-slate-500 outline-none" placeholder="Search cases by ID, title, or citizen..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-1 flex-wrap">
            {STATUSES.map(s => (
              <button key={s} onClick={() => setTab(s)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${tab === s ? 'bg-purple-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'}`}>{s}</button>
            ))}
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-850 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <th className="pb-4 px-3">Case ID</th><th className="pb-4 px-3">Title</th><th className="pb-4 px-3">Citizen</th><th className="pb-4 px-3">Priority</th><th className="pb-4 px-3">Status</th><th className="pb-4 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900">
            {filtered.length === 0 && <tr><td colSpan={6} className="py-12 text-center text-slate-500">No cases found.</td></tr>}
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-slate-950/40 transition-colors">
                <td className="py-4 px-3 font-mono text-sm text-slate-500">{c.id}</td>
                <td className="py-4 px-3 text-sm font-semibold text-slate-300 max-w-[200px] truncate">{c.title}</td>
                <td className="py-4 px-3 text-sm text-slate-400">{c.citizen}</td>
                <td className="py-4 px-3"><span className={`text-xs font-black ${c.priority === 'CRITICAL' ? 'text-rose-400' : c.priority === 'HIGH' ? 'text-orange-400' : 'text-blue-400'}`}>{c.priority}</span></td>
                <td className="py-4 px-3"><span className={`px-2.5 py-0.5 rounded text-[11px] font-bold border ${c.status === 'Resolved' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : c.status === 'In Progress' ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' : c.status === 'Pending' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-blue-400 bg-blue-500/10 border-blue-500/20'}`}>{c.status}</span></td>
                <td className="py-4 px-3 text-right">
                  <button onClick={() => setSelected(c)} className="flex items-center gap-1.5 ml-auto text-xs px-3.5 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-400 hover:text-white font-bold transition-all">
                    <Eye size={12} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

'use client';
import React, { useState } from 'react';
import { Briefcase, Search, Eye, Clock, AlertCircle, CheckCircle, X } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10">
      {toast && <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-semibold">✓ {toast}</div>}

      {selected && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100">Case Details</h3>
              <button onClick={() => setSelected(null)}><X size={18} className="text-slate-400" /></button>
            </div>
            <div className="space-y-2 mb-5">
              <div className="flex justify-between"><span className="text-xs text-slate-500">Case ID</span><span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">{selected.id}</span></div>
              <div className="flex justify-between"><span className="text-xs text-slate-500">Citizen</span><span className="text-sm text-slate-700 dark:text-slate-300">{selected.citizen}</span></div>
              <div className="flex justify-between"><span className="text-xs text-slate-500">Category</span><span className="text-sm text-slate-700 dark:text-slate-300">{selected.category}</span></div>
              <div className="flex justify-between"><span className="text-xs text-slate-500">Priority</span><span className={`text-sm font-bold ${selected.priority === 'CRITICAL' ? 'text-rose-500' : selected.priority === 'HIGH' ? 'text-orange-500' : 'text-blue-500'}`}>{selected.priority}</span></div>
              <div className="flex justify-between"><span className="text-xs text-slate-500">Current Status</span><span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{selected.status}</span></div>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Update Status</p>
            <div className="grid grid-cols-2 gap-2">
              {['In Progress', 'Resolved', 'Assigned', 'Pending'].map(s => (
                <button key={s} onClick={() => updateStatus(selected.id, s)} disabled={selected.status === s}
                  className={`py-2 rounded-xl text-xs font-semibold border transition ${selected.status === s ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500' : s === 'Resolved' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' : s === 'In Progress' ? 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <Briefcase className="text-purple-500" size={30} /> My Cases
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">All complaints assigned to you for resolution.</p>
        </header>

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Cases', value: cases.length, icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
            { label: 'In Progress', value: cases.filter(c => c.status === 'In Progress').length, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
            { label: 'Pending', value: cases.filter(c => c.status === 'Pending').length, icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
            { label: 'Resolved', value: cases.filter(c => c.status === 'Resolved').length, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex items-center gap-4`}>
              <s.icon size={24} className={s.color} />
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{s.value}</p>
                <p className="text-xs text-slate-500 font-semibold">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 flex-1 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2">
              <Search size={16} className="text-slate-400" />
              <input className="bg-transparent flex-1 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 outline-none" placeholder="Search cases..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-1 flex-wrap">
              {STATUSES.map(s => (
                <button key={s} onClick={() => setTab(s)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${tab === s ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>{s}</button>
              ))}
            </div>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3">Case ID</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Citizen</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-400 text-sm">No cases found.</td></tr>}
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                  <td className="px-4 py-3 font-mono text-sm text-slate-500">{c.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100 max-w-xs truncate">{c.title}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{c.citizen}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-bold ${c.priority === 'CRITICAL' ? 'text-rose-500' : c.priority === 'HIGH' ? 'text-orange-500' : 'text-blue-500'}`}>{c.priority}</span></td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : c.status === 'In Progress' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400' : c.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'}`}>{c.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setSelected(c)} className="flex items-center gap-1 ml-auto text-xs px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-purple-400 hover:text-purple-500 transition text-slate-600 dark:text-slate-400">
                      <Eye size={12} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

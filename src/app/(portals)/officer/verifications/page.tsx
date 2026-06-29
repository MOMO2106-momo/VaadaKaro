'use client';
import React, { useState } from 'react';
import { CheckCircle2, Search, Eye, Clock, AlertCircle, X, ThumbsUp, ThumbsDown } from 'lucide-react';

const VERIFICATIONS_DATA = [
  { id: 'VER-001', citizen: 'Rahul Sharma', type: 'Identity Verification', date: '2026-06-29', status: 'Pending', priority: 'High' },
  { id: 'VER-002', citizen: 'Meena Joshi', type: 'Document Submission', date: '2026-06-28', status: 'Under Review', priority: 'Medium' },
  { id: 'VER-003', citizen: 'Aarav Singh', type: 'NOC Clearance', date: '2026-06-27', status: 'Verified', priority: 'Low' },
  { id: 'VER-004', citizen: 'Divya Rao', type: 'Address Proof', date: '2026-06-26', status: 'Pending', priority: 'High' },
  { id: 'VER-005', citizen: 'Karan Mehta', type: 'Income Certificate', date: '2026-06-25', status: 'Rejected', priority: 'Medium' },
];

export default function OfficerVerificationsPage() {
  const [search, setSearch] = useState('');
  const [verifications, setVerifications] = useState(VERIFICATIONS_DATA);
  const [selected, setSelected] = useState<typeof VERIFICATIONS_DATA[0] | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const filtered = verifications.filter(v =>
    v.citizen.toLowerCase().includes(search.toLowerCase()) ||
    v.type.toLowerCase().includes(search.toLowerCase()) ||
    v.id.toLowerCase().includes(search.toLowerCase())
  );

  const updateStatus = (id: string, newStatus: string) => {
    setVerifications(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
    showToast(`${id} ${newStatus}`);
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10">
      {toast && <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-semibold">✓ {toast}</div>}

      {selected && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100">Review Verification</h3>
              <button onClick={() => setSelected(null)}><X size={18} className="text-slate-400" /></button>
            </div>
            <div className="space-y-3 mb-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
              <div className="flex justify-between text-sm"><span className="text-slate-500">ID</span><span className="font-mono font-bold text-slate-900 dark:text-slate-100">{selected.id}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Citizen</span><span className="font-semibold text-slate-900 dark:text-slate-100">{selected.citizen}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Type</span><span className="text-slate-700 dark:text-slate-300">{selected.type}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Priority</span><span className={`font-bold ${selected.priority === 'High' ? 'text-rose-500' : selected.priority === 'Medium' ? 'text-amber-500' : 'text-slate-500'}`}>{selected.priority}</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => updateStatus(selected.id, 'Verified')} disabled={selected.status === 'Verified'} className="flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed">
                <ThumbsUp size={14} /> Approve
              </button>
              <button onClick={() => updateStatus(selected.id, 'Rejected')} disabled={selected.status === 'Rejected'} className="flex items-center justify-center gap-2 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed">
                <ThumbsDown size={14} /> Reject
              </button>
            </div>
            {selected.status === 'Pending' && (
              <button onClick={() => updateStatus(selected.id, 'Under Review')} className="mt-2 w-full py-2.5 border border-blue-200 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-100 transition">
                Mark Under Review
              </button>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <CheckCircle2 className="text-emerald-500" size={30} /> Verifications Queue
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Review and verify citizen documents and identity requests.</p>
        </header>

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total', value: verifications.length, color: 'text-slate-700 dark:text-slate-200' },
            { label: 'Pending', value: verifications.filter(v => v.status === 'Pending').length, color: 'text-amber-500' },
            { label: 'Under Review', value: verifications.filter(v => v.status === 'Under Review').length, color: 'text-blue-500' },
            { label: 'Verified', value: verifications.filter(v => v.status === 'Verified').length, color: 'text-emerald-500' },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-1 font-semibold uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 flex-1 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2">
              <Search size={16} className="text-slate-400" />
              <input className="bg-transparent flex-1 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 outline-none" placeholder="Search verifications..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3">ID</th><th className="px-4 py-3">Citizen</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Priority</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-400 text-sm">No results.</td></tr>}
              {filtered.map(v => (
                <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                  <td className="px-4 py-3 font-mono text-sm text-slate-500">{v.id}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100 text-sm">{v.citizen}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{v.type}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs font-semibold ${v.priority === 'High' ? 'bg-rose-100 text-rose-600' : v.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>{v.priority}</span></td>
                  <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${v.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : v.status === 'Pending' ? 'bg-amber-100 text-amber-700' : v.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>{v.status}</span></td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setSelected(v)} className="flex items-center gap-1 ml-auto text-xs px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-emerald-400 hover:text-emerald-500 transition text-slate-600 dark:text-slate-400">
                      <Eye size={12} /> Review
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

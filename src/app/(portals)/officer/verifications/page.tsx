'use client';
import React, { useState } from 'react';
import { CheckCircle2, Search, Eye, ThumbsUp, ThumbsDown, X, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';

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
    showToast(`${id} marked as ${newStatus}`);
    setSelected(null);
  };

  return (
    <div className="flex flex-col gap-10 min-h-screen bg-[#020817] text-white p-6 md:p-10">
      {toast && <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-semibold border border-emerald-500/20">✓ {toast}</div>}

      {selected && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white">Review Verification</h3>
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white transition"><X size={18} /></button>
            </div>
            <div className="space-y-3 mb-6 bg-slate-950 rounded-xl p-4 border border-slate-800">
              {[['ID', selected.id], ['Citizen', selected.citizen], ['Type', selected.type], ['Date', selected.date]].map(([k, v]) => (
                <div key={String(k)} className="flex justify-between text-sm"><span className="text-slate-500">{k}</span><span className="font-bold text-slate-300">{v}</span></div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <button onClick={() => updateStatus(selected.id, 'Verified')} disabled={selected.status === 'Verified'} className="flex items-center justify-center gap-2 py-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 rounded-xl text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                <ThumbsUp size={14} /> Approve
              </button>
              <button onClick={() => updateStatus(selected.id, 'Rejected')} disabled={selected.status === 'Rejected'} className="flex items-center justify-center gap-2 py-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 rounded-xl text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                <ThumbsDown size={14} /> Reject
              </button>
            </div>
            {selected.status === 'Pending' && (
              <button onClick={() => updateStatus(selected.id, 'Under Review')} className="w-full py-2.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 rounded-xl text-sm font-bold transition-all">
                Mark Under Review
              </button>
            )}
          </div>
        </div>
      )}

      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-4 border-b border-slate-800/80">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
            <ShieldCheck className="text-emerald-400" size={16} />
            Verification Queue
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Verifications</h1>
          <p className="text-slate-400 text-[15px] leading-relaxed">Review and verify citizen documents and identity requests.</p>
        </div>
      </header>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: verifications.length, color: 'text-white' },
          { label: 'Pending', value: verifications.filter(v => v.status === 'Pending').length, color: 'text-amber-400' },
          { label: 'Under Review', value: verifications.filter(v => v.status === 'Under Review').length, color: 'text-blue-400' },
          { label: 'Verified', value: verifications.filter(v => v.status === 'Verified').length, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="bg-[#0F172A] rounded-xl p-5 border border-slate-800 text-center">
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <Card padding="lg" className="bg-[#0F172A] border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2 flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5">
            <Search size={15} className="text-slate-500" />
            <input className="bg-transparent flex-1 text-sm text-slate-300 placeholder-slate-500 outline-none" placeholder="Search verifications..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-850 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <th className="pb-4 px-3">ID</th><th className="pb-4 px-3">Citizen</th><th className="pb-4 px-3">Type</th><th className="pb-4 px-3">Priority</th><th className="pb-4 px-3">Status</th><th className="pb-4 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900">
            {filtered.length === 0 && <tr><td colSpan={6} className="py-12 text-center text-slate-500">No verifications found.</td></tr>}
            {filtered.map(v => (
              <tr key={v.id} className="hover:bg-slate-950/40 transition-colors">
                <td className="py-4 px-3 font-mono text-sm text-slate-500">{v.id}</td>
                <td className="py-4 px-3 font-bold text-slate-300 text-sm">{v.citizen}</td>
                <td className="py-4 px-3 text-sm text-slate-400">{v.type}</td>
                <td className="py-4 px-3"><span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${v.priority === 'High' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : v.priority === 'Medium' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-slate-400 bg-slate-800 border-slate-700'}`}>{v.priority}</span></td>
                <td className="py-4 px-3"><span className={`text-[11px] font-bold px-2.5 py-0.5 rounded border ${v.status === 'Verified' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : v.status === 'Pending' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : v.status === 'Rejected' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : 'text-blue-400 bg-blue-500/10 border-blue-500/20'}`}>{v.status}</span></td>
                <td className="py-4 px-3 text-right">
                  <button onClick={() => setSelected(v)} className="flex items-center gap-1.5 ml-auto text-xs px-3.5 py-2 bg-slate-900 border border-slate-800 hover:border-emerald-500/40 hover:text-emerald-400 rounded-xl text-slate-400 font-bold transition-all">
                    <Eye size={12} /> Review
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

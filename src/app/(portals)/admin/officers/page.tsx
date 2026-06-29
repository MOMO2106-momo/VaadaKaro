'use client';
import React, { useState } from 'react';
import { Users, Plus, Search, CheckCircle, XCircle, Clock, X, ShieldAlert } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const OFFICERS = [
  { id: 1, name: 'Rajesh Kumar', email: 'rajesh.kumar@gov.in', department: 'Public Works', status: 'Active', cases: 24, joined: '2025-01-15' },
  { id: 2, name: 'Priya Sharma', email: 'priya.sharma@gov.in', department: 'Sanitation', status: 'Active', cases: 18, joined: '2025-03-10' },
  { id: 3, name: 'Amit Verma', email: 'amit.verma@gov.in', department: 'Electricity', status: 'Inactive', cases: 9, joined: '2024-11-20' },
  { id: 4, name: 'Sneha Patel', email: 'sneha.patel@gov.in', department: 'Water Supply', status: 'Active', cases: 31, joined: '2025-02-01' },
  { id: 5, name: 'Vikram Singh', email: 'vikram.singh@gov.in', department: 'Roads', status: 'Pending', cases: 0, joined: '2026-06-25' },
];

export default function OfficersPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [officers, setOfficers] = useState(OFFICERS);
  const [selected, setSelected] = useState<typeof OFFICERS[0] | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const filtered = officers.filter(o => {
    const matchSearch = o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase()) ||
      o.department.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const toggleStatus = (id: number) => {
    setOfficers(prev => prev.map(o => {
      if (o.id !== id) return o;
      const next = o.status === 'Active' ? 'Inactive' : 'Active';
      showToast(`${o.name} marked as ${next}`);
      return { ...o, status: next };
    }));
    setSelected(null);
  };

  return (
    <div className="flex flex-col gap-10 min-h-screen bg-[#020817] text-white p-6 md:p-10">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-semibold animate-pulse border border-emerald-500/20">
          ✓ {toast}
        </div>
      )}

      {/* Manage Modal */}
      {selected && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-850">
              <h3 className="font-bold text-white">Manage Officer</h3>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white transition"><X size={18} /></button>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">{selected.name.charAt(0)}</div>
              <div>
                <p className="font-bold text-white">{selected.name}</p>
                <p className="text-xs text-slate-400">{selected.email}</p>
                <p className="text-xs text-blue-400 font-bold mt-0.5">{selected.department}</p>
              </div>
            </div>
            <div className="space-y-2">
              <button onClick={() => toggleStatus(selected.id)} className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all border ${selected.status === 'Active' ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/30'}`}>
                {selected.status === 'Active' ? '⛔ Deactivate Officer' : '✅ Activate Officer'}
              </button>
              <button onClick={() => { showToast(`Reset password email sent to ${selected.email}`); setSelected(null); }} className="w-full py-2.5 rounded-xl text-xs font-bold bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 transition-all">
                🔑 Reset Password
              </button>
              <button onClick={() => { showToast(`Reassignment request for ${selected.name} submitted`); setSelected(null); }} className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 transition-all">
                🔄 Reassign Department
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-4 border-b border-slate-800/80">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
            <ShieldAlert className="text-blue-400" size={16} />
            Officers Center
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Officers Management
          </h1>
          <p className="text-slate-400 text-[15px] leading-relaxed">
            Manage government officers, departments, and credentials.
          </p>
        </div>
        <button onClick={() => showToast('Feature in active development')} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-blue-500/10">
          <Plus size={16} /> Add Officer
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        {(['All', 'Active', 'Pending'] as const).map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`rounded-xl p-5 border text-left transition-all ${filterStatus === s ? 'border-blue-500 bg-blue-500/5' : 'border-slate-800 bg-[#0F172A]'}`}>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s === 'All' ? 'Total Officers' : s}</p>
            <p className={`text-3xl font-black mt-1.5 ${s === 'All' ? 'text-blue-400' : s === 'Active' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {s === 'All' ? officers.length : officers.filter(o => o.status === s).length}
            </p>
          </button>
        ))}
      </div>

      {/* Table Container */}
      <Card padding="lg" className="bg-[#0F172A] border-slate-800">
        <div className="flex items-center gap-3 p-4 border-b border-slate-800/80 mb-4">
          <div className="flex items-center gap-2 flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5">
            <Search size={16} className="text-slate-500" />
            <input className="bg-transparent flex-1 text-sm text-slate-300 placeholder-slate-500 outline-none w-full" placeholder="Search officers by name, email or department..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-850 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <th className="pb-4 px-3">Officer</th>
                <th className="pb-4 px-3">Department</th>
                <th className="pb-4 px-3">Status</th>
                <th className="pb-4 px-3">Active Cases</th>
                <th className="pb-4 px-3">Joined</th>
                <th className="pb-4 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="py-12 text-center text-slate-500 text-sm">No officers found matching the criteria.</td></tr>
              )}
              {filtered.map(officer => (
                <tr key={officer.id} className="hover:bg-slate-950/40 transition-colors group">
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-sm">{officer.name.charAt(0)}</div>
                      <div>
                        <p className="font-bold text-slate-200 text-sm">{officer.name}</p>
                        <p className="text-xs text-slate-500">{officer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-sm text-slate-400 font-medium">{officer.department}</td>
                  <td className="py-4 px-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase border ${officer.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : officer.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                      {officer.status}
                    </span>
                  </td>
                  <td className="py-4 px-3 text-sm font-bold text-slate-300">{officer.cases}</td>
                  <td className="py-4 px-3 text-sm text-slate-500">{officer.joined}</td>
                  <td className="py-4 px-3 text-right">
                    <button onClick={() => setSelected(officer)} className="text-xs px-3.5 py-2 bg-slate-900 border border-slate-800 hover:border-slate-650 hover:bg-slate-800 rounded-xl text-slate-300 font-bold transition-all shadow-sm">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

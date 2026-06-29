'use client';
import React, { useState } from 'react';
import { Users, Plus, Search, Filter, Shield, CheckCircle, XCircle, Clock, X } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-semibold animate-pulse">
          ✓ {toast}
        </div>
      )}

      {/* Manage Modal */}
      {selected && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100">Manage Officer</h3>
              <button onClick={() => setSelected(null)}><X size={18} className="text-slate-400" /></button>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">{selected.name.charAt(0)}</div>
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">{selected.name}</p>
                <p className="text-sm text-slate-500">{selected.email}</p>
                <p className="text-xs text-slate-400">{selected.department}</p>
              </div>
            </div>
            <div className="space-y-2">
              <button onClick={() => toggleStatus(selected.id)} className={`w-full py-2.5 rounded-xl text-sm font-semibold transition ${selected.status === 'Active' ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'}`}>
                {selected.status === 'Active' ? '⛔ Deactivate Officer' : '✅ Activate Officer'}
              </button>
              <button onClick={() => { showToast(`Reset password email sent to ${selected.email}`); setSelected(null); }} className="w-full py-2.5 rounded-xl text-sm font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition">
                🔑 Reset Password
              </button>
              <button onClick={() => { showToast(`Reassignment request for ${selected.name} submitted`); setSelected(null); }} className="w-full py-2.5 rounded-xl text-sm font-semibold bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 transition">
                🔄 Reassign Department
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <Users className="text-blue-500" size={30} /> Officers Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage government officers and their assignments.</p>
          </div>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition shadow">
            <Plus size={16} /> Add Officer
          </button>
        </header>

        <div className="grid grid-cols-3 gap-4">
          {(['All', 'Active', 'Pending'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`rounded-xl p-4 border text-left transition ${filterStatus === s ? 'border-blue-400 bg-blue-50 dark:bg-blue-500/10' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'}`}>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{s === 'All' ? 'Total Officers' : s}</p>
              <p className={`text-3xl font-bold mt-1 ${s === 'All' ? 'text-blue-500' : s === 'Active' ? 'text-emerald-500' : 'text-amber-500'}`}>
                {s === 'All' ? officers.length : officers.filter(o => o.status === s).length}
              </p>
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 flex-1 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2">
              <Search size={16} className="text-slate-400" />
              <input className="bg-transparent flex-1 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 outline-none" placeholder="Search officers..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-4 py-3">Officer</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Active Cases</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-400 text-sm">No officers found.</td></tr>
                )}
                {filtered.map(officer => (
                  <tr key={officer.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">{officer.name.charAt(0)}</div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{officer.name}</p>
                          <p className="text-xs text-slate-500">{officer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">{officer.department}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${officer.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : officer.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                        {officer.status === 'Active' ? <CheckCircle size={10} /> : officer.status === 'Pending' ? <Clock size={10} /> : <XCircle size={10} />}
                        {officer.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{officer.cases}</td>
                    <td className="px-4 py-4 text-sm text-slate-500">{officer.joined}</td>
                    <td className="px-4 py-4 text-right">
                      <button onClick={() => setSelected(officer)} className="text-xs px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-400 hover:text-blue-500 transition text-slate-600 dark:text-slate-400">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

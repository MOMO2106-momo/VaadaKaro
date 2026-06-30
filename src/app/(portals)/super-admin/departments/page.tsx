'use client';
import React, { useState } from 'react';
import { Building, Plus, Users, FileText, CheckCircle, Server, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const INITIAL_DEPARTMENTS = [
  { id: 1, name: 'Public Works Department', code: 'PWD', region: 'North Delhi', officers: 8, openComplaints: 14, resolved: 102, active: true },
  { id: 2, name: 'Municipal Sanitation', code: 'MSD', region: 'South Delhi', officers: 5, openComplaints: 7, resolved: 88, active: true },
  { id: 3, name: 'Delhi Electricity Board', code: 'DEB', region: 'East Delhi', officers: 6, openComplaints: 20, resolved: 75, active: true },
  { id: 4, name: 'Delhi Jal Board', code: 'DJB', region: 'West Delhi', officers: 4, openComplaints: 11, resolved: 93, active: true },
  { id: 5, name: 'Roads & Transport Authority', code: 'RTA', region: 'Central Delhi', officers: 3, openComplaints: 5, resolved: 41, active: false },
];

export default function SuperAdminDepartmentsPage() {
  const [depts, setDepts] = useState(INITIAL_DEPARTMENTS);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newRegion, setNewRegion] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const toggleActive = (id: number) => {
    setDepts(prev => prev.map(d => {
      if (d.id !== id) return d;
      const next = !d.active;
      showToast(`${d.name} ${next ? 'Activated' : 'Deactivated'}`);
      return { ...d, active: next };
    }));
  };

  const addDept = () => {
    if (!newName.trim() || !newCode.trim()) return;
    setDepts(prev => [...prev, { id: Date.now(), name: newName, code: newCode.toUpperCase(), region: newRegion || 'All Regions', officers: 0, openComplaints: 0, resolved: 0, active: true }]);
    showToast(`Department "${newName}" created`);
    setNewName(''); setNewCode(''); setNewRegion(''); setShowAdd(false);
  };

  return (
    <div className="flex flex-col gap-10 min-h-screen bg-[#020817] text-white p-6 md:p-10">
      {toast && <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-semibold border border-emerald-500/20">✓ {toast}</div>}

      {showAdd && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white">Create Department</h3>
              <button onClick={() => setShowAdd(false)} className="text-slate-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-3 mb-5">
              {[
                { label: 'Department Name', val: newName, set: setNewName, placeholder: 'e.g. Parks Authority' },
                { label: 'Department Code', val: newCode, set: setNewCode, placeholder: 'e.g. PAD' },
                { label: 'Region / Zone', val: newRegion, set: setNewRegion, placeholder: 'e.g. South Delhi' },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">{f.label}</label>
                  <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 outline-none focus:border-rose-500/50" />
                </div>
              ))}
            </div>
            <button onClick={addDept} className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition">
              Create Department
            </button>
          </div>
        </div>
      )}

      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-4 border-b border-slate-800/80">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
            <Server className="text-rose-500" size={16} /> Platform Administration
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Department Registry</h1>
          <p className="text-slate-400 text-[15px] leading-relaxed">Create and manage all government departments across the platform.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-rose-500/10">
          <Plus size={16} /> Create Department
        </button>
      </header>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Departments', value: depts.length, color: 'text-rose-400' },
          { label: 'Active', value: depts.filter(d => d.active).length, color: 'text-emerald-400' },
          { label: 'Total Officers', value: depts.reduce((s, d) => s + d.officers, 0), color: 'text-blue-400' },
          { label: 'Open Complaints', value: depts.reduce((s, d) => s + d.openComplaints, 0), color: 'text-amber-400' },
        ].map(s => (
          <div key={s.label} className="bg-[#0F172A] rounded-xl p-5 border border-slate-800">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
            <p className={`text-3xl font-black mt-1.5 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <Card padding="lg" className="bg-[#0F172A] border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-850 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <th className="pb-4 px-3">Department</th>
              <th className="pb-4 px-3">Code</th>
              <th className="pb-4 px-3">Region</th>
              <th className="pb-4 px-3">Officers</th>
              <th className="pb-4 px-3">Open</th>
              <th className="pb-4 px-3">Resolved</th>
              <th className="pb-4 px-3">Status</th>
              <th className="pb-4 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900">
            {depts.map(d => (
              <tr key={d.id} className="hover:bg-slate-950/40 transition-colors">
                <td className="py-4 px-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                      <Building size={15} />
                    </div>
                    <p className="font-bold text-slate-200 text-sm">{d.name}</p>
                  </div>
                </td>
                <td className="py-4 px-3 font-mono text-xs text-slate-400 font-bold">{d.code}</td>
                <td className="py-4 px-3 text-sm text-slate-400">{d.region}</td>
                <td className="py-4 px-3 text-sm font-black text-slate-300">{d.officers}</td>
                <td className="py-4 px-3 text-sm font-black text-amber-400">{d.openComplaints}</td>
                <td className="py-4 px-3 text-sm font-black text-emerald-400">{d.resolved}</td>
                <td className="py-4 px-3">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${d.active ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-slate-500 bg-slate-800 border-slate-700'}`}>
                    {d.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-4 px-3 text-right">
                  <button onClick={() => toggleActive(d.id)} className={`text-xs px-3 py-1.5 rounded-lg border font-bold transition-all ${d.active ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'}`}>
                    {d.active ? 'Deactivate' : 'Activate'}
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

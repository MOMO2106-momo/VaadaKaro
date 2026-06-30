'use client';
import React, { useState } from 'react';
import { Building, Plus, Users, FileText, CheckCircle, ShieldAlert, X, ChevronDown, ChevronUp, Edit } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const DEPARTMENTS = [
  {
    id: 1, name: 'Public Works', head: 'Rajesh Kumar', officers: 8, openComplaints: 14, resolved: 102, color: '#3b82f6',
    officerList: ['Rajesh Kumar', 'Amit Sinha', 'Pooja Verma', 'Suresh R.'],
  },
  {
    id: 2, name: 'Sanitation', head: 'Priya Sharma', officers: 5, openComplaints: 7, resolved: 88, color: '#10b981',
    officerList: ['Priya Sharma', 'Dinesh M.', 'Kavita T.'],
  },
  {
    id: 3, name: 'Electricity Board', head: 'Amit Verma', officers: 6, openComplaints: 20, resolved: 75, color: '#f59e0b',
    officerList: ['Amit Verma', 'Ravi S.', 'Neha K.', 'Lokesh P.'],
  },
  {
    id: 4, name: 'Water Supply', head: 'Sneha Patel', officers: 4, openComplaints: 11, resolved: 93, color: '#6366f1',
    officerList: ['Sneha Patel', 'Ganesh R.'],
  },
  {
    id: 5, name: 'Roads & Transport', head: 'N/A', officers: 3, openComplaints: 5, resolved: 41, color: '#ef4444',
    officerList: ['Vikram Singh'],
  },
];

export default function DepartmentsPage() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [toast, setToast] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newDept, setNewDept] = useState('');
  const [newHead, setNewHead] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };
  const toggle = (id: number) => setExpanded(prev => (prev === id ? null : id));

  return (
    <div className="flex flex-col gap-10 min-h-screen bg-[#020817] text-white p-6 md:p-10">
      {toast && <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-semibold border border-emerald-500/20">✓ {toast}</div>}

      {showAdd && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white">New Department</h3>
              <button onClick={() => setShowAdd(false)} className="text-slate-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-3 mb-5">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Department Name</label>
                <input value={newDept} onChange={e => setNewDept(e.target.value)} placeholder="e.g. Parks Authority" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 outline-none focus:border-indigo-500/50" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Department Head</label>
                <input value={newHead} onChange={e => setNewHead(e.target.value)} placeholder="e.g. Anita Singh" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 outline-none focus:border-indigo-500/50" />
              </div>
            </div>
            <button onClick={() => { showToast(`Department "${newDept}" created`); setNewDept(''); setNewHead(''); setShowAdd(false); }} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition">
              Create Department
            </button>
          </div>
        </div>
      )}

      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-4 border-b border-slate-800/80">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
            <ShieldAlert className="text-indigo-400" size={16} /> Gov Directory
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Departments Overview</h1>
          <p className="text-slate-400 text-[15px] leading-relaxed">Manage government departments, officer capacity, and grievance metrics.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-indigo-500/10">
          <Plus size={16} /> New Department
        </button>
      </header>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Departments', value: DEPARTMENTS.length, color: 'text-indigo-400' },
          { label: 'Total Officers', value: DEPARTMENTS.reduce((s, d) => s + d.officers, 0), color: 'text-blue-400' },
          { label: 'Open Complaints', value: DEPARTMENTS.reduce((s, d) => s + d.openComplaints, 0), color: 'text-amber-400' },
        ].map(s => (
          <div key={s.label} className="bg-[#0F172A] rounded-xl p-5 border border-slate-800">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
            <p className={`text-3xl font-black mt-1.5 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {DEPARTMENTS.map(dept => (
          <div key={dept.id} className="bg-[#0F172A] rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 transition duration-200">
            <div className="h-1 w-full" style={{ backgroundColor: dept.color }} />
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-700" style={{ backgroundColor: dept.color + '15', color: dept.color }}>
                    <Building size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{dept.name}</h3>
                    <p className="text-xs text-slate-500">Head: <span className="text-slate-300 font-semibold">{dept.head}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1.5 text-slate-400"><Users size={12} className="text-blue-400" />{dept.officers} Officers</span>
                    <span className="flex items-center gap-1.5 text-slate-400"><FileText size={12} className="text-amber-400" />{dept.openComplaints} Open</span>
                    <span className="flex items-center gap-1.5 text-slate-400"><CheckCircle size={12} className="text-emerald-400" />{dept.resolved} Resolved</span>
                  </div>
                  <button onClick={() => showToast(`Edit panel for ${dept.name} opened`)} className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-500 hover:text-white transition">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => toggle(dept.id)} className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-500 hover:text-white transition">
                    {expanded === dept.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>
              </div>

              {expanded === dept.id && (
                <div className="mt-5 pt-4 border-t border-slate-800">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Assigned Officers</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {dept.officerList.map((o, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                        <div className="w-7 h-7 rounded-full text-xs font-black flex items-center justify-center text-white border" style={{ backgroundColor: dept.color + '30', borderColor: dept.color + '40', color: dept.color }}>
                          {o.charAt(0)}
                        </div>
                        <span className="text-xs font-semibold text-slate-300 truncate">{o}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

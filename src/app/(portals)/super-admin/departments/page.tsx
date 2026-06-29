import React from 'react';
import { Building, Plus, Users, CheckCircle, Key } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const DEPARTMENTS = [
  { id: 1, name: 'Public Works', code: 'PWD', head: 'Rajesh Kumar', officers: 8, admins: 2, state: 'Maharashtra', status: 'Active' },
  { id: 2, name: 'Municipal Corp', code: 'MCD', head: 'Sunita Sharma', officers: 6, admins: 1, state: 'Maharashtra', status: 'Active' },
  { id: 3, name: 'Water Supply Board', code: 'WSB', head: 'Deepa Nair', officers: 4, admins: 1, state: 'Maharashtra', status: 'Active' },
  { id: 4, name: 'Sanitation Dept', code: 'SANIT', head: 'Ajay Verma', officers: 5, admins: 1, state: 'Maharashtra', status: 'Inactive' },
  { id: 5, name: 'Transport Auth', code: 'DTC', head: 'Kiran Patel', officers: 3, admins: 1, state: 'Maharashtra', status: 'Active' },
];

export default function SuperAdminDepartmentsPage() {
  return (
    <div className="flex flex-col gap-10 min-h-screen bg-[#020817] text-white p-6 md:p-10">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-4 border-b border-slate-800/80">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
            <Key className="text-rose-400" size={16} />
            Platform Topology
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Departments</h1>
          <p className="text-slate-400 text-[15px] leading-relaxed">Manage all operational departments, their officers, and administrators.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-rose-500/10">
          <Plus size={16} /> New Department
        </button>
      </header>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Departments', value: DEPARTMENTS.length, color: 'text-rose-400' },
          { label: 'Active', value: DEPARTMENTS.filter(d => d.status === 'Active').length, color: 'text-emerald-400' },
          { label: 'Total Officers', value: DEPARTMENTS.reduce((s, d) => s + d.officers, 0), color: 'text-blue-400' },
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
              <th className="pb-4 px-3">Department</th><th className="pb-4 px-3">Head</th><th className="pb-4 px-3">Staff</th><th className="pb-4 px-3">State</th><th className="pb-4 px-3">Status</th><th className="pb-4 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900">
            {DEPARTMENTS.map(d => (
              <tr key={d.id} className="hover:bg-slate-950/40 transition-colors">
                <td className="py-4 px-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/20 flex items-center justify-center">
                      <Building size={15} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-200 text-sm">{d.name}</p>
                      <p className="text-xs text-slate-500 font-mono">{d.code}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-3 text-sm text-slate-400">{d.head}</td>
                <td className="py-4 px-3">
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <span className="flex items-center gap-1 text-blue-400 font-bold"><Users size={12} /> {d.officers}</span>
                    <span className="text-slate-600">·</span>
                    <span className="flex items-center gap-1 text-amber-400 font-bold"><CheckCircle size={12} /> {d.admins}</span>
                  </div>
                </td>
                <td className="py-4 px-3 text-sm text-slate-400">{d.state}</td>
                <td className="py-4 px-3"><span className={`text-[11px] font-bold px-2.5 py-0.5 rounded border ${d.status === 'Active' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-slate-500 bg-slate-800 border-slate-700'}`}>{d.status}</span></td>
                <td className="py-4 px-3 text-right">
                  <button className="text-xs px-3.5 py-2 bg-slate-900 border border-slate-800 hover:border-rose-500/40 hover:text-rose-400 rounded-xl text-slate-400 font-bold transition-all">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

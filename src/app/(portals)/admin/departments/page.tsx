import React from 'react';
import { Building, Plus, Users, FileText, CheckCircle, ShieldAlert } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const mockDepartments = [
  { id: 1, name: 'Public Works', head: 'Rajesh Kumar', officers: 8, openComplaints: 14, resolved: 102, color: '#3b82f6' },
  { id: 2, name: 'Sanitation', head: 'Priya Sharma', officers: 5, openComplaints: 7, resolved: 88, color: '#10b981' },
  { id: 3, name: 'Electricity', head: 'Amit Verma', officers: 6, openComplaints: 20, resolved: 75, color: '#f59e0b' },
  { id: 4, name: 'Water Supply', head: 'Sneha Patel', officers: 4, openComplaints: 11, resolved: 93, color: '#6366f1' },
  { id: 5, name: 'Roads & Transport', head: 'N/A', officers: 3, openComplaints: 5, resolved: 41, color: '#ef4444' },
];

export default function DepartmentsPage() {
  return (
    <div className="flex flex-col gap-10 min-h-screen bg-[#020817] text-white p-6 md:p-10">
      {/* Header */}
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-4 border-b border-slate-800/80">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
            <ShieldAlert className="text-indigo-400" size={16} />
            Gov Directory
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Departments Overview
          </h1>
          <p className="text-slate-400 text-[15px] leading-relaxed">
            Manage government departments, officers capacity, and grievance metrics.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-indigo-500/10">
          <Plus size={16} /> New Department
        </button>
      </header>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Departments', value: 5, color: 'text-indigo-400' },
          { label: 'Total Officers', value: 26, color: 'text-blue-400' },
          { label: 'Open Complaints', value: 57, color: 'text-amber-400' },
        ].map((s) => (
          <div key={s.label} className="bg-[#0F172A] rounded-xl p-5 border border-slate-800 shadow-sm">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
            <p className={`text-3xl font-black mt-1.5 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockDepartments.map((dept) => (
          <div key={dept.id} className="bg-[#0F172A] rounded-2xl border border-slate-800 shadow-sm overflow-hidden hover:border-slate-700 transition duration-300">
            {/* Color bar */}
            <div className="h-1.5 w-full" style={{ backgroundColor: dept.color }} />
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-white text-lg tracking-tight">{dept.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 font-semibold">Head: <span className="text-slate-300">{dept.head}</span></p>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-800" style={{ backgroundColor: dept.color + '15', color: dept.color }}>
                  <Building size={18} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="text-center p-3 bg-slate-950 border border-slate-850 rounded-xl">
                  <Users size={14} className="mx-auto text-blue-400 mb-1.5" />
                  <p className="text-base font-black text-slate-200">{dept.officers}</p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Officers</p>
                </div>
                <div className="text-center p-3 bg-slate-950 border border-slate-850 rounded-xl">
                  <FileText size={14} className="mx-auto text-amber-400 mb-1.5" />
                  <p className="text-base font-black text-slate-200">{dept.openComplaints}</p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Open</p>
                </div>
                <div className="text-center p-3 bg-slate-950 border border-slate-850 rounded-xl">
                  <CheckCircle size={14} className="mx-auto text-emerald-400 mb-1.5" />
                  <p className="text-base font-black text-slate-200">{dept.resolved}</p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Resolved</p>
                </div>
              </div>

              <button className="w-full mt-6 py-2.5 text-xs font-bold border border-slate-800 rounded-xl text-slate-400 hover:text-indigo-400 hover:border-slate-700 bg-slate-950 hover:bg-slate-900 transition-all">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

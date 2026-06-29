import React from 'react';
import { Building, Plus, Users, FileText, CheckCircle } from 'lucide-react';

const mockDepartments = [
  { id: 1, name: 'Public Works', head: 'Rajesh Kumar', officers: 8, openComplaints: 14, resolved: 102, color: '#3b82f6' },
  { id: 2, name: 'Sanitation', head: 'Priya Sharma', officers: 5, openComplaints: 7, resolved: 88, color: '#10b981' },
  { id: 3, name: 'Electricity', head: 'Amit Verma', officers: 6, openComplaints: 20, resolved: 75, color: '#f59e0b' },
  { id: 4, name: 'Water Supply', head: 'Sneha Patel', officers: 4, openComplaints: 11, resolved: 93, color: '#6366f1' },
  { id: 5, name: 'Roads & Transport', head: 'N/A', officers: 3, openComplaints: 5, resolved: 41, color: '#ef4444' },
];

export default function DepartmentsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">

        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <Building className="text-indigo-500" size={30} />
              Departments
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage government departments and their performance.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition shadow">
            <Plus size={16} />
            New Department
          </button>
        </header>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Departments', value: 5, color: 'text-indigo-500' },
            { label: 'Total Officers', value: 26, color: 'text-blue-500' },
            { label: 'Open Complaints', value: 57, color: 'text-amber-500' },
          ].map((s) => (
            <div key={s.label} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{s.label}</p>
              <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Department Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mockDepartments.map((dept) => (
            <div key={dept.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-md transition">
              {/* Color bar */}
              <div className="h-1.5 w-full" style={{ backgroundColor: dept.color }} />
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">{dept.name}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">Head: {dept.head}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: dept.color + '20', color: dept.color }}>
                    <Building size={18} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="text-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <Users size={14} className="mx-auto text-blue-500 mb-1" />
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{dept.officers}</p>
                    <p className="text-xs text-slate-500">Officers</p>
                  </div>
                  <div className="text-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <FileText size={14} className="mx-auto text-amber-500 mb-1" />
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{dept.openComplaints}</p>
                    <p className="text-xs text-slate-500">Open</p>
                  </div>
                  <div className="text-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <CheckCircle size={14} className="mx-auto text-emerald-500 mb-1" />
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{dept.resolved}</p>
                    <p className="text-xs text-slate-500">Resolved</p>
                  </div>
                </div>

                <button className="w-full mt-4 py-2 text-sm font-semibold border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

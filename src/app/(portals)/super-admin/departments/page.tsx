import React from 'react';
import { Building, Plus, Users, CheckCircle, Settings } from 'lucide-react';

const departments = [
  { id: 1, name: 'Public Works', code: 'PWD', head: 'Rajesh Kumar', officers: 8, admins: 2, state: 'Maharashtra', status: 'Active' },
  { id: 2, name: 'Sanitation', code: 'SAN', head: 'Priya Sharma', officers: 5, admins: 1, state: 'Maharashtra', status: 'Active' },
  { id: 3, name: 'Electricity Board', code: 'ELEC', head: 'Unassigned', officers: 6, admins: 1, state: 'Maharashtra', status: 'Active' },
  { id: 4, name: 'Water Supply', code: 'WSB', head: 'Sneha Patel', officers: 4, admins: 1, state: 'Maharashtra', status: 'Active' },
  { id: 5, name: 'Roads & Transport', code: 'RT', head: 'Unassigned', officers: 3, admins: 1, state: 'Maharashtra', status: 'Inactive' },
];

export default function SuperAdminDepartmentsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">

        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <Building className="text-indigo-500" size={30} />
              Platform Departments
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">All departments registered across the platform.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition shadow">
            <Plus size={16} />
            Add Department
          </button>
        </header>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Head</th>
                <th className="px-4 py-3">Officers</th>
                <th className="px-4 py-3">Admins</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {departments.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                  <td className="px-4 py-4 font-semibold text-slate-900 dark:text-slate-100 text-sm">{d.name}</td>
                  <td className="px-4 py-4 font-mono text-xs text-slate-500">{d.code}</td>
                  <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">{d.head}</td>
                  <td className="px-4 py-4 text-sm font-bold text-blue-600 dark:text-blue-400">{d.officers}</td>
                  <td className="px-4 py-4 text-sm font-bold text-indigo-600 dark:text-indigo-400">{d.admins}</td>
                  <td className="px-4 py-4 text-sm text-slate-500">{d.state}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${d.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button className="text-xs px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-400 hover:text-indigo-500 transition text-slate-600 dark:text-slate-400 flex items-center gap-1 ml-auto">
                      <Settings size={12} /> Configure
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

import React from 'react';
import { Key, Shield, Users, Lock, CheckCircle, Edit } from 'lucide-react';

const roles = [
  { role: 'CITIZEN', label: 'Citizen', desc: 'Can file complaints, track issues, use AI assistant', permissions: ['File Complaint', 'Track Complaint', 'View AI Assistant', 'Community Map'], count: 4821, color: '#64748b' },
  { role: 'LAWYER', label: 'Lawyer', desc: 'Same as citizen with legal advisory access', permissions: ['All Citizen Permissions', 'Legal Advisory Panel'], count: 48, color: '#8b5cf6' },
  { role: 'OFFICER', label: 'Officer', desc: 'Can manage assigned cases and verifications', permissions: ['Citizen Portal', 'Officer Portal', 'Manage Cases', 'Verifications'], count: 26, color: '#3b82f6' },
  { role: 'ADMIN', label: 'Admin', desc: 'Full department-level administration', permissions: ['All Officer Permissions', 'Admin Portal', 'Manage Officers', 'Reports'], count: 8, color: '#f97316' },
  { role: 'DEPARTMENT_ADMIN', label: 'Dept Admin', desc: 'Department-scoped admin access', permissions: ['Admin Portal', 'Dept Officers Only', 'Dept Analytics'], count: 12, color: '#6366f1' },
  { role: 'SUPER_ADMIN', label: 'Super Admin', desc: 'Full platform control, all portals', permissions: ['All Portals', 'Manage All Users', 'System Settings', 'Audit Logs'], count: 2, color: '#ef4444' },
];

export default function SuperAdminRolesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">

        <header>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <Key className="text-purple-500" size={30} />
            Roles & Permissions
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">View and configure platform role definitions and access levels.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {roles.map((r) => (
            <div key={r.role} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: r.color + '20', color: r.color }}>
                    <Shield size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">{r.label}</h3>
                    <span className="text-xs font-mono text-slate-400">{r.role}</span>
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: r.color + '15', color: r.color }}>
                  {r.count} users
                </span>
              </div>

              <p className="text-xs text-slate-500 mb-4">{r.desc}</p>

              <div className="space-y-1.5">
                {r.permissions.map((p) => (
                  <div key={p} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <CheckCircle size={12} className="text-emerald-500 shrink-0" />
                    {p}
                  </div>
                ))}
              </div>

              <button className="mt-4 w-full py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:border-purple-400 hover:text-purple-500 transition flex items-center justify-center gap-2">
                <Edit size={13} /> Edit Permissions
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Key, Shield, CheckCircle, Users } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const ROLES = [
  {
    role: 'CITIZEN', label: 'Citizen', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    desc: 'Default role for registered users. Can file complaints and track grievances.',
    permissions: ['File Complaints', 'Track Status', 'Use AI Assistant', 'View Announcements'],
    count: 12400,
  },
  {
    role: 'OFFICER', label: 'Officer', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    desc: 'Field staff responsible for investigating and resolving assigned complaints.',
    permissions: ['View Assigned Cases', 'Update Case Status', 'Verify Documents', 'View Heatmap', 'Use AI Colleague'],
    count: 38,
  },
  {
    role: 'ADMIN', label: 'Admin', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    desc: 'Department administrators managing officers, departments, and analytics.',
    permissions: ['Manage Officers', 'Assign Cases', 'Department Setup', 'View Analytics', 'Generate Reports', 'Platform Settings'],
    count: 5,
  },
  {
    role: 'SUPER_ADMIN', label: 'Super Admin', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    desc: 'Root platform administrators with full control over all roles and configuration.',
    permissions: ['All Admin Permissions', 'Manage All Users', 'Role Assignment', 'Audit Logs', 'System Configuration', 'Delete Users'],
    count: 2,
  },
];

export default function SuperAdminRolesPage() {
  return (
    <div className="flex flex-col gap-10 min-h-screen bg-[#020817] text-white p-6 md:p-10">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-4 border-b border-slate-800/80">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
            <Key className="text-rose-400" size={16} />
            Access Control
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Roles & Permissions</h1>
          <p className="text-slate-400 text-[15px] leading-relaxed">Configure what each user role can and cannot do on the platform.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {ROLES.map((r) => (
          <Card key={r.role} padding="lg" className="bg-[#0F172A] border-slate-800 hover:border-slate-700 transition-all">
            <div className="flex items-start justify-between mb-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${r.color}`}>
                  <Shield size={16} />
                </div>
                <div>
                  <h3 className="font-black text-white">{r.label}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{r.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                <Users size={12} /> {r.count.toLocaleString()}
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Permissions</p>
            <ul className="space-y-2">
              {r.permissions.map((p) => (
                <li key={p} className="flex items-center gap-2.5 text-sm text-slate-300">
                  <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
            <button className="mt-5 w-full py-2.5 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-900 rounded-xl text-xs font-bold transition-all">
              Edit Permissions
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

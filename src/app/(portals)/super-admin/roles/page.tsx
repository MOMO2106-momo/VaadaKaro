'use client';
import React, { useState } from 'react';
import { Key, Shield, CheckCircle, XCircle, Users, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const ROLES_DATA = [
  {
    role: 'CITIZEN',
    label: 'Citizen',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    accentColor: 'border-blue-500',
    desc: 'Default role for registered users. Can file complaints and track grievances.',
    count: 12400,
    permissions: [
      { name: 'File Complaints', granted: true },
      { name: 'Track Status', granted: true },
      { name: 'Use AI Assistant', granted: true },
      { name: 'View Announcements', granted: true },
      { name: 'Manage Officers', granted: false },
      { name: 'View Admin Dashboard', granted: false },
    ],
  },
  {
    role: 'OFFICER',
    label: 'Field Officer',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    accentColor: 'border-purple-500',
    desc: 'Field staff responsible for investigating and resolving assigned complaints.',
    count: 38,
    permissions: [
      { name: 'View Assigned Cases', granted: true },
      { name: 'Update Case Status', granted: true },
      { name: 'Verify Documents', granted: true },
      { name: 'View Heatmap', granted: true },
      { name: 'Manage Officers', granted: false },
      { name: 'Delete Records', granted: false },
    ],
  },
  {
    role: 'ADMIN',
    label: 'District Admin',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    accentColor: 'border-amber-500',
    desc: 'Department administrators managing officers, departments, and analytics.',
    count: 5,
    permissions: [
      { name: 'Manage Officers', granted: true },
      { name: 'Assign Cases', granted: true },
      { name: 'Department Setup', granted: true },
      { name: 'View Analytics', granted: true },
      { name: 'Generate Reports', granted: true },
      { name: 'Delete Platform Users', granted: false },
    ],
  },
  {
    role: 'SUPER_ADMIN',
    label: 'Super Admin',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
    accentColor: 'border-rose-500',
    desc: 'Root platform administrators with full control over all roles and configuration.',
    count: 2,
    permissions: [
      { name: 'All Admin Permissions', granted: true },
      { name: 'Manage All Users', granted: true },
      { name: 'Role Assignment', granted: true },
      { name: 'View Audit Logs', granted: true },
      { name: 'System Configuration', granted: true },
      { name: 'Delete Platform Users', granted: true },
    ],
  },
];

type PermItem = { name: string; granted: boolean };
type RoleData = typeof ROLES_DATA[0];

export default function SuperAdminRolesPage() {
  const [editing, setEditing] = useState<RoleData | null>(null);
  const [editPerms, setEditPerms] = useState<PermItem[]>([]);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const openEdit = (r: RoleData) => {
    setEditing(r);
    setEditPerms([...r.permissions]);
  };

  const togglePerm = (idx: number) => {
    setEditPerms(prev => prev.map((p, i) => i === idx ? { ...p, granted: !p.granted } : p));
  };

  const save = () => {
    showToast(`Permissions for ${editing?.label} saved`);
    setEditing(null);
  };

  return (
    <div className="flex flex-col gap-10 min-h-screen bg-[#020817] text-white p-6 md:p-10">
      {toast && <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-semibold border border-emerald-500/20">✓ {toast}</div>}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${editing.bg}`}>
                  <Shield size={14} className={editing.color} />
                </div>
                <div>
                  <h3 className="font-bold text-white">Edit Permissions</h3>
                  <p className={`text-xs font-bold ${editing.color}`}>{editing.label}</p>
                </div>
              </div>
              <button onClick={() => setEditing(null)} className="text-slate-500 hover:text-white"><X size={18} /></button>
            </div>

            <div className="space-y-2 mb-6">
              {editPerms.map((perm, idx) => (
                <div key={perm.name} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-sm text-slate-300 font-medium">{perm.name}</span>
                  <button onClick={() => togglePerm(idx)} className={`w-11 h-6 rounded-full border transition-all flex items-center px-0.5 ${perm.granted ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-slate-800 border-slate-700'}`}>
                    <div className={`w-5 h-5 rounded-full transition-all ${perm.granted ? 'translate-x-5 bg-emerald-400' : 'translate-x-0 bg-slate-600'}`} />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setEditing(null)} className="py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-sm font-bold transition">Cancel</button>
              <button onClick={save} className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold transition">Save Permissions</button>
            </div>
          </div>
        </div>
      )}

      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-4 border-b border-slate-800/80">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
            <Key className="text-rose-400" size={16} /> Access Control
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Roles & Permissions</h1>
          <p className="text-slate-400 text-[15px] leading-relaxed">Configure what each user role can and cannot access on the platform.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {ROLES_DATA.map(r => (
          <Card key={r.role} padding="lg" className={`bg-[#0F172A] border-slate-800 hover:${r.accentColor}/30 transition-all hover:border-slate-700`}>
            <div className="flex items-start justify-between mb-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${r.bg}`}>
                  <Shield size={16} className={r.color} />
                </div>
                <div>
                  <h3 className="font-black text-white">{r.label}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 max-w-[220px]">{r.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold shrink-0">
                <Users size={12} /> {r.count.toLocaleString()}
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Permissions</p>
            <ul className="space-y-2 mb-5">
              {r.permissions.map(p => (
                <li key={p.name} className="flex items-center gap-2.5 text-sm">
                  {p.granted
                    ? <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                    : <XCircle size={14} className="text-slate-700 shrink-0" />}
                  <span className={p.granted ? 'text-slate-300' : 'text-slate-600'}>{p.name}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => openEdit(r)} className={`mt-1 w-full py-2.5 border border-slate-800 hover:${r.accentColor}/40 text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-900 rounded-xl text-xs font-bold transition-all`}>
              ✏ Edit Permissions
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

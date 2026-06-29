'use client';
import React, { useState } from 'react';
import { Users, Search, Shield, Key, Edit, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const INITIAL_USERS = [
  { id: 1, name: 'Rajesh Kumar', email: 'rajesh@gov.in', role: 'OFFICER', dept: 'Public Works', status: 'Active', joined: '2025-01-15' },
  { id: 2, name: 'Sunita Sharma', email: 'sunita@gov.in', role: 'ADMIN', dept: 'Municipal Corp', status: 'Active', joined: '2024-11-10' },
  { id: 3, name: 'Ajay Verma', email: 'ajay@gov.in', role: 'OFFICER', dept: 'Sanitation', status: 'Inactive', joined: '2025-03-22' },
  { id: 4, name: 'Deepa Nair', email: 'deepa@gov.in', role: 'ADMIN', dept: 'Water Board', status: 'Active', joined: '2024-08-05' },
  { id: 5, name: 'Kiran Patel', email: 'kiran@gov.in', role: 'OFFICER', dept: 'Roads & PWD', status: 'Active', joined: '2025-05-01' },
];
const ROLES = ['All', 'OFFICER', 'ADMIN', 'SUPER_ADMIN'];
const ROLE_OPTS = ['OFFICER', 'ADMIN', 'SUPER_ADMIN'];

export default function SuperAdminUsersPage() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('All');
  const [users, setUsers] = useState(INITIAL_USERS);
  const [selected, setSelected] = useState<typeof INITIAL_USERS[0] | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || u.dept.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === 'All' || u.role === tab;
    return matchSearch && matchTab;
  });

  const changeRole = (id: number, newRole: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
    showToast(`Role updated to ${newRole}`);
    setSelected(null);
  };

  const toggleStatus = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
    showToast('Status updated');
  };

  return (
    <div className="flex flex-col gap-10 min-h-screen bg-[#020817] text-white p-6 md:p-10">
      {toast && <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-semibold border border-emerald-500/20">✓ {toast}</div>}

      {selected && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white">Edit User Role</h3>
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white transition"><X size={18} /></button>
            </div>
            <div className="space-y-2 mb-5 bg-slate-950 rounded-xl p-4 border border-slate-800">
              {[['Name', selected.name], ['Email', selected.email], ['Dept', selected.dept], ['Current Role', selected.role]].map(([k, v]) => (
                <div key={String(k)} className="flex justify-between text-sm"><span className="text-slate-500">{k}</span><span className="font-bold text-slate-300">{v}</span></div>
              ))}
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Assign New Role</p>
            <div className="space-y-2">
              {ROLE_OPTS.map(r => (
                <button key={r} onClick={() => changeRole(selected.id, r)} disabled={selected.role === r}
                  className={`w-full py-2.5 rounded-xl text-sm font-bold border flex items-center justify-center gap-2 transition-all ${selected.role === r ? 'opacity-30 cursor-not-allowed bg-slate-900 border-slate-800 text-slate-500' : r === 'SUPER_ADMIN' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20' : r === 'ADMIN' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20' : 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20'}`}>
                  <Shield size={14} /> {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-4 border-b border-slate-800/80">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
            <Key className="text-rose-400" size={16} />
            User Management
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">All Platform Users</h1>
          <p className="text-slate-400 text-[15px] leading-relaxed">Manage roles and permissions for all officers, admins, and staff.</p>
        </div>
      </header>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: users.length, color: 'text-white' },
          { label: 'Admins', value: users.filter(u => u.role === 'ADMIN').length, color: 'text-amber-400' },
          { label: 'Officers', value: users.filter(u => u.role === 'OFFICER').length, color: 'text-blue-400' },
          { label: 'Active', value: users.filter(u => u.status === 'Active').length, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="bg-[#0F172A] rounded-xl p-5 border border-slate-800 text-center">
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <Card padding="lg" className="bg-[#0F172A] border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-6">
          <div className="flex items-center gap-2 flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5">
            <Search size={15} className="text-slate-500" />
            <input className="bg-transparent flex-1 text-sm text-slate-300 placeholder-slate-500 outline-none" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-1">
            {ROLES.map(r => (
              <button key={r} onClick={() => setTab(r)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${tab === r ? 'bg-rose-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'}`}>{r}</button>
            ))}
          </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-850 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <th className="pb-4 px-3">User</th><th className="pb-4 px-3">Department</th><th className="pb-4 px-3">Role</th><th className="pb-4 px-3">Status</th><th className="pb-4 px-3">Joined</th><th className="pb-4 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900">
            {filtered.length === 0 && <tr><td colSpan={6} className="py-12 text-center text-slate-500">No users found.</td></tr>}
            {filtered.map(u => (
              <tr key={u.id} className="hover:bg-slate-950/40 transition-colors">
                <td className="py-4 px-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-rose-600/20 text-rose-400 border border-rose-500/20 flex items-center justify-center font-bold text-sm">{u.name.charAt(0)}</div>
                    <div>
                      <p className="font-bold text-slate-200 text-sm">{u.name}</p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-3 text-sm text-slate-400">{u.dept}</td>
                <td className="py-4 px-3"><span className={`text-[11px] font-black px-2.5 py-0.5 rounded border ${u.role === 'SUPER_ADMIN' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : u.role === 'ADMIN' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-blue-400 bg-blue-500/10 border-blue-500/20'}`}>{u.role}</span></td>
                <td className="py-4 px-3"><span className={`text-[11px] font-bold px-2.5 py-0.5 rounded border ${u.status === 'Active' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-slate-500 bg-slate-800 border-slate-700'}`}>{u.status}</span></td>
                <td className="py-4 px-3 text-xs text-slate-500">{u.joined}</td>
                <td className="py-4 px-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setSelected(u)} className="flex items-center gap-1.5 text-xs px-3 py-2 bg-slate-900 border border-slate-800 hover:border-rose-500/40 hover:text-rose-400 rounded-xl text-slate-400 font-bold transition-all">
                      <Edit size={11} /> Role
                    </button>
                    <button onClick={() => toggleStatus(u.id)} className="text-xs px-3 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-400 hover:text-white font-bold transition-all">
                      {u.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

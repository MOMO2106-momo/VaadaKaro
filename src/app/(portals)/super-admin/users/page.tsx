'use client';
import React, { useState } from 'react';
import { Users, Search, Filter, Shield, Key, Edit, X } from 'lucide-react';

const INITIAL_USERS = [
  { id: 1, name: 'Rajesh Kumar', email: 'rajesh@gov.in', role: 'OFFICER', dept: 'Public Works', status: 'Active', joined: '2025-01-15' },
  { id: 2, name: 'Priya Admin', email: 'priya.a@gov.in', role: 'ADMIN', dept: 'Sanitation', status: 'Active', joined: '2024-10-01' },
  { id: 3, name: 'Suresh Citizen', email: 'suresh@gmail.com', role: 'CITIZEN', dept: '—', status: 'Active', joined: '2026-02-20' },
  { id: 4, name: 'Neha Lawyer', email: 'neha.l@gmail.com', role: 'LAWYER', dept: '—', status: 'Active', joined: '2026-03-10' },
  { id: 5, name: 'Dept Admin', email: 'dept.a@gov.in', role: 'DEPARTMENT_ADMIN', dept: 'Roads', status: 'Inactive', joined: '2024-08-05' },
];

const ROLES = ['CITIZEN', 'LAWYER', 'OFFICER', 'DEPARTMENT_ADMIN', 'ADMIN', 'SUPER_ADMIN'];

const roleColors: Record<string, string> = {
  CITIZEN: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  OFFICER: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  LAWYER: 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400',
  ADMIN: 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',
  DEPARTMENT_ADMIN: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400',
  SUPER_ADMIN: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
};

export default function SuperAdminUsersPage() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [selectedUser, setSelectedUser] = useState<typeof INITIAL_USERS[0] | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleRoleChange = (userId: number, newRole: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    showToast(`Role updated successfully for ${users.find(u => u.id === userId)?.name}`);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase()) || 
                          u.dept.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === 'All' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-semibold">
          ✓ {toast}
        </div>
      )}

      {/* Role Change Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedUser(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100">Update User Role</h3>
              <button onClick={() => setSelectedUser(null)}><X size={18} className="text-slate-400" /></button>
            </div>
            <p className="text-sm text-slate-500 mb-4">Select the new role for <span className="font-bold text-slate-700 dark:text-slate-300">{selectedUser.name}</span>:</p>
            <div className="space-y-2">
              {ROLES.map(role => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(selectedUser.id, role)}
                  className={`w-full py-2 px-3 rounded-lg text-left text-sm font-semibold transition border ${
                    selectedUser.role === role 
                      ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/30 dark:border-blue-900 dark:text-blue-400' 
                      : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <Users className="text-red-500" size={30} />
              All Platform Users
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">View and manage all users across the VaadaKaro platform.</p>
          </div>
        </header>

        {/* Role distribution */}
        <div className="grid grid-cols-5 gap-3">
          {[
            { role: 'Citizens', count: users.filter(u => u.role === 'CITIZEN').length + 4818, color: '#64748b' },
            { role: 'Lawyers', count: users.filter(u => u.role === 'LAWYER').length + 47, color: '#8b5cf6' },
            { role: 'Officers', count: users.filter(u => u.role === 'OFFICER').length + 25, color: '#3b82f6' },
            { role: 'Admins', count: users.filter(u => u.role === 'ADMIN').length + 7, color: '#f97316' },
            { role: 'Dept Admins', count: users.filter(u => u.role === 'DEPARTMENT_ADMIN').length + 11, color: '#6366f1' },
          ].map((r) => (
            <div key={r.role} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100" style={{ color: r.color }}>{r.count.toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-1 font-semibold">{r.role}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 flex-1 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2">
              <Search size={16} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search users..." 
                className="bg-transparent text-sm w-full outline-none text-slate-700 dark:text-slate-300"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {['All', ...ROLES].map(r => (
                <button
                  key={r}
                  onClick={() => setFilterRole(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    filterRole === r 
                      ? 'bg-red-500 text-white' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{u.name}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${roleColors[u.role] || ''}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">{u.dept}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-500">{u.joined}</td>
                  <td className="px-4 py-4 text-right">
                    <button onClick={() => setSelectedUser(u)} className="flex items-center gap-1 ml-auto text-xs px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-red-400 hover:text-red-500 transition text-slate-600 dark:text-slate-400">
                      <Key size={12} /> Change Role
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

import React from 'react';
import { Users, Search, MapPin, Phone, Clock } from 'lucide-react';

const citizens = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@gmail.com', pincode: '400001', complaints: 3, lastActivity: '2026-06-29', status: 'Active' },
  { id: 2, name: 'Priya Mehta', email: 'priya.m@gmail.com', pincode: '400002', complaints: 1, lastActivity: '2026-06-28', status: 'Active' },
  { id: 3, name: 'Suresh Patil', email: 'suresh.p@gmail.com', pincode: '400003', complaints: 5, lastActivity: '2026-06-20', status: 'Active' },
  { id: 4, name: 'Aarti Nair', email: 'aarti.n@gmail.com', pincode: '400001', complaints: 2, lastActivity: '2026-06-15', status: 'Inactive' },
  { id: 5, name: 'Vikram Joshi', email: 'vikram.j@gmail.com', pincode: '400004', complaints: 0, lastActivity: '2026-06-10', status: 'Inactive' },
];

export default function OfficerCitizensPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">

        <header>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <Users className="text-blue-500" size={30} />
            Citizens
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Citizens who have filed complaints in your jurisdiction.</p>
        </header>

        {/* Search */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 flex-1 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2">
              <Search size={16} className="text-slate-400" />
              <span className="text-sm text-slate-400">Search citizens by name, email, or pincode...</span>
            </div>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3">Citizen</th>
                <th className="px-4 py-3">Pincode</th>
                <th className="px-4 py-3">Complaints Filed</th>
                <th className="px-4 py-3">Last Active</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {citizens.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{c.name}</p>
                        <p className="text-xs text-slate-500">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                      <MapPin size={12} className="text-slate-400" /> {c.pincode}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm font-bold text-slate-900 dark:text-slate-100">{c.complaints}</td>
                  <td className="px-4 py-4">
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock size={11} /> {c.lastActivity}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${c.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button className="text-xs px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-400 hover:text-blue-500 transition text-slate-600 dark:text-slate-400">
                      View Profile
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

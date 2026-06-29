import React from 'react';
import { Users, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const citizens = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@gmail.com', pincode: '400001', complaints: 3, lastActivity: '2026-06-29', status: 'Active' },
  { id: 2, name: 'Priya Mehta', email: 'priya.m@gmail.com', pincode: '400002', complaints: 1, lastActivity: '2026-06-28', status: 'Active' },
  { id: 3, name: 'Suresh Patil', email: 'suresh.p@gmail.com', pincode: '400003', complaints: 5, lastActivity: '2026-06-20', status: 'Active' },
  { id: 4, name: 'Aarti Nair', email: 'aarti.n@gmail.com', pincode: '400001', complaints: 2, lastActivity: '2026-06-15', status: 'Inactive' },
  { id: 5, name: 'Vikram Joshi', email: 'vikram.j@gmail.com', pincode: '400004', complaints: 0, lastActivity: '2026-06-10', status: 'Inactive' },
];

export default function OfficerCitizensPage() {
  return (
    <div className="flex flex-col gap-10 min-h-screen bg-[#020817] text-white p-6 md:p-10">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-4 border-b border-slate-800/80">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
            <ShieldCheck className="text-blue-400" size={16} />
            Jurisdiction Directory
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Citizens</h1>
          <p className="text-slate-400 text-[15px] leading-relaxed">Citizens who have filed complaints in your jurisdiction.</p>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Citizens', value: citizens.length, color: 'text-blue-400' },
          { label: 'Active Filers', value: citizens.filter(c => c.status === 'Active').length, color: 'text-emerald-400' },
          { label: 'Total Complaints', value: citizens.reduce((s, c) => s + c.complaints, 0), color: 'text-amber-400' },
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
              <th className="pb-4 px-3">Citizen</th><th className="pb-4 px-3">Pincode</th><th className="pb-4 px-3">Complaints</th><th className="pb-4 px-3">Last Active</th><th className="pb-4 px-3">Status</th><th className="pb-4 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900">
            {citizens.map(c => (
              <tr key={c.id} className="hover:bg-slate-950/40 transition-colors">
                <td className="py-4 px-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-sm">{c.name.charAt(0)}</div>
                    <div>
                      <p className="font-bold text-slate-200 text-sm">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-3 text-sm text-slate-400 flex items-center gap-1.5 mt-4"><MapPin size={12} className="text-slate-600" />{c.pincode}</td>
                <td className="py-4 px-3 text-sm font-black text-slate-300">{c.complaints}</td>
                <td className="py-4 px-3 text-xs text-slate-500 flex items-center gap-1.5 mt-4"><Clock size={11} />{c.lastActivity}</td>
                <td className="py-4 px-3"><span className={`text-[11px] font-bold px-2.5 py-0.5 rounded border ${c.status === 'Active' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-slate-500 bg-slate-800 border-slate-700'}`}>{c.status}</span></td>
                <td className="py-4 px-3 text-right">
                  <button className="text-xs px-3.5 py-2 bg-slate-900 border border-slate-800 hover:border-blue-500/40 hover:text-blue-400 rounded-xl text-slate-400 font-bold transition-all">View Profile</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

'use client';
import React, { useState } from 'react';
import { Users, MapPin, Clock, ShieldCheck, Search, X, Phone, Mail, FileText, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const CITIZENS = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@gmail.com', phone: '+91 98765 43210', pincode: '400001', ward: 'Ward 12 – MG Road Zone', complaints: 3, lastActivity: '2026-06-29', status: 'Active', trustScore: 88 },
  { id: 2, name: 'Priya Mehta', email: 'priya.m@gmail.com', phone: '+91 91234 56789', pincode: '400002', ward: 'Ward 7 – Sector 5', complaints: 1, lastActivity: '2026-06-28', status: 'Active', trustScore: 72 },
  { id: 3, name: 'Suresh Patil', email: 'suresh.p@gmail.com', phone: '+91 88765 32100', pincode: '400003', ward: 'Ward 19 – Kirti Nagar', complaints: 5, lastActivity: '2026-06-20', status: 'Active', trustScore: 95 },
  { id: 4, name: 'Aarti Nair', email: 'aarti.n@gmail.com', phone: '+91 77654 23100', pincode: '400001', ward: 'Ward 12 – MG Road Zone', complaints: 2, lastActivity: '2026-06-15', status: 'Inactive', trustScore: 60 },
  { id: 5, name: 'Vikram Joshi', email: 'vikram.j@gmail.com', phone: '+91 99887 76655', pincode: '400004', ward: 'Ward 23 – Bus Stand Area', complaints: 0, lastActivity: '2026-06-10', status: 'Inactive', trustScore: 45 },
];

export default function OfficerCitizensPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<typeof CITIZENS[0] | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const filtered = CITIZENS.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.ward.toLowerCase().includes(q) || c.pincode.includes(q);
    const matchFilter = filter === 'All' || c.status === filter;
    return matchSearch && matchFilter;
  });

  const getTrustColor = (score: number) => score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-rose-400';

  return (
    <div className="flex flex-col gap-10 min-h-screen bg-[#020817] text-white p-6 md:p-10">
      {toast && <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-semibold border border-emerald-500/20">✓ {toast}</div>}

      {/* Profile Modal */}
      {selected && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white">Citizen Profile</h3>
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white transition"><X size={18} /></button>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center text-2xl font-black">
                {selected.name.charAt(0)}
              </div>
              <div>
                <p className="font-black text-white text-lg">{selected.name}</p>
                <p className="text-xs text-slate-400">{selected.ward}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 inline-block ${selected.status === 'Active' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-slate-500 bg-slate-800 border-slate-700'}`}>
                  {selected.status}
                </span>
              </div>
            </div>
            <div className="space-y-3 bg-slate-950 rounded-xl p-4 border border-slate-800 mb-5">
              {[
                { icon: Mail, label: 'Email', value: selected.email },
                { icon: Phone, label: 'Phone', value: selected.phone },
                { icon: MapPin, label: 'Pincode', value: selected.pincode },
                { icon: FileText, label: 'Complaints Filed', value: String(selected.complaints) },
                { icon: Clock, label: 'Last Active', value: selected.lastActivity },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-500"><Icon size={12} />{label}</div>
                  <span className="font-bold text-slate-300">{value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2 text-slate-500"><AlertCircle size={12} />Trust Score</div>
                <span className={`font-black text-base ${getTrustColor(selected.trustScore)}`}>{selected.trustScore}/100</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => { showToast(`Alert sent to ${selected.name}`); setSelected(null); }} className="py-2.5 rounded-xl text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-all">
                ⚠ Send Alert
              </button>
              <button onClick={() => { showToast(`Profile flagged for review`); setSelected(null); }} className="py-2.5 rounded-xl text-xs font-bold bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition-all">
                🚩 Flag Profile
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-4 border-b border-slate-800/80">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
            <ShieldCheck className="text-blue-400" size={16} /> Jurisdiction Directory
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Citizens</h1>
          <p className="text-slate-400 text-[15px] leading-relaxed">Citizens who have filed complaints in your jurisdiction area.</p>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Citizens', value: CITIZENS.length, color: 'text-blue-400' },
          { label: 'Active Filers', value: CITIZENS.filter(c => c.status === 'Active').length, color: 'text-emerald-400' },
          { label: 'Total Complaints', value: CITIZENS.reduce((s, c) => s + c.complaints, 0), color: 'text-amber-400' },
        ].map(s => (
          <div key={s.label} className="bg-[#0F172A] rounded-xl p-5 border border-slate-800">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
            <p className={`text-3xl font-black mt-1.5 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <Card padding="lg" className="bg-[#0F172A] border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-6">
          <div className="flex items-center gap-2 flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5">
            <Search size={15} className="text-slate-500" />
            <input className="bg-transparent flex-1 text-sm text-slate-300 placeholder-slate-500 outline-none" placeholder="Search by name, email, ward, pincode..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-1">
            {['All', 'Active', 'Inactive'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === f ? 'bg-blue-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'}`}>{f}</button>
            ))}
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-850 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <th className="pb-4 px-3">Citizen</th>
              <th className="pb-4 px-3">Ward / Zone</th>
              <th className="pb-4 px-3">Complaints</th>
              <th className="pb-4 px-3">Trust Score</th>
              <th className="pb-4 px-3">Last Active</th>
              <th className="pb-4 px-3">Status</th>
              <th className="pb-4 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900">
            {filtered.length === 0 && <tr><td colSpan={7} className="py-12 text-center text-slate-500">No citizens found.</td></tr>}
            {filtered.map(c => (
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
                <td className="py-4 px-3 text-xs text-slate-400">{c.ward}</td>
                <td className="py-4 px-3 text-sm font-black text-slate-300">{c.complaints}</td>
                <td className="py-4 px-3 text-sm font-black">
                  <span className={getTrustColor(c.trustScore)}>{c.trustScore}</span>
                  <span className="text-slate-600 text-xs">/100</span>
                </td>
                <td className="py-4 px-3 text-xs text-slate-500 flex items-center gap-1.5 mt-4"><Clock size={11} />{c.lastActivity}</td>
                <td className="py-4 px-3">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded border ${c.status === 'Active' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-slate-500 bg-slate-800 border-slate-700'}`}>{c.status}</span>
                </td>
                <td className="py-4 px-3 text-right">
                  <button onClick={() => setSelected(c)} className="text-xs px-3.5 py-2 bg-slate-900 border border-slate-800 hover:border-blue-500/40 hover:text-blue-400 rounded-xl text-slate-400 font-bold transition-all">View Profile</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

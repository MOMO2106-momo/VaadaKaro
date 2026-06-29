import React from 'react';
import { Tag, Plus, Hash, ShieldAlert } from 'lucide-react';

const CATEGORIES = [
  { id: 1, name: 'Roads & Potholes', dept: 'PWD', count: 128, color: '#ef4444', active: true },
  { id: 2, name: 'Sanitation & Garbage', dept: 'MCD', count: 94, color: '#10b981', active: true },
  { id: 3, name: 'Electricity Supply', dept: 'DISCOM', count: 76, color: '#f59e0b', active: true },
  { id: 4, name: 'Water Supply', dept: 'WSB', count: 65, color: '#3b82f6', active: true },
  { id: 5, name: 'Public Transport', dept: 'DTC', count: 41, color: '#8b5cf6', active: true },
  { id: 6, name: 'Street Lighting', dept: 'PWD', count: 38, color: '#06b6d4', active: true },
  { id: 7, name: 'Parks & Open Spaces', dept: 'Parks', count: 22, color: '#84cc16', active: false },
  { id: 8, name: 'Noise Pollution', dept: 'PCB', count: 17, color: '#f97316', active: false },
];

export default function CategoriesPage() {
  return (
    <div className="flex flex-col gap-10 min-h-screen bg-[#020817] text-white p-6 md:p-10">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-4 border-b border-slate-800/80">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
            <ShieldAlert className="text-amber-400" size={16} />
            Complaint Taxonomy
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Categories & Tags</h1>
          <p className="text-slate-400 text-[15px] leading-relaxed">Configure complaint categories and department routing rules.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-amber-500/10">
          <Plus size={16} /> New Category
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Categories', value: 8, color: 'text-amber-400' },
          { label: 'Active', value: 6, color: 'text-emerald-400' },
          { label: 'Inactive', value: 2, color: 'text-slate-400' },
          { label: 'Total Complaints', value: 481, color: 'text-blue-400' },
        ].map((s) => (
          <div key={s.label} className="bg-[#0F172A] rounded-xl p-5 border border-slate-800">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
            <p className={`text-3xl font-black mt-1.5 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => (
          <div key={cat.id} className="bg-[#0F172A] rounded-2xl border border-slate-800 p-5 hover:border-slate-700 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: cat.color + '20', color: cat.color }}>
                  <Tag size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{cat.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-mono">{cat.dept}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${cat.active ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-slate-500 bg-slate-800 border-slate-700'}`}>
                {cat.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Hash size={13} className="text-slate-600" />
                <span className="font-bold text-slate-300">{cat.count}</span>
                <span className="text-slate-500 text-xs">complaints</span>
              </div>
              <div className="flex gap-2">
                <button className="text-[11px] px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-lg font-bold transition-all">Edit</button>
                <button className="text-[11px] px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-lg font-bold transition-all">{cat.active ? 'Disable' : 'Enable'}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

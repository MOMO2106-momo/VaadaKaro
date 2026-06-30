'use client';
import React, { useState } from 'react';
import { Tag, Search, ToggleLeft, ToggleRight, FileText, AlertCircle, CheckCircle, Plus, X, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const INITIAL_CATEGORIES = [
  { id: 1, name: 'Road & Infrastructure', dept: 'Public Works', complaints: 128, active: true, color: '#3b82f6' },
  { id: 2, name: 'Sanitation & Garbage', dept: 'Sanitation', complaints: 94, active: true, color: '#10b981' },
  { id: 3, name: 'Electricity & Streetlights', dept: 'Electricity', complaints: 76, active: true, color: '#f59e0b' },
  { id: 4, name: 'Water Supply', dept: 'Water Board', complaints: 65, active: true, color: '#6366f1' },
  { id: 5, name: 'Noise Pollution', dept: 'Police', complaints: 31, active: false, color: '#ef4444' },
  { id: 6, name: 'Parks & Open Spaces', dept: 'Municipal Corp', complaints: 22, active: false, color: '#14b8a6' },
  { id: 7, name: 'Illegal Construction', dept: 'Town Planning', complaints: 44, active: true, color: '#8b5cf6' },
  { id: 8, name: 'Drainage & Flooding', dept: 'Public Works', complaints: 57, active: true, color: '#0ea5e9' },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [toast, setToast] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDept, setNewDept] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const toggleActive = (id: number) => {
    setCategories(prev => prev.map(c => {
      if (c.id !== id) return c;
      const next = !c.active;
      showToast(`"${c.name}" ${next ? 'Activated' : 'Deactivated'}`);
      return { ...c, active: next };
    }));
  };

  const addCategory = () => {
    if (!newName.trim() || !newDept.trim()) return;
    setCategories(prev => [...prev, { id: Date.now(), name: newName, dept: newDept, complaints: 0, active: true, color: '#64748b' }]);
    showToast(`Category "${newName}" added`);
    setNewName(''); setNewDept(''); setShowAdd(false);
  };

  const filtered = categories.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(q) || c.dept.toLowerCase().includes(q);
    const matchFilter = filter === 'All' || (filter === 'Active' ? c.active : !c.active);
    return matchSearch && matchFilter;
  });

  return (
    <div className="flex flex-col gap-10 min-h-screen bg-[#020817] text-white p-6 md:p-10">
      {toast && <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-semibold border border-emerald-500/20">✓ {toast}</div>}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white">Add New Category</h3>
              <button onClick={() => setShowAdd(false)} className="text-slate-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-3 mb-5">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Category Name</label>
                <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Street Dog Menace" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 outline-none focus:border-teal-500/50" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Routing Department</label>
                <input value={newDept} onChange={e => setNewDept(e.target.value)} placeholder="e.g. Municipal Corp" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 outline-none focus:border-teal-500/50" />
              </div>
            </div>
            <button onClick={addCategory} className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm transition">Add Category</button>
          </div>
        </div>
      )}

      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-4 border-b border-slate-800/80">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
            <ShieldCheck className="text-teal-400" size={16} /> Complaint Taxonomy
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Categories</h1>
          <p className="text-slate-400 text-[15px] leading-relaxed">Manage and toggle complaint routing categories for each department.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-teal-500/10">
          <Plus size={16} /> Add Category
        </button>
      </header>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Categories', value: categories.length, color: 'text-teal-400' },
          { label: 'Active', value: categories.filter(c => c.active).length, color: 'text-emerald-400' },
          { label: 'Total Complaints Routed', value: categories.reduce((s, c) => s + c.complaints, 0), color: 'text-amber-400' },
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
            <input className="bg-transparent flex-1 text-sm text-slate-300 placeholder-slate-500 outline-none" placeholder="Search categories or departments..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-1">
            {(['All', 'Active', 'Inactive'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === f ? 'bg-teal-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'}`}>{f}</button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map(cat => (
            <div key={cat.id} className="flex items-center justify-between p-5 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-700" style={{ backgroundColor: cat.color + '20', color: cat.color }}>
                  <Tag size={16} />
                </div>
                <div>
                  <p className="font-bold text-slate-200 text-sm group-hover:text-white transition">{cat.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Routes to: <span className="text-slate-400 font-semibold">{cat.dept}</span></p>
                </div>
              </div>
              <div className="flex items-center gap-5 shrink-0">
                <div className="flex items-center gap-1.5 text-sm">
                  <FileText size={12} className="text-slate-500" />
                  <span className="font-black text-slate-300">{cat.complaints}</span>
                  <span className="text-[10px] text-slate-600">complaints</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border hidden md:inline ${cat.active ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-slate-500 bg-slate-800 border-slate-700'}`}>
                  {cat.active ? 'Active' : 'Inactive'}
                </span>
                <button onClick={() => toggleActive(cat.id)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-bold transition-all bg-slate-900 border-slate-800 hover:border-slate-600 text-slate-400 hover:text-white">
                  {cat.active ? <><ToggleRight size={14} className="text-emerald-400" /> Disable</> : <><ToggleLeft size={14} /> Enable</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

import React from 'react';
import { Tags, Plus, Edit, Trash2 } from 'lucide-react';

const mockCategories = [
  { id: 1, name: 'Infrastructure', description: 'Roads, bridges, footpaths', complaints: 45, color: '#3b82f6', emoji: '🏗️' },
  { id: 2, name: 'Sanitation', description: 'Garbage, drainage, sewage', complaints: 38, color: '#10b981', emoji: '🧹' },
  { id: 3, name: 'Electricity', description: 'Power cuts, streetlights, faulty meters', complaints: 29, color: '#f59e0b', emoji: '⚡' },
  { id: 4, name: 'Water Supply', description: 'Water shortage, pipe leaks, contamination', complaints: 33, color: '#6366f1', emoji: '💧' },
  { id: 5, name: 'Roads & Transport', description: 'Potholes, traffic signals, road markings', complaints: 22, color: '#ef4444', emoji: '🚧' },
  { id: 6, name: 'Public Health', description: 'Hospital issues, waste disposal, hygiene', complaints: 17, color: '#8b5cf6', emoji: '🏥' },
  { id: 7, name: 'Encroachment', description: 'Illegal construction, land grabbing', complaints: 12, color: '#f97316', emoji: '⚠️' },
  { id: 8, name: 'Noise Pollution', description: 'Loud music, construction noise, traffic', complaints: 8, color: '#ec4899', emoji: '🔊' },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">

        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <Tags className="text-purple-500" size={30} />
              Complaint Categories
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage the categories used to classify citizen complaints.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-sm transition shadow">
            <Plus size={16} />
            Add Category
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mockCategories.map((cat) => (
            <div key={cat.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.emoji}</span>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">{cat.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{cat.description}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-500 transition">
                    <Edit size={14} />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 transition">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-slate-500">Active Complaints</span>
                  <span className="text-xs font-bold" style={{ color: cat.color }}>{cat.complaints}</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(cat.complaints / 50) * 100}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

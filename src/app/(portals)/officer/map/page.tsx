import React from 'react';
import { Map, MapPin, AlertTriangle, Layers, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default function OfficerMapPage() {
  return (
    <div className="flex flex-col gap-10 min-h-screen bg-[#020817] text-white p-6 md:p-10">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-4 border-b border-slate-800/80">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
            <ShieldCheck className="text-emerald-400" size={16} />
            Geospatial Intelligence
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Complaint Heatmap</h1>
          <p className="text-slate-400 text-[15px] leading-relaxed">AI-powered geospatial complaint density with live jurisdiction heatmaps.</p>
        </div>
        <div className="flex items-center gap-2">
          {['Heatmap', 'Markers', 'Clusters'].map(mode => (
            <button key={mode} className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all">
              {mode === 'Heatmap' ? <Layers size={13} /> : <MapPin size={13} />} {mode}
            </button>
          ))}
        </div>
      </header>

      {/* Density stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Hotspot Zones', value: 4, color: 'text-rose-400' },
          { label: 'Active Markers', value: 18, color: 'text-amber-400' },
          { label: 'Resolved Zones', value: 7, color: 'text-emerald-400' },
          { label: 'Your Jurisdiction', value: 'Zone 5', color: 'text-blue-400' },
        ].map(s => (
          <div key={s.label} className="bg-[#0F172A] rounded-xl p-5 border border-slate-800">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
            <p className={`text-2xl font-black mt-1.5 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Map placeholder */}
      <Card padding="none" className="bg-[#0F172A] border-slate-800 overflow-hidden" style={{ minHeight: '460px' }}>
        <div className="w-full h-full flex flex-col items-center justify-center gap-5 p-16 bg-gradient-to-br from-slate-950 via-[#0F172A] to-slate-900" style={{ minHeight: '460px' }}>
          <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Map size={36} className="text-emerald-400" />
          </div>
          <div className="text-center">
            <p className="font-black text-white text-xl tracking-tight">Live Complaint Heatmap</p>
            <p className="text-slate-400 text-sm mt-2 font-medium max-w-sm">Real-time geospatial visualization with cluster density and AI-identified risk zones across your jurisdiction.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 px-5 py-2.5 rounded-full border border-amber-500/20 font-bold">
            <AlertTriangle size={13} />
            Connect Google Maps API key to activate live map rendering
          </div>
        </div>
      </Card>

      {/* Legend */}
      <Card padding="lg" className="bg-[#0F172A] border-slate-800">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Density Legend</h2>
        <div className="flex flex-wrap gap-6">
          {[
            { color: '#ef4444', label: 'Critical — 10+ complaints' },
            { color: '#f97316', label: 'High — 6–9 complaints' },
            { color: '#f59e0b', label: 'Medium — 3–5 complaints' },
            { color: '#10b981', label: 'Low — 1–2 complaints' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-slate-400 font-semibold">{item.label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

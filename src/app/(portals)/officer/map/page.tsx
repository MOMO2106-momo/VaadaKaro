'use client';
import React, { useState } from 'react';
import { Map, MapPin, AlertTriangle, Layers, ShieldCheck, Flame, CheckCircle, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const HOTSPOTS = [
  { id: 1, zone: 'MG Road, Sector 12', category: 'Waterlogging', count: 14, priority: 'Critical', lat: '28.6130° N', lng: '77.2295° E' },
  { id: 2, zone: 'Bus Stand Area, Sector 23', category: 'Road Damage', count: 9, priority: 'High', lat: '28.6200° N', lng: '77.2100° E' },
  { id: 3, zone: 'Kirti Nagar Market', category: 'Garbage Overflow', count: 7, priority: 'High', lat: '28.6532° N', lng: '77.1485° E' },
  { id: 4, zone: 'Sector 5 – Residential', category: 'Water Supply', count: 5, priority: 'Medium', lat: '28.6100° N', lng: '77.2400° E' },
  { id: 5, zone: 'Old Town Junction', category: 'Electricity', count: 3, priority: 'Medium', lat: '28.6350° N', lng: '77.2250° E' },
];

const MAP_MODES = ['Heatmap', 'Markers', 'Clusters'] as const;
type MapMode = typeof MAP_MODES[number];

const PRIORITY_CONFIG: Record<string, { color: string; dot: string }> = {
  Critical: { color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', dot: 'bg-rose-500' },
  High: { color: 'text-orange-400 bg-orange-500/10 border-orange-500/20', dot: 'bg-orange-500' },
  Medium: { color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', dot: 'bg-amber-500' },
  Low: { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-500' },
};

export default function OfficerMapPage() {
  const [mode, setMode] = useState<MapMode>('Heatmap');
  const [selectedHotspot, setSelectedHotspot] = useState<typeof HOTSPOTS[0] | null>(null);

  return (
    <div className="flex flex-col gap-10 min-h-screen bg-[#020817] text-white p-6 md:p-10">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-4 border-b border-slate-800/80">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
            <ShieldCheck className="text-emerald-400" size={16} /> Geospatial Intelligence
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Complaint Heatmap</h1>
          <p className="text-slate-400 text-[15px] leading-relaxed">AI-powered geospatial complaint density with live jurisdiction heatmaps.</p>
        </div>
        <div className="flex items-center gap-2">
          {MAP_MODES.map(m => (
            <button key={m} onClick={() => setMode(m)} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${mode === m ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'}`}>
              {m === 'Heatmap' ? <Layers size={13} /> : <MapPin size={13} />} {m}
            </button>
          ))}
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Hotspot Zones', value: HOTSPOTS.filter(h => h.priority === 'Critical' || h.priority === 'High').length, color: 'text-rose-400', icon: Flame },
          { label: 'Active Markers', value: HOTSPOTS.reduce((s, h) => s + h.count, 0), color: 'text-amber-400', icon: MapPin },
          { label: 'Resolved Zones', value: 7, color: 'text-emerald-400', icon: CheckCircle },
          { label: 'Avg Response', value: '2.4d', color: 'text-blue-400', icon: Clock },
        ].map(s => (
          <div key={s.label} className="bg-[#0F172A] rounded-xl p-5 border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
              <s.icon size={16} className={s.color} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
              <p className={`text-2xl font-black mt-0.5 ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main content: Map + Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Map Canvas */}
        <Card padding="none" className="xl:col-span-2 bg-[#0F172A] border-slate-800 overflow-hidden" style={{ minHeight: '460px' }}>
          <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-16 bg-gradient-to-br from-slate-950 via-[#0c1628] to-slate-900 relative" style={{ minHeight: '460px' }}>
            {/* Simulated grid lines */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

            {/* Simulated pins */}
            {HOTSPOTS.map((h, i) => (
              <button key={h.id} onClick={() => setSelectedHotspot(h === selectedHotspot ? null : h)}
                className={`absolute w-5 h-5 rounded-full border-2 border-white transition-transform hover:scale-125 ${PRIORITY_CONFIG[h.priority].dot}`}
                style={{ top: `${20 + i * 15}%`, left: `${15 + i * 14}%` }}
                title={`${h.zone} — ${h.count} complaints`}
              />
            ))}

            <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center z-10">
              <Map size={36} className="text-emerald-400" />
            </div>
            <div className="text-center z-10">
              <p className="font-black text-white text-xl tracking-tight">Live Complaint Heatmap — {mode} View</p>
              <p className="text-slate-400 text-sm mt-2 font-medium max-w-sm">Real-time geospatial visualization with cluster density across your jurisdiction. Click pins to view zone details.</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 px-5 py-2.5 rounded-full border border-amber-500/20 font-bold z-10">
              <AlertTriangle size={13} /> Connect Google Maps API key to activate live tile rendering
            </div>
          </div>
        </Card>

        {/* Hotspot Sidebar */}
        <Card padding="lg" className="bg-[#0F172A] border-slate-800">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
            <Flame size={14} className="text-rose-400" /> Active Hotspots
          </h2>
          <div className="space-y-3">
            {HOTSPOTS.map(h => {
              const cfg = PRIORITY_CONFIG[h.priority];
              const isSelected = selectedHotspot?.id === h.id;
              return (
                <button key={h.id} onClick={() => setSelectedHotspot(isSelected ? null : h)} className={`w-full text-left p-3.5 rounded-xl border transition-all ${isSelected ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-slate-200 text-xs leading-snug">{h.zone}</p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${cfg.color}`}>{h.priority}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">{h.category}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    <span className="text-[10px] font-black text-slate-400">{h.count} complaints</span>
                    {isSelected && (
                      <span className="text-[9px] text-slate-500 font-mono ml-auto">{h.lat}, {h.lng}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      </div>

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

import React from 'react';
import { Map, MapPin, AlertTriangle, Layers } from 'lucide-react';

export default function OfficerMapPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">

        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <Map className="text-emerald-500" size={30} />
              Complaint Map & Heatmaps
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Visual map of complaints in your jurisdiction with density heatmaps.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition">
              <Layers size={14} /> Heatmap
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition">
              <MapPin size={14} /> Markers
            </button>
          </div>
        </header>

        {/* Map placeholder */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden" style={{ height: '500px' }}>
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-800">
            <Map size={48} className="text-emerald-400" />
            <div className="text-center">
              <p className="font-bold text-slate-700 dark:text-slate-300 text-lg">Interactive Complaint Map</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Live complaint heatmap with geofencing and cluster markers.</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-4 py-2 rounded-full border border-amber-200 dark:border-amber-500/20">
              <AlertTriangle size={12} />
              Map integration pending — connect Google Maps API
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-4 text-sm">Complaint Density Zones</h2>
          <div className="flex flex-wrap gap-4">
            {[
              { color: '#ef4444', label: 'Critical (10+ complaints)' },
              { color: '#f97316', label: 'High (6–9 complaints)' },
              { color: '#f59e0b', label: 'Medium (3–5 complaints)' },
              { color: '#10b981', label: 'Low (1–2 complaints)' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-slate-600 dark:text-slate-400">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

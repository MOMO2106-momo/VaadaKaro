"use client";

import React from "react";
import { MapPin, AlertTriangle } from "lucide-react";
import { Hotspot } from "@/lib/services/insights.service";

export default function HotspotPanel({ hotspots }: { hotspots: Hotspot[] }) {
  return (
    <div className="flex flex-col gap-6 w-full">
      {(!hotspots || hotspots.length === 0) ? (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-900/40 border border-slate-800/80 rounded-2xl text-center min-h-[180px]">
          <AlertTriangle className="w-10 h-10 text-slate-600 mb-3 opacity-60" />
          <p className="text-[14px] font-bold text-slate-400 mb-1">No critical hotspots detected</p>
          <p className="text-[12px] text-slate-500 max-w-xs leading-relaxed">
            All reports are geographically distributed within normal variance thresholds.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {hotspots.map((hs) => {
            const isUrgent = hs.priority === 'URGENT';
            const isHigh = hs.priority === 'HIGH';
            
            return (
              <div 
                key={hs.id} 
                className="flex items-center justify-between p-5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-slate-700/80 transition-all duration-300"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Map Pin Glow Icon */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                    isUrgent ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                    isHigh ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 
                    'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    <MapPin className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <strong className="text-[15px] font-extrabold text-white truncate max-w-[180px] sm:max-w-none">
                        {hs.category || 'Uncategorized'}
                      </strong>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wide uppercase ${
                        isUrgent ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        isHigh ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {hs.priority}
                      </span>
                    </div>
                    <p className="text-[12px] font-medium text-slate-500 leading-snug">
                      {hs.count} related reports clustered in this zone.
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right font-mono text-[11px] font-bold text-slate-500 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
                  RADIUS ~500m
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import React from "react";
import { Zap, Target, Activity, CheckCircle2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { CommunityInsight } from "@/lib/services/insights.service";

interface HealthScore {
  score: number;
  factors: {
    resolutionRate: number;
    engagement: number;
  };
}

interface AIInsightsProps {
  insights: CommunityInsight[];
  health: HealthScore;
}

export default function AIInsights({ insights, health }: AIInsightsProps) {
  // Safe default for score
  const score = typeof health?.score === "number" && !isNaN(health.score) ? health.score : 100;
  const resolutionRate = typeof health?.factors?.resolutionRate === "number" && !isNaN(health.factors.resolutionRate) ? health.factors.resolutionRate : 100;
  
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Health Score Panel */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/60 to-emerald-950/20 p-6 shadow-inner">
        {/* Glow decoration */}
        <div className="absolute -right-16 -top-16 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />

        <div className="flex items-center justify-between mb-6">
          <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" />
            Community Health Score
          </h4>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/20">
            LIVE AI ANALYSIS
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Circular Score */}
          <div className="relative flex items-center justify-center w-24 h-24 rounded-full border-4 border-slate-800 bg-slate-950 shadow-inner shrink-0">
            {/* Visual Arc indicator using absolute overlay */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 border-r-emerald-500 animate-pulse" />
            <div className="text-center">
              <span className="text-3xl font-black text-white">{score}</span>
              <span className="text-sm font-bold text-emerald-400">%</span>
            </div>
          </div>

          {/* Description */}
          <div className="flex-1 text-center sm:text-left space-y-1">
            <p className="text-[15px] font-bold text-white">
              The community health index is <span className="text-emerald-400">{score > 70 ? 'Excellent' : 'Stable'}</span>.
            </p>
            <p className="text-[13px] text-slate-400 leading-relaxed">
              Calculated based on {resolutionRate}% resolution rate and active community verification across all municipal wards.
            </p>
          </div>
        </div>
      </div>

      {/* Insights Cards List */}
      {(!insights || insights.length === 0) ? (
        <div className="p-8 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl text-[14px] text-slate-500 font-bold">
          No insights generated yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {insights.map((insight, idx) => {
            const isResolution = insight.type === 'RESOLUTION';
            const isVolume = insight.type === 'VOLUME';
            const isEngagement = insight.type === 'ENGAGEMENT';

            return (
              <div 
                key={idx} 
                className="flex flex-col justify-between p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 hover:border-slate-700/80 transition-all duration-300 min-h-[140px]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    {insight.title}
                  </span>
                  <div className={`p-2 rounded-xl shrink-0 ${
                    isResolution ? 'bg-emerald-500/10 text-emerald-400' :
                    isVolume ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {isResolution && <CheckCircle2 className="w-4 h-4" />}
                    {isVolume && <Target className="w-4 h-4" />}
                    {isEngagement && <Zap className="w-4 h-4" />}
                  </div>
                </div>

                <div className="space-y-1 mt-auto">
                  <div className="text-xl font-extrabold text-white truncate">
                    {insight.value}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight">
                    {insight.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

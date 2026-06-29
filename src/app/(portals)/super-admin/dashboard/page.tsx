import React from 'react';
import { Server, Shield, Database, Users, ShieldAlert } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default function SuperAdminDashboard() {
  return (
    <div className="flex flex-col gap-10 min-h-screen bg-[#020817] text-white">
      {/* Header */}
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-4 border-b border-slate-800/80">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
            <ShieldAlert size={16} className="text-rose-500" />
            VaadaKaro Super Admin Portal
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Platform Control Center
          </h1>
          <p className="text-slate-400 text-[15px] leading-relaxed">
            Complete system overview, master administration, database metrics, and configuration.
          </p>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Platform Users', value: '4,917', icon: Users, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
          { label: 'System Load', value: '0.8%', icon: Server, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'DB Health', value: '99.9%', icon: Database, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Security Status', value: 'Active', icon: Shield, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
        ].map((stat, i) => (
          <Card key={i} padding="lg" className="h-[150px] flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 bg-[#0F172A] border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[12px] uppercase font-bold text-slate-500 tracking-widest">{stat.label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.bg}`}>
                <stat.icon size={16} className={stat.color} />
              </div>
            </div>
            <div>
              <div className="text-4xl font-black text-white mb-1">{stat.value}</div>
            </div>
          </Card>
        ))}
      </section>

      {/* Main logs */}
      <Card padding="lg" className="bg-[#0F172A] border-slate-800 min-h-[300px]">
        <h2 className="text-xl font-bold text-white flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          Platform Activity Overview
        </h2>
        <div className="flex flex-col items-center justify-center p-12 bg-slate-950/40 border border-slate-800/80 rounded-2xl text-slate-500 text-center gap-3 min-h-[180px]">
          <p className="font-bold text-slate-400 text-base">Platform status synchronization active</p>
          <p className="text-sm text-slate-500 font-medium">Audit logs, system settings, and cross-platform analytics will populate here.</p>
        </div>
      </Card>
    </div>
  );
}

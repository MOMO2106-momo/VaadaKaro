export const dynamic = "force-dynamic";
import React from 'react';
import { 
  FileText, 
  Clock, 
  Activity, 
  TrendingUp,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { getOfficerStats } from '@/lib/actions/officerActions';
import { Card } from '@/components/ui/Card';

export default async function OfficerOverview() {
  const result = await getOfficerStats();
  const stats = (result?.success && result.stats) ? result.stats : {
    total: 0,
    pending: 0,
    underReview: 0,
    inProgress: 0,
    resolved: 0,
    resolvedToday: 0
  };

  const statCards = [
    { 
      label: 'Assigned Complaints', 
      value: stats.total, 
      icon: FileText, 
      color: 'text-blue-400', 
      bg: 'bg-blue-500/10 border-blue-500/20' 
    },
    { 
      label: 'Pending Review', 
      value: stats.pending, 
      icon: Clock, 
      color: 'text-amber-400', 
      bg: 'bg-amber-500/10 border-amber-500/20' 
    },
    { 
      label: 'In Progress', 
      value: stats.inProgress, 
      icon: Activity, 
      color: 'text-purple-400', 
      bg: 'bg-purple-500/10 border-purple-500/20' 
    },
    { 
      label: 'Resolved Today', 
      value: stats.resolvedToday, 
      icon: TrendingUp, 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-500/10 border-emerald-500/20' 
    },
  ];

  return (
    <div className="flex flex-col gap-10 min-h-screen bg-[#020817] text-white">
      {/* Header */}
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-4 border-b border-slate-800/80">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
            <ShieldCheck size={16} className="text-emerald-500" />
            VaadaKaro Officer Portal
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Officer Command Center
          </h1>
          <p className="text-slate-400 text-[15px] leading-relaxed">
            Monitor and manage citizen grievances with administrative precision.
          </p>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
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

      {/* Action required */}
      <Card padding="lg" className="flex flex-col bg-[#0F172A] border-slate-800 min-h-[300px]">
        <h2 className="text-xl font-bold text-white flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <AlertCircle size={24} className="text-amber-500" />
          High Priority Attention Required
        </h2>
        
        <div className="flex flex-col items-center justify-center p-12 bg-slate-950/40 border border-slate-800/80 rounded-2xl text-slate-500 text-center gap-3 min-h-[180px]">
          <p className="font-bold text-slate-400 text-base">Strategic workload monitoring active</p>
          <p className="text-sm text-slate-500">High priority cases will appear here as they are filed.</p>
        </div>
      </Card>
    </div>
  );
}

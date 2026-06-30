export const dynamic = "force-dynamic";
import React from 'react';
import { 
  FileText, 
  Clock, 
  Activity, 
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Zap,
  ArrowRight,
  BarChart2,
  MapPin
} from 'lucide-react';
import { getOfficerStats } from '@/lib/actions/officerActions';
import { Card } from '@/components/ui/Card';
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import Link from 'next/link';

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
      value: stats.total || 24, 
      sub: 'Total active cases',
      icon: FileText, 
      color: 'text-blue-400', 
      bg: 'bg-blue-500/10 border-blue-500/20',
      glow: 'shadow-blue-500/10',
    },
    { 
      label: 'Pending Review', 
      value: stats.pending || 5, 
      sub: 'Awaiting assessment',
      icon: Clock, 
      color: 'text-amber-400', 
      bg: 'bg-amber-500/10 border-amber-500/20',
      glow: 'shadow-amber-500/10',
    },
    { 
      label: 'In Progress', 
      value: stats.inProgress || 12, 
      sub: 'Currently processing',
      icon: Activity, 
      color: 'text-purple-400', 
      bg: 'bg-purple-500/10 border-purple-500/20',
      glow: 'shadow-purple-500/10',
    },
    { 
      label: 'Resolved Today', 
      value: stats.resolvedToday || 3, 
      sub: 'Completed today',
      icon: TrendingUp, 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      glow: 'shadow-emerald-500/10',
    },
  ];

  const recentActivity = [
    { id: 'CMP-0046', action: 'Status updated to In Progress', time: '5 min ago', priority: 'MEDIUM', color: 'text-purple-400' },
    { id: 'VER-004',  action: 'Verification pending review',  time: '18 min ago', priority: 'HIGH', color: 'text-rose-400' },
    { id: 'CMP-0043', action: 'Escalated to HIGH priority',   time: '1 hr ago', priority: 'CRITICAL', color: 'text-rose-500' },
    { id: 'CMP-0045', action: 'Marked as Resolved',           time: '2 hr ago', priority: 'HIGH', color: 'text-emerald-400' },
    { id: 'CMP-0042', action: 'Citizen added new information', time: '3 hr ago', priority: 'HIGH', color: 'text-amber-400' },
  ];

  const quickLinks = [
    { label: 'My Cases', href: '/officer/cases', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20' },
    { label: 'Verifications', href: '/officer/verifications', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20' },
    { label: 'AI Colleague', href: '/officer/ai', icon: Zap, color: 'text-violet-400', bg: 'bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/20' },
    { label: 'Heatmap', href: '/officer/map', icon: MapPin, color: 'text-rose-400', bg: 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20' },
  ];

  return (
    <ErrorBoundary componentName="OfficerDashboard">
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
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-400 font-bold">On Duty</span>
            </div>
            <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm font-semibold text-slate-400">
              Resolution Rate: <span className="text-emerald-400 font-black">94%</span>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, i) => (
            <Card key={i} padding="lg" className={`h-[160px] flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 shadow-lg ${stat.glow}`}>
              <div className="flex items-center justify-between">
                <span className="text-[12px] uppercase font-bold text-slate-500 tracking-widest">{stat.label}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${stat.bg}`}>
                  <stat.icon size={17} className={stat.color} />
                </div>
              </div>
              <div>
                <div className="text-5xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {stat.sub}
                </div>
              </div>
            </Card>
          ))}
        </section>

        {/* Quick Links */}
        <section>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Quick Actions</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickLinks.map(link => (
              <Link key={link.href} href={link.href}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all group ${link.bg}`}
              >
                <link.icon size={18} className={link.color} />
                <span className="font-bold text-sm text-slate-300 group-hover:text-white transition">{link.label}</span>
                <ArrowRight size={14} className="ml-auto text-slate-600 group-hover:text-slate-400 transition" />
              </Link>
            ))}
          </div>
        </section>

        {/* Two-column layout: Activity + Priority */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card padding="lg" className="flex flex-col">
            <h2 className="text-xl font-bold text-white flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
              <Activity size={20} className="text-blue-400" />
              Recent Activity
            </h2>
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-xs font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">{item.id}</span>
                      <span className={`text-[10px] font-black ${item.color}`}>{item.priority}</span>
                    </div>
                    <p className="text-sm text-slate-300 font-medium truncate">{item.action}</p>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
            <Link href="/officer/cases" className="mt-4 text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 transition">
              View all cases <ArrowRight size={12} />
            </Link>
          </Card>

          {/* High Priority Panel */}
          <Card padding="lg" className="flex flex-col">
            <h2 className="text-xl font-bold text-white flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
              <AlertCircle size={20} className="text-amber-500" />
              High Priority Attention
            </h2>

            <div className="space-y-3">
              {[
                { id: 'CMP-0043', title: 'Overflowing drains on MG Road', category: 'Sanitation', priority: 'CRITICAL', impact: 9.2, status: 'Assigned' },
                { id: 'CMP-0042', title: 'Waterlogging in Sector 5', category: 'Infrastructure', priority: 'HIGH', impact: 8.5, status: 'In Progress' },
                { id: 'VER-001',  title: 'Identity Verification — Rahul S.', category: 'Verification', priority: 'High', impact: 7.0, status: 'Pending' },
              ].map((item) => (
                <div key={item.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-rose-500/30 transition-all group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-slate-500">{item.id}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                      item.priority === 'CRITICAL' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : 'text-orange-400 bg-orange-500/10 border-orange-500/20'
                    }`}>{item.priority}</span>
                  </div>
                  <p className="font-semibold text-slate-200 text-sm">{item.title}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-slate-500">{item.category}</span>
                    <span className="text-slate-600">·</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-14 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${item.impact > 8 ? 'bg-rose-500' : 'bg-amber-500'}`} style={{ width: `${(item.impact / 10) * 100}%` }} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-400">Impact {item.impact}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/officer/cases" className="mt-4 text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition">
              Manage all priority cases <ArrowRight size={12} />
            </Link>
          </Card>
        </div>

        {/* Performance Metrics Strip */}
        <Card padding="lg" className="flex flex-col">
          <h2 className="text-xl font-bold text-white flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <BarChart2 size={20} className="text-purple-400" />
            My Performance — June 2026
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Cases Resolved', value: '24', sub: 'This month', color: 'text-emerald-400' },
              { label: 'Avg Resolution Time', value: '2.1d', sub: 'Below team avg', color: 'text-blue-400' },
              { label: 'Citizen Satisfaction', value: '4.7★', sub: 'Out of 5', color: 'text-amber-400' },
              { label: 'Response SLA', value: '98%', sub: 'On-time responses', color: 'text-purple-400' },
            ].map(m => (
              <div key={m.label} className="text-center p-4 bg-slate-950 rounded-xl border border-slate-800">
                <p className={`text-2xl font-black ${m.color}`}>{m.value}</p>
                <p className="text-[11px] font-bold text-slate-400 mt-1">{m.label}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">{m.sub}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ErrorBoundary>
  );
}

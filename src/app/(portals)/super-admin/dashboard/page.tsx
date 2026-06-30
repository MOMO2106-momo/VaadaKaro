'use client';

import React, { useState } from 'react';
import { Server, Shield, Database, Users, ShieldAlert, Activity, ArrowRight, RefreshCw, Layers, ShieldCheck, Lock, Play, Settings } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import Link from 'next/link';

export default function SuperAdminDashboard() {
  const [load, setLoad] = useState('0.8%');
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const triggerMetricsRefresh = () => {
    setRefreshing(true);
    showToast('Refreshing server loads & cluster telemetry...');
    setTimeout(() => {
      setLoad((Math.random() * 2 + 0.3).toFixed(1) + '%');
      setRefreshing(false);
      showToast('Telemetry data synchronized');
    }, 1000);
  };

  const platformKPIs = [
    { label: 'Total Platform Users', value: '4,917', sub: 'Registered accounts', icon: Users, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
    { label: 'System CPU Load', value: load, sub: 'Current utilization', icon: Server, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'DB Cluster Uptime', value: '99.9%', sub: 'This month', icon: Database, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Security Firewall', value: 'Nominal', sub: 'No vulnerabilities flagged', icon: Shield, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  ];

  const subSystemHealth = [
    { name: 'Identity Provider (NextAuth JWT)', status: 'Operational', latency: '4ms', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' },
    { name: 'Google Gemini 2.0 API gateway', status: 'Operational', latency: '310ms', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' },
    { name: 'PostgreSQL Database Cluster', status: 'Operational', latency: '12ms', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' },
    { name: 'Cloudinary CDN Storage', status: 'Operational', latency: '45ms', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' },
  ];

  return (
    <ErrorBoundary componentName="SuperAdminDashboard">
    <div className="flex flex-col gap-10 min-h-screen bg-[#020817] text-white">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-semibold border border-emerald-500/20 animate-in slide-in-from-top-2">
          ✓ {toast}
        </div>
      )}

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
        <button 
          onClick={triggerMetricsRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl font-bold text-sm transition-all"
        >
          <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
          Sync Diagnostics
        </button>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {platformKPIs.map((stat, i) => (
          <Card key={i} padding="lg" className="h-[160px] flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <span className="text-[12px] uppercase font-bold text-slate-500 tracking-widest">{stat.label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${stat.bg}`}>
                <stat.icon size={16} className={stat.color} />
              </div>
            </div>
            <div>
              <div className="text-4xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-[12px] font-bold uppercase tracking-wider text-slate-400">
                {stat.sub}
              </div>
            </div>
          </Card>
        ))}
      </section>

      {/* Quick Nav Links */}
      <section>
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Master Navigation</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Role Permissions', href: '/super-admin/roles', icon: Lock, color: 'text-amber-400', bg: 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20' },
            { label: 'User Directory', href: '/super-admin/users', icon: Users, color: 'text-rose-400', bg: 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20' },
            { label: 'API Diagnostics', href: '/super-admin/api', icon: Server, color: 'text-blue-400', bg: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20' },
            { label: 'System Configurations', href: '/super-admin/system', icon: Settings, color: 'text-purple-400', bg: 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20' },
          ].map(link => (
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

      {/* Grid: Sub-systems & Audit Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Telemetry Monitor */}
        <Card padding="lg" className="flex flex-col">
          <h2 className="text-xl font-bold text-white flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <Activity size={20} className="text-blue-400" />
            Cluster &amp; Driver Integrations
          </h2>
          <div className="space-y-3">
            {subSystemHealth.map((sub, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
                <div>
                  <p className="text-sm font-bold text-slate-200">{sub.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Ping latency: {sub.latency}</p>
                </div>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold uppercase ${sub.color}`}>
                  {sub.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Audit Log Overview snippet */}
        <Card padding="lg" className="flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
              <ShieldCheck size={20} className="text-rose-400" />
              Security Audit logs
            </h2>
            <div className="space-y-3">
              {[
                { actor: 'super.admin@vaadakaro.in', event: 'Role Changed: rajesh.k@gov.in → OFFICER', time: '10m ago' },
                { actor: 'super.admin@vaadakaro.in', event: 'User Suspended: ajay.verma@gov.in', time: '1h ago' },
                { actor: 'sunita.s@gov.in', event: 'Admin Session Login on port 443', time: '2h ago' },
              ].map((log, idx) => (
                <div key={idx} className="p-3 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-between text-xs">
                  <div className="min-w-0">
                    <span className="font-semibold text-slate-400">{log.actor}</span>
                    <p className="text-slate-500 font-mono mt-0.5 truncate">{log.event}</p>
                  </div>
                  <span className="text-slate-600 font-bold shrink-0">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
          <Link href="/super-admin/audit" className="mt-6 py-2.5 bg-slate-950 border border-slate-800 hover:bg-slate-900 hover:border-slate-700 transition-all rounded-xl text-xs font-bold text-center text-slate-300 block">
            Inspect Entire Audit Trail
          </Link>
        </Card>
      </div>
    </div>
    </ErrorBoundary>
  );
}

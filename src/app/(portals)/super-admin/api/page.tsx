'use client';

import React, { useState } from 'react';
import { Server, Activity, ShieldAlert, Cpu, HardDrive, RefreshCw, Globe, ChevronRight, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface APIEndpoint {
  id: number;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  latency: number;
  calls: string;
  status: number;
  health: 'Healthy' | 'Degraded' | 'Down';
}

const INITIAL_ENDPOINTS: APIEndpoint[] = [
  { id: 1, method: 'GET', path: '/api/complaints', latency: 45, calls: '124.5k', status: 200, health: 'Healthy' },
  { id: 2, method: 'POST', path: '/api/complaints/submit', latency: 180, calls: '12.8k', status: 201, health: 'Healthy' },
  { id: 3, method: 'GET', path: '/api/ai/health', latency: 310, calls: '8.4k', status: 200, health: 'Healthy' },
  { id: 4, method: 'POST', path: '/api/auth/session', latency: 120, calls: '88.1k', status: 200, health: 'Healthy' },
  { id: 5, method: 'GET', path: '/api/users/profile', latency: 65, calls: '54.2k', status: 200, health: 'Healthy' },
  { id: 6, method: 'GET', path: '/api/map/hotspots', latency: 420, calls: '3.1k', status: 200, health: 'Degraded' },
  { id: 7, method: 'POST', path: '/api/notifications/send', latency: 95, calls: '92.3k', status: 200, health: 'Healthy' },
];

export default function APIMonitorPage() {
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>(INITIAL_ENDPOINTS);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const triggerPing = () => {
    setLoading(true);
    showToast('Pinging all services...');
    setTimeout(() => {
      setEndpoints(prev => prev.map(ep => ({
        ...ep,
        latency: Math.max(10, Math.floor(ep.latency + (Math.random() * 40 - 20)))
      })));
      setLoading(false);
      showToast('API metrics refreshed successfully');
    }, 1200);
  };

  const getMethodStyle = (method: string) => {
    switch (method) {
      case 'GET': return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
      case 'POST': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'PUT': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default: return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    }
  };

  return (
    <div className="flex flex-col gap-10 min-h-screen bg-[#020817] text-white p-6 md:p-10">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-semibold border border-emerald-500/20">
          ✓ {toast}
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-4 border-b border-slate-800/80">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
            <Server size={16} className="text-rose-500 animate-pulse" />
            Infrastructure Monitoring
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">API Monitor</h1>
          <p className="text-slate-400 text-[15px] leading-relaxed">
            Real-time status, latency metrics, database throughput, and remote AI service health.
          </p>
        </div>
        <button 
          onClick={triggerPing}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-800 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-rose-500/10"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Refreshing...' : 'Trigger Ping'}
        </button>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'System Status', value: 'Nominal', change: 'Uptime 99.98%', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Avg Latency', value: '115 ms', change: '-4ms vs last hour', icon: Cpu, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
          { label: 'DB Connections', value: '42 / 100', change: '0 pool errors', icon: HardDrive, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
          { label: 'AI API Endpoint', value: 'Connected', change: 'Gemini 2.0 Flash', icon: Globe, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
        ].map((s) => (
          <div key={s.label} className="bg-[#0F172A] rounded-xl p-5 border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${s.bg}`}>
                <s.icon size={14} className={s.color} />
              </div>
            </div>
            <div>
              <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
              <p className="text-[11px] text-slate-400 font-bold mt-1">{s.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Endpoint Table */}
      <Card padding="lg" className="bg-[#0F172A] border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
          <Globe className="text-rose-500" size={20} />
          API Gateway Registry
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-850 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <th className="pb-4 px-3">Method</th>
                <th className="pb-4 px-3">Endpoint Path</th>
                <th className="pb-4 px-3">Avg Latency</th>
                <th className="pb-4 px-3">Today's Volume</th>
                <th className="pb-4 px-3">HTTP Status</th>
                <th className="pb-4 px-3 text-right">Gateway Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {endpoints.map((ep) => (
                <tr key={ep.id} className="hover:bg-slate-950/40 transition-colors">
                  <td className="py-4 px-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-black border ${getMethodStyle(ep.method)}`}>
                      {ep.method}
                    </span>
                  </td>
                  <td className="py-4 px-3 text-sm font-mono text-slate-300 font-semibold">{ep.path}</td>
                  <td className="py-4 px-3 text-sm font-semibold text-slate-400">{ep.latency} ms</td>
                  <td className="py-4 px-3 text-sm text-slate-400 font-medium">{ep.calls}</td>
                  <td className="py-4 px-3 text-sm font-bold text-emerald-400">{ep.status}</td>
                  <td className="py-4 px-3 text-right">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase border ${
                      ep.health === 'Healthy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      ep.health === 'Degraded' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {ep.health}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

'use client';
import React, { useState } from 'react';
import { BarChart3, Users, CheckCircle, Clock, ShieldAlert, Sparkles, Building, Flame, Heart, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

const STATS = [
  { label: 'Total Grievances Filed', value: '54,231', sub: 'All time registrations', icon: BarChart3, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { label: 'Successfully Resolved', value: '48,110', sub: '88.7% resolution rate', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { label: 'Avg Resolution Time', value: '2.1 Days', sub: 'Sector leading speed', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  { label: 'Citizen Trust Index', value: '94.2%', sub: 'Based on 12k+ reviews', icon: Heart, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
];

const DEPARTMENTS = [
  { name: 'Public Works Department (PWD)', resolved: '18,421', total: '20,102', rate: 91, satisfaction: '4.6/5', active: true },
  { name: 'Municipal Sanitation Board (MSD)', resolved: '14,899', total: '15,620', rate: 95, satisfaction: '4.8/5', active: true },
  { name: 'Delhi Jal Board (DJB)', resolved: '8,410', total: '9,120', rate: 92, satisfaction: '4.5/5', active: true },
  { name: 'Delhi Electricity Board (DEB)', resolved: '5,820', total: '5,900', rate: 98, satisfaction: '4.9/5', active: true },
  { name: 'Roads & Transport Authority (RTA)', resolved: '560', total: '1,489', rate: 37, satisfaction: '3.1/5', active: false },
];

const IMPACT_STORIES = [
  { id: 1, title: 'MG Road Waterlogging Resolution', desc: 'AI-assisted duplication filter flagged 18 identical complaints at Sector 12. Auto-escalated to local PWD officer; drainage pipeline cleared within 18 hours.', date: 'Today', status: 'Resolved' },
  { id: 2, title: 'Sector 5 Waste Hub Transformed', desc: 'Garbage dump reported by 42 citizens. Cleaned and converted into a community micro-park with plant containers within 3 days.', date: 'Yesterday', status: 'Resolved' },
  { id: 3, title: 'Connaught Place Streetlights Restored', desc: 'Faulty grid reported via civic portal. Repair crew dispatched, and all 15 streetlights verified active in audit loop.', date: '2 days ago', status: 'Resolved' },
];

export default function CityWideImpactDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'leaderboard' | 'stories'>('overview');

  return (
    <div className="flex flex-col gap-10 min-h-screen bg-[#020817] text-white p-6 md:p-10">
      
      {/* Header Banner */}
      <header className="relative flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-6 border-b border-slate-800/80 overflow-hidden rounded-2xl p-6 bg-slate-900/40 border border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-teal-500/5 pointer-events-none" />
        <div className="space-y-3 max-w-3xl relative z-10">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
            <Sparkles className="text-teal-400" size={16} />
            City-Wide Civic Transparency
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
            Delhi Impact <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-500">Dashboard</span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Real-time status of civic grievances, department resolution rates, and live community transformation stories.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 relative z-10">
          <Link href="/file-complaint" className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-teal-500/10 flex items-center gap-2">
            File Complaint <ArrowRight size={15} />
          </Link>
        </div>
      </header>

      {/* Navigation tabs */}
      <div className="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl max-w-md">
        {[
          { id: 'overview', label: 'Impact Overview' },
          { id: 'leaderboard', label: 'Department Leaderboard' },
          { id: 'stories', label: 'Success Stories' },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === t.id ? 'bg-slate-800 text-white border border-slate-700/50 shadow-sm' : 'text-slate-400 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(s => (
              <div key={s.label} className="bg-[#0F172A] rounded-xl p-5 border border-slate-800 flex items-center gap-4 hover:-translate-y-0.5 transition-all">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 ${s.bg}`}>
                  <s.icon size={18} className={s.color} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
                  <p className="text-3xl font-black mt-0.5 text-white">{s.value}</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Core Analytics Blocks */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* AI Diagnostics Card */}
            <Card padding="lg" className="bg-[#0F172A] border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <Sparkles className="text-teal-400" size={18} /> AI Civic Performance Report
              </h2>
              <div className="space-y-4">
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-400">Delhi Health Index</span>
                    <span className="text-xs font-black text-emerald-400">Excellent</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                    ✨ <span className="text-white font-bold">Key Insight:</span> Duplicate filtering has successfully saved over <span className="text-teal-400 font-black">2,410 hours</span> of municipal response time this month by cluster-routing related cases.
                  </p>
                </div>
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                    ⚡ <span className="text-white font-bold">Trend Analysis:</span> Sanitation complaints dropped by <span className="text-teal-400 font-black">12.4%</span> in residential blocks following the deployment of optimized trash route audits.
                  </p>
                </div>
              </div>
            </Card>

            {/* Recent Resolutions Feed */}
            <Card padding="lg" className="xl:col-span-2 bg-[#0F172A] border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <CheckCircle className="text-emerald-400" size={18} /> Live Resolutions
              </h2>
              <div className="space-y-3">
                {IMPACT_STORIES.slice(0, 2).map(story => (
                  <div key={story.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex justify-between gap-4">
                    <div>
                      <p className="font-bold text-slate-200 text-sm">{story.title}</p>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{story.desc}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full uppercase">
                        {story.status}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-2">{story.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}

      {activeTab === 'leaderboard' && (
        <Card padding="lg" className="bg-[#0F172A] border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <Building className="text-teal-400" size={20} /> Department Resolution Leaderboard
          </h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-850 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <th className="pb-4 px-3">Department</th>
                <th className="pb-4 px-3">Resolved / Total</th>
                <th className="pb-4 px-3">Resolution Rate</th>
                <th className="pb-4 px-3">Satisfaction Rating</th>
                <th className="pb-4 px-3">Operational Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {DEPARTMENTS.map((dept, i) => (
                <tr key={i} className="hover:bg-slate-950/40 transition-colors">
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-xs text-slate-400">
                        {i + 1}
                      </div>
                      <p className="font-bold text-slate-200 text-sm">{dept.name}</p>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-sm text-slate-400">{dept.resolved} / {dept.total}</td>
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-3">
                      <span className={`font-black text-sm ${dept.rate >= 90 ? 'text-emerald-400' : 'text-rose-400'}`}>{dept.rate}%</span>
                      <div className="w-24 h-1.5 bg-slate-900 rounded-full overflow-hidden hidden md:block">
                        <div className={`h-full ${dept.rate >= 90 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${dept.rate}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-sm font-bold text-slate-300">{dept.satisfaction}</td>
                  <td className="py-4 px-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${dept.active ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-slate-500 bg-slate-800 border-slate-700'}`}>
                      {dept.active ? 'Optimal' : 'Slowing'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {activeTab === 'stories' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {IMPACT_STORIES.map(story => (
            <Card key={story.id} padding="lg" className="bg-[#0F172A] border-slate-800 hover:border-slate-700 transition duration-200 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] text-slate-500 font-bold">{story.date}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full uppercase">
                    {story.status}
                  </span>
                </div>
                <h3 className="font-bold text-white text-base mb-2">{story.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{story.desc}</p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-500 font-bold">
                <span>Verification: 100% Audit Complete</span>
                <span>🏅 Verified</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Community Pledge Strip */}
      <Card padding="lg" className="bg-gradient-to-br from-slate-900 via-[#0F172A] to-slate-900 border-slate-800/80 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🤝 Community Commitments
          </h2>
          <p className="text-slate-400 text-xs mt-1.5 leading-relaxed max-w-xl">
            See civic commitments made by community groups and leaders. Over <span className="text-teal-400 font-bold">142 pledges</span> completed this month with photo evidence uploads.
          </p>
        </div>
        <Link href="/dashboard/promises" className="px-5 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-650 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl transition-all shadow-sm shrink-0 flex items-center gap-2">
          View Civic Promises <ArrowRight size={13} />
        </Link>
      </Card>
      
    </div>
  );
}

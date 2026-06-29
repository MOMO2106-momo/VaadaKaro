export const dynamic = "force-dynamic";

import { FileText, Wrench, ShieldCheck, MapPin, ChevronRight, Activity, Bot, Search } from "lucide-react";
import { auth } from "@/auth";
import { getUserComplaints } from "@/lib/actions/complaintActions";
import { getAICommunityInsights } from "@/lib/actions/insightActions";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import AIInsights from "@/components/dashboard/AIInsights";
import HotspotPanel from "@/components/dashboard/HotspotPanel";
import Link from "next/link";
import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface ComplaintData {
  id: string;
  trackingId: string;
  title?: string;
  category: string;
  status: string;
  createdAt: Date | string;
  location?: string;
  priority?: string;
}

export default async function CitizenDashboard() {
  const session = await auth();
  if (!session?.user?.id) return <div className="text-white p-12 text-center text-xl font-bold">401 Unauthorized Request</div>;
  const user = session.user;

  const { complaints = [] } = await getUserComplaints() as { complaints: ComplaintData[] };
  const aiResult = await getAICommunityInsights();

  const activeCount = complaints.filter(c => ['SUBMITTED', 'UNDER_REVIEW', 'IN_PROGRESS'].includes(c.status)).length;
  const resolvedCount = complaints.filter(c => c.status === 'RESOLVED').length;
  const resolutionRate = complaints.length ? Math.round((resolvedCount / complaints.length) * 100) : 0;

  return (
    <ErrorBoundary componentName="DashboardRoot">
      <div className="flex flex-col gap-10">

        {/* HEADER SECTION */}
        <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-2 border-b border-slate-800/80">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
              <ShieldCheck size={16} className="text-emerald-500" />
              VaadaKaro Citizen Portal
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-slate-400 text-[15px] leading-relaxed">
              Welcome back, {user?.name}. Oversee your civic grievances, track active complaints, and consult VaadaAI for legal insights in one secure workspace.
            </p>
          </div>

          <Button
            href="/file-complaint"
            variant="primary"
            size="lg"
            className="shrink-0"
          >
            <Wrench size={18} /> Lodge Complaint
          </Button>
        </header>

        {/* STATISTICS GRID */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Total Reports", val: complaints.length, sub: "All registered issues" },
            { title: "Active Reports", val: activeCount, sub: "Processing instances" },
            { title: "Resolved", val: resolvedCount, sub: `Resolution rate ${resolutionRate}%`, highlight: true },
            { title: "Trust Score", val: 850, sub: "Current civic reputation" }
          ].map((stat, i) => (
            <Card key={i} padding="lg" className="h-[160px] flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-start justify-between">
                <span className="text-[12px] uppercase font-bold text-slate-500 tracking-widest">{stat.title}</span>
              </div>
              <div>
                <div className="text-4xl font-black text-white mb-1">{stat.val}</div>
                <div className={`text-[12px] font-bold uppercase tracking-wider ${stat.highlight ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {stat.sub}
                </div>
              </div>
            </Card>
          ))}
        </section>

        {/* MAIN CONTENT GRID (No duplicated sidebars) */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Active Tracking */}
          <Card padding="lg" className="min-h-[400px] flex flex-col xl:col-span-2">
            <header className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <FileText className="text-blue-500" />
                Active Tracking
              </h3>
              <Link href="/citizen/complaints" className="text-[13px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wide flex items-center gap-1">
                View All <ChevronRight size={14} />
              </Link>
            </header>

            <div className="flex flex-col flex-1 gap-4">
              {complaints.length > 0 ? (
                complaints.slice(0, 5).map((c, i) => (
                  <div key={c.id || i} className="group flex flex-col md:flex-row justify-between md:items-center gap-4 bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="bg-slate-950 text-slate-400 px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase border border-slate-800">
                          ID: {c.trackingId}
                        </span>
                        <span className={`px-2 py-0.5 text-[11px] font-bold rounded uppercase ${c.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}`}>
                          {(c.status || 'SUBMITTED').replace("_", " ")}
                        </span>
                      </div>
                      <h4 className="text-[15px] font-bold text-white truncate max-w-lg">
                        {c.title || `Grievance Report - ${c.category}`}
                      </h4>
                      <div className="flex items-center gap-4 text-[13px] font-medium text-slate-500">
                        <span className="flex items-center gap-1.5"><Wrench size={14} /> {c.category}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={14} /> {c.location || "Location pending"}</span>
                      </div>
                    </div>
                    <Link href={`/citizen/complaints/${c.trackingId}`} className="shrink-0 px-5 py-2.5 bg-[#0F172A] border border-slate-700 hover:border-slate-500 text-slate-300 text-[13px] font-bold rounded-xl transition-all shadow-sm group-hover:bg-slate-800">
                      Monitor Case
                    </Link>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center bg-slate-900/50 rounded-xl border border-slate-800/50 text-slate-500 flex flex-col justify-center items-center h-full">
                  <Search size={40} className="text-slate-600 mb-4 opacity-50" />
                  <p className="font-bold text-slate-400 text-lg mb-2">No active reports</p>
                  <p className="text-[14px] text-slate-500">You currently have zero active tracking numbers. Register an issue to begin.</p>
                  <Button href="/file-complaint" variant="secondary" size="md" className="mt-6">
                    Initiate Process
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Hotspot Pulse */}
          <Card padding="lg" className="flex flex-col h-full">
            <header className="mb-6">
              <h3 className="text-xl font-bold text-white mb-1.5">Regional Hotspots</h3>
              <p className="text-[13px] text-slate-400 font-medium">AI identified civic clusters in your zone.</p>
            </header>
            
            <div className="flex-1">
              {aiResult.success && aiResult.data ? (
                <HotspotPanel hotspots={aiResult.data.hotspots} />
              ) : (
                <div className="flex flex-col items-center justify-center p-12 bg-slate-900/40 border border-slate-800/80 rounded-2xl text-slate-500 text-center gap-3 min-h-[180px]">
                  <Activity size={28} className="opacity-50 animate-pulse text-emerald-500" />
                  <p className="text-[13px] font-bold">Metrics currently syncing...</p>
                </div>
              )}
            </div>
          </Card>

          {/* AI Diagnostics */}
          <Card padding="lg" className="flex flex-col h-full">
            <header className="mb-6">
              <h3 className="text-xl font-bold text-white mb-1.5">VaadaAI Analysis</h3>
              <p className="text-[13px] text-slate-400 font-medium">Machine learning community performance.</p>
            </header>

            <div className="flex-1">
              {aiResult.success && aiResult.data ? (
                <AIInsights insights={aiResult.data.insights} health={aiResult.data.health} />
              ) : (
                <div className="flex flex-col items-center justify-center p-12 bg-slate-900/40 border border-slate-800/80 rounded-2xl text-slate-500 text-center gap-3 min-h-[180px]">
                  <Bot size={28} className="opacity-50 animate-pulse text-emerald-500" />
                  <p className="text-[13px] font-bold">Diagnostics offline...</p>
                </div>
              )}
            </div>
          </Card>
        </div>

      </div>
    </ErrorBoundary>
  );
}
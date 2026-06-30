import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import { Shield, FileText, BrainCircuit, Table, CheckCircle, AlertCircle, Users, Building, Activity, TrendingUp, ArrowRight, BarChart2, Zap } from "lucide-react";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export default async function AdminDashboardPage() {
    const session = await auth();
    let user = session?.user as any;

    if (!user) {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        const demoRole = cookieStore.get('demo_role')?.value;
        if (demoRole === 'ADMIN' || demoRole === 'DEPARTMENT_ADMIN' || demoRole === 'SUPER_ADMIN') {
            user = {
                name: 'Demo Admin Officer',
                email: 'admin@vaadakaro.gov.in',
                role: demoRole,
                department: 'Public Works'
            };
        }
    }

    // Protect route
    if (!user || (user.role !== "ADMIN" && user.role !== "OFFICER" && user.role !== "SUPER_ADMIN" && user.role !== "DEPARTMENT_ADMIN")) {
        redirect("/");
    }

    const complaints = [
        { trackId: "CMP-0042", name: "Rahul S.", category: "Infrastructure", priority: "HIGH", impact: 8.5, date: "2026-06-25", status: "In Progress" },
        { trackId: "CMP-0043", name: "Priya M.", category: "Sanitation", priority: "CRITICAL", impact: 9.2, date: "2026-06-26", status: "Assigned" },
        { trackId: "CMP-0044", name: "Aman V.", category: "Electricity", priority: "MEDIUM", impact: 5.4, date: "2026-06-27", status: "Pending" },
        { trackId: "CMP-0045", name: "Neha K.", category: "Water Supply", priority: "HIGH", impact: 7.8, date: "2026-06-22", status: "Resolved" },
    ];

    const renderStatus = (status: string) => {
        switch (status) {
            case "Pending":
                return <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Pending</span>;
            case "Assigned":
                return <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Assigned</span>;
            case "In Progress":
                return <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">In Progress</span>;
            case "Resolved":
                return <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Resolved</span>;
            default:
                return <span className="text-slate-300">{status}</span>;
        }
    };

    const kpiCards = [
        { label: 'Total Filed (YTD)', value: '639', change: '+12%', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
        { label: 'Resolved This Month', value: '128', change: '+18%', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
        { label: 'Active Officers', value: '26', change: '+2 this week', icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
        { label: 'Platform Satisfaction', value: '94%', change: '+3%', icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    ];

    const deptAlerts = [
        { dept: 'Sanitation', issue: 'Backlog: 7 unresolved complaints >5 days', severity: 'warning' },
        { dept: 'Roads & Transport', issue: 'Only 73% resolution rate — below 80% threshold', severity: 'critical' },
        { dept: 'Electricity', issue: '99% resolution rate — top performer this month', severity: 'success' },
    ];

    return (
        <ErrorBoundary componentName="AdminDashboard">
        <div className="flex flex-col gap-10 min-h-screen bg-[#020817] text-white">
            {/* Header */}
            <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-4 border-b border-slate-800/80">
                <div className="space-y-3 max-w-2xl">
                    <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
                        <Shield className="text-emerald-500" size={16} />
                        VaadaKaro Administrative Portal
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">
                        Administrative Dashboard
                    </h1>
                    <p className="text-slate-400 text-[15px] leading-relaxed">
                        Manage grievances, review AI insights, and access official documents securely.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-sm">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-blue-400 font-bold">Admin Session</span>
                    </div>
                    <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm font-medium text-slate-300">
                        Role: <span className="text-emerald-400 font-bold">{user.role}</span>
                    </div>
                </div>
            </header>

            {/* KPI Stats */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {kpiCards.map((stat, i) => (
                    <div key={i} className="bg-[#0F172A] rounded-2xl border border-slate-800 p-5 hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] uppercase font-bold text-slate-500 tracking-widest">{stat.label}</span>
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${stat.bg}`}>
                                <stat.icon size={16} className={stat.color} />
                            </div>
                        </div>
                        <div>
                            <div className={`text-4xl font-black ${stat.color}`}>{stat.value}</div>
                            <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-emerald-400">
                                <TrendingUp size={10} /> {stat.change}
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Quick Nav */}
            <section>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Quick Actions</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: 'Manage Officers', href: '/admin/officers', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20' },
                        { label: 'Departments', href: '/admin/departments', icon: Building, color: 'text-indigo-400', bg: 'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/20' },
                        { label: 'Analytics', href: '/admin/analytics', icon: BarChart2, color: 'text-purple-400', bg: 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20' },
                        { label: 'AI Intelligence', href: '/admin/analytics', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20' },
                    ].map(link => (
                        <Link key={link.href + link.label} href={link.href}
                            className={`flex items-center gap-3 p-4 rounded-xl border transition-all group ${link.bg}`}
                        >
                            <link.icon size={18} className={link.color} />
                            <span className="font-bold text-sm text-slate-300 group-hover:text-white transition">{link.label}</span>
                            <ArrowRight size={14} className="ml-auto text-slate-600 group-hover:text-slate-400 transition" />
                        </Link>
                    ))}
                </div>
            </section>

            {/* Two-column: AI Summary + Department Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* AI Complaint Summary Panel */}
                <Card padding="lg" className="flex flex-col">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
                        <BrainCircuit className="text-indigo-400" size={20} />
                        AI Complaint Intelligence
                    </h2>
                    <div className="space-y-4">
                        <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">CMP-0043</span>
                                <span className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded uppercase">Action Required</span>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                <span className="font-bold text-white">AI Summary:</span> Multiple residents report severe waterlogging and overflowing drains on MG Road causing traffic blocks and hygiene concerns. Recurring issue pattern detected in this geofence.
                            </p>
                            <div className="mt-4 flex gap-2">
                                <button className="text-xs px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors">Generate Response</button>
                                <button className="text-xs px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold border border-slate-800 rounded-lg transition-colors">View Thread</button>
                            </div>
                        </div>
                        <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">CMP-0044</span>
                                <span className="text-xs font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded uppercase">Routine Review</span>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                <span className="font-bold text-white">AI Summary:</span> Request to replace non-functional streetlights in Sector 9. Smart meter logs indicate power but faulty bulbs. Issue isolated to one lane — low systemic risk.
                            </p>
                        </div>
                    </div>
                    <Link href="/admin/analytics" className="mt-4 text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1">
                        View full AI analytics <ArrowRight size={12} />
                    </Link>
                </Card>

                {/* Department Alerts */}
                <Card padding="lg" className="flex flex-col">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
                        <Activity className="text-amber-400" size={20} />
                        Department Alerts
                    </h2>
                    <div className="space-y-3 flex-1">
                        {deptAlerts.map((alert, i) => (
                            <div key={i} className={`p-4 rounded-xl border flex items-start gap-3 ${
                                alert.severity === 'critical' ? 'bg-rose-500/5 border-rose-500/20' :
                                alert.severity === 'warning' ? 'bg-amber-500/5 border-amber-500/20' :
                                'bg-emerald-500/5 border-emerald-500/20'
                            }`}>
                                <div className={`mt-0.5 shrink-0 ${
                                    alert.severity === 'critical' ? 'text-rose-400' :
                                    alert.severity === 'warning' ? 'text-amber-400' :
                                    'text-emerald-400'
                                }`}>
                                    {alert.severity === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-200 text-sm">{alert.dept}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{alert.issue}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link href="/admin/departments" className="mt-4 text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1">
                        Manage departments <ArrowRight size={12} />
                    </Link>
                </Card>
            </div>

            {/* Grievance Management Table */}
            <Card padding="lg">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
                    <Table className="text-sky-400" size={20} />
                    Recent Grievances
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                <th className="pb-4 px-3">Track ID</th>
                                <th className="pb-4 px-3">Citizen Name</th>
                                <th className="pb-4 px-3">Category</th>
                                <th className="pb-4 px-3">Priority</th>
                                <th className="pb-4 px-3">Impact Score</th>
                                <th className="pb-4 px-3">Date</th>
                                <th className="pb-4 px-3 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900">
                            {complaints.map((c) => (
                                <tr key={c.trackId} className="hover:bg-slate-950/40 transition-colors group">
                                    <td className="py-4 px-3 font-mono text-sm text-slate-400">{c.trackId}</td>
                                    <td className="py-4 px-3 text-sm font-bold text-slate-200">{c.name}</td>
                                    <td className="py-4 px-3 text-sm text-slate-400">{c.category}</td>
                                    <td className="py-4 px-3 text-sm">
                                        <span className={`font-bold ${c.priority === 'CRITICAL' ? 'text-rose-400' : c.priority === 'HIGH' ? 'text-orange-400' : 'text-blue-400'}`}>
                                            {c.priority}
                                        </span>
                                    </td>
                                    <td className="py-4 px-3 text-sm text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                                                <div className={`h-full ${c.impact > 8 ? 'bg-rose-500' : c.impact > 6 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${(c.impact / 10) * 100}%` }}></div>
                                            </div>
                                            <span className="font-bold text-slate-300">{c.impact}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-3 text-sm text-slate-400">{c.date}</td>
                                    <td className="py-4 px-3 text-right">
                                        {renderStatus(c.status)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Link href="/admin/officers" className="mt-4 text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1">
                    View all complaints via officers <ArrowRight size={12} />
                </Link>
            </Card>
        </div>
        </ErrorBoundary>
    );
}

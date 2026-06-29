import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import { Shield, FileText, UploadCloud, BrainCircuit, Table, CheckCircle, AlertCircle, FileSearch, Users, Building, Activity } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

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

    // Mock complaints data
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

    return (
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
                <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm font-medium text-slate-300">
                    Role: <span className="text-emerald-400 font-bold">{user.role}</span>
                </div>
            </header>

            {/* Top Grid: AI Summary & Document Vault */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* AI Complaint Summary Panel */}
                <Card padding="lg" className="flex flex-col bg-[#0F172A] border-slate-800">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
                        <BrainCircuit className="text-indigo-400" size={20} />
                        AI Complaint Summary
                    </h2>
                    <div className="space-y-4">
                        <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">CMP-0043</span>
                                <span className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded uppercase">Action Required</span>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                <span className="font-bold text-white">Summary:</span> Multiple residents report severe waterlogging and overflowing drains on MG Road causing traffic blocks and hygiene concerns. The AI model highlights a recurring issue in this exact geofence.
                            </p>
                            <div className="mt-4 flex gap-2">
                                <button className="text-xs px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors">Generate Response</button>
                                <button className="text-xs px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold border border-slate-800 rounded-lg transition-colors">View Full Thread</button>
                            </div>
                        </div>

                        <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">CMP-0044</span>
                                <span className="text-xs font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded uppercase">Routine Review</span>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                <span className="font-bold text-white">Summary:</span> A request to replace non-functional streetlights in Sector 9. The smart meter logs indicate power but faulty bulbs. Issue is isolated to one lane.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Official Document Vault */}
                <Card padding="lg" className="flex flex-col bg-[#0F172A] border-slate-800">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
                        <FileSearch className="text-emerald-400" size={20} />
                        Official Document Vault
                    </h2>

                    <div className="flex flex-col gap-6">
                        <div className="w-full flex items-center justify-center p-8 border-2 border-dashed border-slate-800 rounded-xl bg-slate-950/40 hover:bg-slate-950/80 transition-colors cursor-pointer group">
                            <div className="text-center">
                                <UploadCloud className="mx-auto text-slate-500 group-hover:text-emerald-400 mb-3" size={32} />
                                <p className="text-sm text-slate-300"><span className="text-emerald-400 font-bold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-slate-500 mt-1.5">Supports PDF, DOCX (Max 10MB) for Verification & Clearance</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Recent Vault Files</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <FileText className="text-blue-500" size={18} />
                                        <span className="text-sm font-bold text-slate-200">Q2_Sanitation_Clearance.pdf</span>
                                    </div>
                                    <button className="text-xs px-3 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg text-slate-300 font-bold transition-colors">View</button>
                                </li>
                                <li className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <FileText className="text-purple-500" size={18} />
                                        <span className="text-sm font-bold text-slate-200">PriyaM_NOC_Verification.docx</span>
                                    </div>
                                    <button className="text-xs px-3 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg text-slate-300 font-bold transition-colors">View</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Grievance Management Table */}
            <Card padding="lg" className="bg-[#0F172A] border-slate-800">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
                    <Table className="text-sky-400" size={20} />
                    Grievance Management
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
            </Card>
        </div>
    );
}

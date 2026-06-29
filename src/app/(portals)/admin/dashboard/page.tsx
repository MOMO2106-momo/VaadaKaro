import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import { Shield, FileText, UploadCloud, BrainCircuit, Table, CheckCircle, AlertCircle, FileSearch } from "lucide-react";

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
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">Pending</span>;
            case "Assigned":
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">Assigned</span>;
            case "In Progress":
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">In Progress</span>;
            case "Resolved":
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">Resolved</span>;
            default:
                return <span>{status}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                            <Shield className="text-emerald-500" size={32} />
                            Administrative Dashboard
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Manage grievances, review AI insights, and access official documents securely.
                        </p>
                    </div>
                    <div className="px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300">
                        Role: <span className="text-emerald-600 dark:text-emerald-400">{user.role}</span>
                    </div>
                </header>

                {/* Top Grid: AI Summary & Document Vault */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* AI Complaint Summary Panel */}
                    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
                            <BrainCircuit className="text-indigo-500" size={20} />
                            AI Complaint Summary
                        </h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-mono text-xs font-bold text-slate-500">CMP-0043</span>
                                    <span className="text-xs font-semibold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded">Action Required</span>
                                </div>
                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                    <span className="font-bold">Summary:</span> Multiple residents report severe waterlogging and overflowing drains on MG Road causing traffic blocks and hygiene concerns. The AI model highlights a recurring issue in this exact geofence.
                                </p>
                                <div className="mt-3 flex gap-2">
                                    <button className="text-xs px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded shadow-sm transition">Generate Response</button>
                                    <button className="text-xs px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 rounded transition">View Full Thread</button>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-mono text-xs font-bold text-slate-500">CMP-0044</span>
                                    <span className="text-xs font-semibold text-slate-500 bg-slate-200/50 px-2 py-0.5 rounded">Routine Review</span>
                                </div>
                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                    <span className="font-bold">Summary:</span> A request to replace non-functional streetlights in Sector 9. The smart meter logs indicate power but faulty bulbs. Issue is isolated to one lane.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Official Document Vault */}
                    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
                            <FileSearch className="text-emerald-500" size={20} />
                            Official Document Vault
                        </h2>

                        <div className="flex flex-col gap-4">
                            <div className="w-full flex items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/20 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer group">
                                <div className="text-center">
                                    <UploadCloud className="mx-auto text-slate-400 group-hover:text-emerald-500 mb-2" size={24} />
                                    <p className="text-sm text-slate-600 dark:text-slate-400"><span className="text-emerald-600 dark:text-emerald-400 font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-slate-500 mt-1">Supports PDF, DOCX (Max 10MB) for Verification & Clearance</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">Recent Vault Files</h3>
                                <ul className="space-y-2">
                                    <li className="flex items-center justify-between p-3 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition">
                                        <div className="flex items-center gap-3">
                                            <FileText className="text-blue-500" size={16} />
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Q2_Sanitation_Clearance.pdf</span>
                                        </div>
                                        <button className="text-xs px-2 py-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded hover:text-emerald-500 transition">View</button>
                                    </li>
                                    <li className="flex items-center justify-between p-3 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition">
                                        <div className="flex items-center gap-3">
                                            <FileText className="text-purple-500" size={16} />
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">PriyaM_NOC_Verification.docx</span>
                                        </div>
                                        <button className="text-xs px-2 py-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded hover:text-emerald-500 transition">View</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Grievance Management Table */}
                <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm overflow-hidden">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
                        <Table className="text-sky-500" size={20} />
                        Grievance Management
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-500 dark:text-slate-400">
                                    <th className="p-3">Track ID</th>
                                    <th className="p-3">Citizen Name</th>
                                    <th className="p-3">Category</th>
                                    <th className="p-3">Priority</th>
                                    <th className="p-3">Impact Score</th>
                                    <th className="p-3">Date</th>
                                    <th className="p-3 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {complaints.map((c) => (
                                    <tr key={c.trackId} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition group">
                                        <td className="p-3 font-mono text-sm text-slate-700 dark:text-slate-300">{c.trackId}</td>
                                        <td className="p-3 text-sm font-medium text-slate-900 dark:text-slate-100">{c.name}</td>
                                        <td className="p-3 text-sm text-slate-600 dark:text-slate-400">{c.category}</td>
                                        <td className="p-3 text-sm">
                                            <span className={`font-semibold ${c.priority === 'CRITICAL' ? 'text-rose-500' : c.priority === 'HIGH' ? 'text-orange-500' : 'text-blue-500'}`}>
                                                {c.priority}
                                            </span>
                                        </td>
                                        <td className="p-3 text-sm text-slate-600 dark:text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                    <div className={`h-full ${c.impact > 8 ? 'bg-rose-500' : c.impact > 6 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${(c.impact / 10) * 100}%` }}></div>
                                                </div>
                                                {c.impact}
                                            </div>
                                        </td>
                                        <td className="p-3 text-sm text-slate-500 dark:text-slate-400">{c.date}</td>
                                        <td className="p-3 text-right">
                                            {renderStatus(c.status)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

            </div>
        </div>
    );
}

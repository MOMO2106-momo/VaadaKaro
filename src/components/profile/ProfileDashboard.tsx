"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, Mail, MapPin, Building, Info, Loader2, Check, Globe, Clock, FileText, ChevronRight, Camera, X } from "lucide-react";
import { updateProfile } from "@/lib/actions/profileActions";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/Input";

interface ProfileDashboardProps {
    user: any;
}

const MOCK_SUBMISSIONS = [
    { id: "VDK-2026-B9F2A1C", title: "Pothole at MG Road Intersection", category: "Infrastructure", status: "In Progress", date: "26 Jun 2026", priority: "High", location: "Ward 12, MG Road", desc: "Large pothole causing severe traffic jams during peak hours." },
    { id: "VDK-2026-F4C9D3Z", title: "Street Lights Not Working", category: "Electrical", status: "Pending", date: "24 Jun 2026", priority: "Medium", location: "Sector 42, Block C", desc: "Entire lane has been dark for 3 days posing safety hazards." },
    { id: "VDK-2026-Y8E5B7X", title: "Illegal Garbage Dumping", category: "Sanitation", status: "Resolved", date: "15 Jun 2026", priority: "Low", location: "Kirti Nagar Open Ground", desc: "Recurring garbage dumping by commercial vehicles late night." },
];

export function ProfileDashboard({ user }: ProfileDashboardProps) {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Form State
    const [name, setName] = useState(user?.name || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [language, setLanguage] = useState("English");
    const [ward, setWard] = useState(user?.location || "");
    const [city, setCity] = useState(user?.addressCity || "");
    const [state, setState] = useState(user?.addressState || "");
    const [croppedImage, setCroppedImage] = useState(user?.image || "");

    // Modal Crop States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [originalImage, setOriginalImage] = useState("");
    const [zoom, setZoom] = useState(1);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);

    // Drag tracking
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setError("Image size must be less than 2MB.");
                return;
            }
            setError(null);
            const reader = new FileReader();
            reader.onloadend = () => {
                setOriginalImage(reader.result as string);
                setZoom(1);
                setOffsetX(0);
                setOffsetY(0);
                setIsModalOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    // Drag handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        setDragStart({ x: e.clientX - offsetX, y: e.clientY - offsetY });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setOffsetX(e.clientX - dragStart.x);
        setOffsetY(e.clientY - dragStart.y);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        setIsDragging(true);
        setDragStart({ x: touch.clientX - offsetX, y: touch.clientY - offsetY });
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        setOffsetX(touch.clientX - dragStart.x);
        setOffsetY(touch.clientY - dragStart.y);
    };

    const getCroppedImage = (url: string, z: number, x: number, y: number): Promise<string> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = 150;
                canvas.height = 150;
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    resolve(url);
                    return;
                }

                ctx.fillStyle = "#0F172A";
                ctx.fillRect(0, 0, 150, 150);

                const viewportSize = 280;
                const cropCircleSize = 220;
                const canvasSize = 150;
                const viewToCanvasScale = canvasSize / cropCircleSize;

                const minDim = Math.min(img.width, img.height);
                const baseScale = viewportSize / minDim;
                
                const drawWidth = img.width * baseScale * z * viewToCanvasScale;
                const drawHeight = img.height * baseScale * z * viewToCanvasScale;

                const cx = (canvasSize - drawWidth) / 2 + (x * viewToCanvasScale);
                const cy = (canvasSize - drawHeight) / 2 + (y * viewToCanvasScale);

                ctx.drawImage(img, cx, cy, drawWidth, drawHeight);
                resolve(canvas.toDataURL("image/jpeg", 0.9));
            };
            img.onerror = () => {
                resolve(url);
            };
        });
    };

    const handleApplyCrop = async () => {
        if (originalImage) {
            const cropped = await getCroppedImage(originalImage, zoom, offsetX, offsetY);
            setCroppedImage(cropped);
            setIsModalOpen(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMsg(null);

        const result = await updateProfile({ 
            name, 
            phone, 
            ward, 
            city, 
            state, 
            image: croppedImage 
        });

        if (result.success) {
            setSuccessMsg("Profile updated successfully.");
            router.refresh();
            setTimeout(() => setSuccessMsg(null), 3000);
        } else {
            setError(result.error || "Failed to update profile.");
        }

        setLoading(false);
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-10">
            {/* CENTER: Profile Editor */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-slate-800 bg-slate-900/40">
                    <h2 className="text-2xl font-bold text-white">Personal Information</h2>
                    <p className="text-[15px] text-slate-400 mt-2">Manage your account details and preferences.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
                    {error && (
                        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[14px] font-bold rounded-xl flex items-center gap-3">
                            <Info className="w-5 h-5 flex-shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    {successMsg && (
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[14px] font-bold rounded-xl flex items-center gap-3">
                            <Check className="w-5 h-5 flex-shrink-0" />
                            <p>{successMsg}</p>
                        </div>
                    )}

                    {/* Profile Picture Display & Trigger */}
                    <div className="flex flex-col items-center justify-center pb-6 border-b border-slate-800/60 mb-2">
                        <div className="relative group w-28 h-28 rounded-full overflow-hidden border-4 border-slate-800 bg-slate-900 shadow-inner flex items-center justify-center cursor-pointer">
                            {croppedImage ? (
                                <img src={croppedImage} alt="Profile" className="w-full h-full object-cover select-none" />
                            ) : (
                                <span className="text-4xl font-extrabold text-slate-500 uppercase">
                                    {name?.charAt(0) || "C"}
                                </span>
                            )}
                            <label className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[10px] font-bold text-white transition-opacity duration-300 cursor-pointer">
                                <Camera className="w-5 h-5 mb-1 text-emerald-400" />
                                EDIT PHOTO
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                        <p className="text-[12px] text-slate-500 mt-3 font-medium">JPEG, PNG or GIF. Max size 2MB.</p>
                    </div>

                    {/* ── Two-column grid layout ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Row 1: Full Name | Contact Number */}
                        <Input
                            label="Full Name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Ramesh Kumar"
                            autoComplete="name"
                            icon={User}
                        />

                        <Input
                            label="Contact Number"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            autoComplete="tel"
                            icon={Phone}
                        />

                        {/* Row 2: City | State */}
                        <Input
                            label="City"
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="e.g. New Delhi"
                            icon={Building}
                        />

                        <Input
                            label="State"
                            type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder="e.g. Delhi"
                            icon={MapPin}
                        />

                        {/* Row 3: Municipal Ward | Preferred Language */}
                        <Input
                            label="Municipal Ward / Zone"
                            type="text"
                            value={ward}
                            onChange={(e) => setWard(e.target.value)}
                            placeholder="e.g. Ward 42 / South Zone"
                            icon={MapPin}
                            helperText="Used for localizing civic complaints."
                        />

                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-bold text-slate-300 uppercase tracking-wider">
                                Preferred Language
                            </label>
                            <div className="relative">
                                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none z-10 w-[18px] h-[18px]" />
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    style={{ paddingLeft: "3rem" }}
                                    className="w-full h-[52px] pl-11 pr-10 bg-[#1A2234] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all text-[15px] font-medium appearance-none cursor-pointer shadow-sm"
                                >
                                    <option className="bg-[#1E293B]">English</option>
                                    <option className="bg-[#1E293B]">Hindi (हिंदी)</option>
                                    <option className="bg-[#1E293B]">Marathi (मराठी)</option>
                                    <option className="bg-[#1E293B]">Tamil (தமிழ்)</option>
                                </select>
                                <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>

                        {/* Row 4: Email — full width */}
                        <div className="md:col-span-2">
                            <Input
                                label="Email Address"
                                type="email"
                                value={user?.email || ""}
                                readOnly
                                disabled
                                icon={Mail}
                                helperText="Read only field"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center min-w-[200px] disabled:opacity-75 disabled:cursor-not-allowed text-[14px] uppercase tracking-wide"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Profile Changes"}
                        </button>
                    </div>
                </form>
            </div>

            {/* CROP MODAL DIALOG (AnimatePresence) */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#0F172A] border border-slate-800 rounded-3xl w-full max-w-[360px] overflow-hidden shadow-2xl flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
                                <h3 className="text-[16px] font-bold text-white uppercase tracking-wider">
                                    Edit Image
                                </h3>
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-1 text-slate-500 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Viewport Drag Area */}
                            <div className="p-6 flex flex-col items-center gap-6">
                                <div 
                                    className="relative w-[280px] h-[280px] bg-slate-950 overflow-hidden cursor-move select-none rounded-2xl border border-slate-800"
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                    onTouchStart={handleTouchStart}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleMouseUp}
                                >
                                    {/* Image inside viewport */}
                                    <img 
                                        src={originalImage} 
                                        alt="Original image" 
                                        className="w-full h-full object-contain pointer-events-none select-none"
                                        style={{
                                            transform: `scale(${zoom}) translate(${offsetX}px, ${offsetY}px)`,
                                            transformOrigin: "center center",
                                        }}
                                    />

                                    {/* Circular crop boundary overlay mask */}
                                    <div 
                                        className="absolute inset-0 pointer-events-none"
                                        style={{
                                            background: "radial-gradient(circle, transparent 110px, rgba(15, 23, 42, 0.75) 110px)"
                                        }}
                                    />
                                    {/* White circular crop highlighter */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full border-2 border-white pointer-events-none" />
                                </div>

                                {/* Zoom Slider */}
                                <div className="w-full space-y-2 px-1">
                                    <div className="flex justify-between items-center text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                                        <span>ZOOM ADJUSTER</span>
                                        <span>{zoom.toFixed(1)}x</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="3"
                                        step="0.1"
                                        value={zoom}
                                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                </div>
                            </div>

                            {/* Modal Footer Controls */}
                            <div className="px-6 py-5 bg-slate-900/40 border-t border-slate-800 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-[12px] uppercase tracking-wide transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleApplyCrop}
                                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-[12px] uppercase tracking-wide transition-colors shadow-lg shadow-emerald-500/20"
                                >
                                    Apply
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* BOTTOM: My Submissions */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-slate-800 bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white">My Submissions</h2>
                        <p className="text-[15px] text-slate-400 mt-2">Track and manage your filed civic grievances.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => router.push('/file-complaint')}
                        className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-[14px] uppercase tracking-wide shadow-lg shadow-emerald-500/25 transition-all flex flex-shrink-0 items-center justify-center gap-2"
                    >
                        <FileText className="w-4 h-4" /> File New Report
                    </button>
                </div>

                <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {MOCK_SUBMISSIONS.map((sub, idx) => (
                        <motion.div
                            key={sub.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-[#1A2234] border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700 transition-all flex flex-col"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${sub.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : sub.status === 'In Progress' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}>
                                    {sub.status}
                                </span>
                                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" /> {sub.date}
                                </span>
                            </div>

                            <h3 className="font-bold text-[16px] text-white mb-2 leading-snug">{sub.title}</h3>
                            <p className="text-[12px] font-bold text-emerald-400 mb-4 tracking-wide uppercase">{sub.category} • Priority: {sub.priority}</p>
                            <p className="text-[14px] text-slate-400 mb-6 flex-1 line-clamp-3 leading-relaxed">{sub.desc}</p>

                            <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[13px] font-medium text-slate-500 truncate max-w-[60%]">
                                    <MapPin className="w-4 h-4 flex-shrink-0" />
                                    <span className="truncate">{sub.location}</span>
                                </div>
                                <button className="text-[13px] font-bold text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-1 uppercase tracking-wide">
                                    Details <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

"use client";

import React from "react";
import { ShieldCheck, Zap, Scale, HeartHandshake, Eye, Award } from "lucide-react";
import { motion } from "framer-motion";

const BADGES = [
    { id: 1, title: "First Complaint", icon: <Award size={20} />, unlocked: true, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { id: 2, title: "Community Verifier", icon: <ShieldCheck size={20} />, unlocked: true, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { id: 3, title: "Civic Champion", icon: <HeartHandshake size={20} />, unlocked: false, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    { id: 4, title: "Fast Reporter", icon: <Zap size={20} />, unlocked: false, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { id: 5, title: "RTI Explorer", icon: <Eye size={20} />, unlocked: false, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { id: 6, title: "Trusted Citizen", icon: <Scale size={20} />, unlocked: false, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
];

export function AchievementsGrid() {
    return (
        <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-300 uppercase letter-spacing-wide">Achievements</h4>
                <span className="text-xs text-slate-500 font-medium">{BADGES.filter(b => b.unlocked).length}/{BADGES.length} Unlocked</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {BADGES.map((badge, idx) => (
                    <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`
              relative flex flex-col items-center justify-center p-3 rounded-xl border 
              ${badge.unlocked
                                ? `${badge.bg} ${badge.border} hover:scale-105 hover:shadow-lg transition-all duration-300 shadow-sm cursor-pointer hover:-translate-y-1`
                                : "bg-slate-800/30 border-slate-700/50 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-default"
                            }
            `}
                    >
                        {badge.unlocked && (
                            <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity rounded-xl" />
                        )}
                        <div className={`
              w-10 h-10 rounded-full flex items-center justify-center mb-2 shadow-inner
              ${badge.unlocked ? `bg-slate-900 ${badge.color}` : "bg-slate-800 text-slate-500"}
            `}>
                            {badge.icon}
                        </div>
                        <span className={`text-[10px] font-bold text-center leading-tight ${badge.unlocked ? "text-slate-200" : "text-slate-500"}`}>
                            {badge.title}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

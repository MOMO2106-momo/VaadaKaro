"use client";

import React from "react";
import Link from "next/link";
import { Shield, Award, Star, Flame, Trophy, Coins, Settings, LogOut, HelpCircle, FileText, Bot, Map, Pen } from "lucide-react";
import styles from "./RightUserPanel.module.css";
import { logoutUser } from "@/lib/actions/auth-actions";
import { AchievementsGrid } from "../dashboard/AchievementsGrid";

export function RightUserPanel({ user }: { user: any }) {
    // Stubbing gamification data
    const stats = {
        trustScore: 850,
        level: "Verified Citizen",
        xp: 2450,
        xpMax: 3000,
        dailyStreak: 12,
        coins: 450,
        rank: 142
    };

    return (
        <aside className={styles.rightPanel}>
            {/* Top Section */}
            <div className={styles.profileSection}>
                <div className="relative w-20 h-20 rounded-full bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center text-3xl font-extrabold mb-4 shadow-inner ring-4 ring-slate-100 dark:ring-slate-800 overflow-hidden">
                    {user?.image ? (
                        <img src={user.image} alt={user?.name || "Profile"} className="w-full h-full object-cover" />
                    ) : (
                        user?.name?.charAt(0) || "C"
                    )}
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-[3px] shadow-sm flex items-center justify-center z-10">
                        <Shield size={16} className="text-emerald-500 fill-emerald-500" />
                    </div>
                </div>
                <div className="flex items-center gap-2 justify-center">
                    <h3 className={styles.userName}>{user?.name}</h3>
                    <Link href="/citizen/profile" className="text-slate-400 hover:text-emerald-400 transition-colors p-1" title="Edit Profile">
                        <Pen size={14} />
                    </Link>
                </div>
                <p className={styles.citizenId}>CID: {user?.id?.substring(0, 8).toUpperCase()}</p>

                <div className={styles.levelBox}>
                    <div className={styles.levelHeader}>
                        <span className={styles.levelTitle}>{stats.level}</span>
                        <span className={styles.trustScore}><Star size={12} /> {stats.trustScore} Trust</span>
                    </div>
                    <div className={styles.xpBarContainer}>
                        <div className={styles.xpBar} style={{ width: `${(stats.xp / stats.xpMax) * 100}%` }} />
                    </div>
                    <div className={styles.xpText}>{stats.xp} / {stats.xpMax} XP</div>
                </div>

                <div className={styles.streakGrid}>
                    <div className={styles.streakCard}>
                        <Flame size={16} className="text-orange-500" />
                        <span>{stats.dailyStreak} Day Streak</span>
                    </div>
                    <div className={styles.streakCard}>
                        <Trophy size={16} className="text-yellow-500" />
                        <span>Rank #{stats.rank}</span>
                    </div>
                    <div className={styles.streakCard}>
                        <Coins size={16} className="text-yellow-600" />
                        <span>{stats.coins} Coins</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.quickActions}>
                <h4 className={styles.sectionTitle}>Quick Actions</h4>
                <div className={styles.actionGrid}>
                    <Link href="/citizen/ai" className={styles.actionBtn}>
                        <Bot size={16} /> VaadaAI
                    </Link>
                    <Link href="/generate-docs" className={styles.actionBtn}>
                        <FileText size={16} /> Docs
                    </Link>
                    <Link href="/citizen/map" className={styles.actionBtn}>
                        <Map size={16} /> Map
                    </Link>
                    <Link href="/citizen/achievements" className={styles.actionBtn}>
                        <Award size={16} /> Badges
                    </Link>
                </div>
            </div>

            {/* Achievements Grid replacing old statistics */}
            <AchievementsGrid />

            {/* Bottom Section */}
            <div className={styles.bottomSection}>
                <Link href="/citizen/settings" className={styles.bottomLink}>
                    <Settings size={16} /> Settings
                </Link>
                <Link href="/support" className={styles.bottomLink}>
                    <HelpCircle size={16} /> Help Center
                </Link>
                <form action={logoutUser} className="w-full">
                    <button type="submit" className={styles.logoutBtn}>
                        <LogOut size={16} /> Log Out
                    </button>
                </form>
            </div>
        </aside>
    );
}

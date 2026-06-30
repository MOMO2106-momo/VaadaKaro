'use client';
import React, { useState } from 'react';
import { Bell, CheckCircle, AlertCircle, FileText, ShieldCheck, BellOff, CheckCheck, Clock, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';

type NotifType = 'complaint' | 'verification' | 'system' | 'alert';

interface Notification {
  id: number;
  type: NotifType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFS: Notification[] = [
  { id: 1, type: 'alert', title: 'URGENT: New Complaint Escalated', message: 'CMP-0043 — Overflowing drains on MG Road has been escalated to HIGH priority. Immediate field inspection required.', time: '2 min ago', read: false },
  { id: 2, type: 'complaint', title: 'Case Assigned: CMP-0046', message: 'A new complaint about a pothole near Bus Stand has been assigned to you. Category: Roads & Infrastructure.', time: '18 min ago', read: false },
  { id: 3, type: 'verification', title: 'Verification Pending: VER-004', message: 'Address Proof document submitted by Divya Rao is awaiting your review. Priority: High.', time: '1 hr ago', read: false },
  { id: 4, type: 'complaint', title: 'Status Update: CMP-0042', message: 'Citizen Rahul S. has added new information to complaint CMP-0042 — Waterlogging on MG Road.', time: '3 hr ago', read: true },
  { id: 5, type: 'system', title: 'Weekly Performance Report Ready', message: 'Your resolution rate this week is 94% — top 10% of all officers. Download your weekly summary from the Reports page.', time: 'Yesterday', read: true },
  { id: 6, type: 'verification', title: 'Verification Completed: VER-003', message: 'NOC Clearance for Aarav Singh has been marked as Verified and logged in the system.', time: 'Yesterday', read: true },
  { id: 7, type: 'system', title: 'Platform Maintenance Notice', message: 'Scheduled maintenance on Jul 2, 2026 from 2:00 AM – 4:00 AM IST. All data will be preserved. Plan your work accordingly.', time: '2 days ago', read: true },
];

const TYPE_CONFIG: Record<NotifType, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  alert:        { icon: AlertCircle,   color: 'text-rose-400',    bg: 'bg-rose-500/10 border-rose-500/20',    label: 'Alert' },
  complaint:    { icon: FileText,      color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/20',    label: 'Complaint' },
  verification: { icon: CheckCircle,   color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Verification' },
  system:       { icon: Bell,          color: 'text-purple-400',  bg: 'bg-purple-500/10 border-purple-500/20', label: 'System' },
};

const FILTERS = ['All', 'Alert', 'Complaint', 'Verification', 'System'];

export default function OfficerNotificationsPage() {
  const [notifs, setNotifs] = useState<Notification[]>(INITIAL_NOTIFS);
  const [filter, setFilter] = useState('All');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const unreadCount = notifs.filter(n => !n.read).length;

  const filtered = notifs.filter(n => {
    if (filter === 'All') return true;
    return TYPE_CONFIG[n.type].label === filter;
  });

  const markRead = (id: number) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  const dismiss = (id: number) => {
    setNotifs(prev => prev.filter(n => n.id !== id));
    showToast('Notification dismissed');
  };

  return (
    <div className="flex flex-col gap-10 min-h-screen bg-[#020817] text-white p-6 md:p-10">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-semibold border border-emerald-500/20 animate-in slide-in-from-top-2 duration-300">
          ✓ {toast}
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-4 border-b border-slate-800/80">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
            <ShieldCheck className="text-amber-400" size={16} />
            Notification Center
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Alerts &amp; Notifications
            {unreadCount > 0 && (
              <span className="text-base font-black px-2.5 py-1 bg-rose-500 text-white rounded-full animate-pulse">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-slate-400 text-[15px] leading-relaxed">
            Stay updated on case assignments, citizen activity, and system alerts.
          </p>
        </div>
        <button
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-emerald-500/40 hover:text-emerald-400 text-slate-300 rounded-xl font-bold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <CheckCheck size={16} />
          Mark All Read
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: notifs.length, color: 'text-white' },
          { label: 'Unread', value: notifs.filter(n => !n.read).length, color: 'text-rose-400' },
          { label: 'Alerts', value: notifs.filter(n => n.type === 'alert').length, color: 'text-amber-400' },
          { label: 'Verifications', value: notifs.filter(n => n.type === 'verification').length, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="bg-[#0F172A] rounded-xl p-5 border border-slate-800 text-center">
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === f
                ? 'bg-amber-500 text-black'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <Card padding="lg" className="bg-[#0F172A] border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <Bell size={20} className="text-amber-400" />
          {filter === 'All' ? 'All Notifications' : `${filter} Notifications`}
          <span className="ml-auto text-xs text-slate-500 font-semibold">{filtered.length} items</span>
        </h2>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-slate-500">
            <BellOff size={40} className="opacity-30" />
            <p className="font-bold">No notifications in this category</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(notif => {
              const cfg = TYPE_CONFIG[notif.type];
              return (
                <div
                  key={notif.id}
                  onClick={() => markRead(notif.id)}
                  className={`relative flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer group ${
                    notif.read
                      ? 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {/* Unread indicator */}
                  {!notif.read && (
                    <div className="absolute top-4 right-12 w-2 h-2 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
                  )}

                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${cfg.bg}`}>
                    <cfg.icon size={16} className={cfg.color} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`font-bold text-sm ${notif.read ? 'text-slate-300' : 'text-white'}`}>
                        {notif.title}
                      </p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold uppercase ${cfg.bg} ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{notif.message}</p>
                    <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500">
                      <Clock size={10} />
                      {notif.time}
                      {!notif.read && <span className="text-rose-400 font-bold">• Unread</span>}
                    </div>
                  </div>

                  {/* Dismiss button */}
                  <button
                    onClick={e => { e.stopPropagation(); dismiss(notif.id); }}
                    className="shrink-0 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition-all"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

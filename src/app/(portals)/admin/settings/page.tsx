import React from 'react';
import { Settings, Bell, Shield, Database, Globe } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">

        <header>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <Settings className="text-slate-500" size={30} />
            Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Configure admin portal preferences.</p>
        </header>

        {/* Section: Notifications */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-5">
            <Bell size={18} className="text-blue-500" /> Notifications
          </h2>
          <div className="space-y-4">
            {[
              { label: 'New Complaint Alerts', desc: 'Notify when a new complaint is filed', checked: true },
              { label: 'Escalation Alerts', desc: 'Notify when a complaint is escalated', checked: true },
              { label: 'Daily Summary Email', desc: 'Receive a daily summary at 8 AM', checked: false },
              { label: 'Officer Inactivity Warnings', desc: 'Alert when officers are inactive for 48h', checked: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
                <button
                  className={`relative w-11 h-6 rounded-full transition-colors ${item.checked ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.checked ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Security */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-5">
            <Shield size={18} className="text-emerald-500" /> Security
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Two-Factor Authentication', value: 'Enabled', color: 'text-emerald-500' },
              { label: 'Session Timeout', value: '8 hours', color: 'text-slate-500' },
              { label: 'Login IP Whitelist', value: 'Not configured', color: 'text-amber-500' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.label}</p>
                <span className={`text-sm font-semibold ${item.color}`}>{item.value}</span>
              </div>
            ))}
            <button className="mt-2 text-sm text-blue-500 hover:underline font-semibold">Change Password</button>
          </div>
        </section>

        {/* Section: System */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-5">
            <Database size={18} className="text-purple-500" /> System Info
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Platform Version', value: 'VaadaKaro v2.4.1' },
              { label: 'Environment', value: 'Production' },
              { label: 'Database', value: 'PostgreSQL (Healthy)' },
              { label: 'Last Backup', value: '2026-06-29 03:00 AM' },
            ].map((item) => (
              <div key={item.label} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{item.label}</p>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

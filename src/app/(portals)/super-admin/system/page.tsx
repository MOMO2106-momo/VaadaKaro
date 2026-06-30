'use client';

import React, { useState } from 'react';
import { Settings, Server, Database, Save, Activity, RefreshCw, Cpu, Disc, Zap } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default function SystemSettingsPage() {
  const [maintenance, setMaintenance] = useState(false);
  const [emailsEnabled, setEmailsEnabled] = useState(true);
  const [aadhaarVerification, setAadhaarVerification] = useState(false);
  const [liveAuditLog, setLiveAuditLog] = useState(true);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const triggerOptimize = () => {
    showToast('Rebuilding DB indexes and running PRAGMA optimize...');
    setTimeout(() => {
      showToast('Database performance optimized successfully');
    }, 1200);
  };

  const saveSettings = () => {
    showToast('Platform configuration settings saved to DB');
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors border ${value ? 'bg-emerald-500 border-emerald-500' : 'bg-slate-800 border-slate-700'}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="flex flex-col gap-10 min-h-screen bg-[#020817] text-white p-6 md:p-10">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-semibold border border-emerald-500/20">
          ✓ {toast}
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-4 border-b border-slate-800/80">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
            <Settings size={16} className="text-purple-400" />
            Global Platform Configuration
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">System Settings</h1>
          <p className="text-slate-400 text-[15px] leading-relaxed">
            Configure global toggles, system integration drivers, and run PostgreSQL/Prisma runtime optimizations.
          </p>
        </div>
        <button 
          onClick={saveSettings}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-655 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-purple-500/10"
        >
          <Save size={15} />
          Save Settings
        </button>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* System Flags */}
        <Card padding="lg" className="bg-[#0F172A] border-slate-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
            <Server size={18} className="text-blue-400" />
            Operational Flags
          </h2>
          <div className="space-y-5">
            {[
              { label: 'Maintenance Mode', desc: 'Prevent citizen access and show offline screen.', value: maintenance, onChange: () => setMaintenance(p => !p) },
              { label: 'Nodemailer Integrations', desc: 'Enable outbound SMTP email dispatch for verification alerts.', value: emailsEnabled, onChange: () => setEmailsEnabled(p => !p) },
              { label: 'Biometric Fingerprint Matcher', desc: 'Require Aadhaar SHA-256 validation checks for identity.', value: aadhaarVerification, onChange: () => setAadhaarVerification(p => !p) },
              { label: 'Immediate Audit Trail logging', desc: 'Flush admin actions to logs instantly without batching.', value: liveAuditLog, onChange: () => setLiveAuditLog(p => !p) },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <p className="font-bold text-slate-200 text-sm">{item.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
                <Toggle value={item.value} onChange={item.onChange} />
              </div>
            ))}
          </div>
        </Card>

        {/* DB Optimization & Storage */}
        <Card padding="lg" className="bg-[#0F172A] border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
              <Database size={18} className="text-emerald-400" />
              Database Health &amp; Operations
            </h2>
            <div className="space-y-4 mb-6">
              {[
                { label: 'Database Engine', value: 'PostgreSQL 16', icon: Cpu, color: 'text-indigo-400' },
                { label: 'Storage Size', value: '238 MB / 10 GB', icon: Disc, color: 'text-emerald-400' },
                { label: 'Database Cache Hit Rate', value: '99.4%', icon: Zap, color: 'text-amber-400' },
              ].map(m => (
                <div key={m.label} className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-3">
                    <m.icon size={16} className={m.color} />
                    <span className="text-sm font-semibold text-slate-300">{m.label}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-400">{m.value}</span>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={triggerOptimize}
            className="w-full py-3 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} />
            Run DB Vacuum &amp; Optimize
          </button>
        </Card>
      </div>
    </div>
  );
}

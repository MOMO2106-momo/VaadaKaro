'use client';
import React, { useState } from 'react';
import { Settings, Bell, Shield, Globe, Save, ShieldAlert } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default function AdminSettingsPage() {
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSMS, setNotifSMS] = useState(false);
  const [autoAssign, setAutoAssign] = useState(true);
  const [publicMap, setPublicMap] = useState(true);
  const [aiSummary, setAiSummary] = useState(true);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors border ${value ? 'bg-emerald-500 border-emerald-500' : 'bg-slate-800 border-slate-700'}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="flex flex-col gap-10 min-h-screen bg-[#020817] text-white p-6 md:p-10">
      {toast && <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-semibold border border-emerald-500/20">✓ {toast}</div>}

      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-4 border-b border-slate-800/80">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
            <ShieldAlert className="text-slate-400" size={16} />
            Portal Configuration
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Settings & Controls</h1>
          <p className="text-slate-400 text-[15px] leading-relaxed">Manage portal behaviour, notifications, and platform preferences.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Notifications */}
        <Card padding="lg" className="bg-[#0F172A] border-slate-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
            <Bell size={18} className="text-blue-400" /> Notifications
          </h2>
          <div className="space-y-5">
            {[
              { label: 'Email Alerts', desc: 'Receive email for new complaints assigned', value: notifEmail, onChange: () => setNotifEmail(p => !p) },
              { label: 'SMS Notifications', desc: 'Get SMS for high-priority escalations', value: notifSMS, onChange: () => setNotifSMS(p => !p) },
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

        {/* Platform Behaviour */}
        <Card padding="lg" className="bg-[#0F172A] border-slate-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
            <Settings size={18} className="text-purple-400" /> Platform Behaviour
          </h2>
          <div className="space-y-5">
            {[
              { label: 'Auto-Assign Complaints', desc: 'Automatically assign new complaints to available officers', value: autoAssign, onChange: () => setAutoAssign(p => !p) },
              { label: 'Public Heatmap', desc: 'Allow citizens to view regional complaint heatmaps', value: publicMap, onChange: () => setPublicMap(p => !p) },
              { label: 'AI Complaint Summary', desc: 'Generate AI summaries for all new complaints', value: aiSummary, onChange: () => setAiSummary(p => !p) },
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

        {/* Security */}
        <Card padding="lg" className="bg-[#0F172A] border-slate-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
            <Shield size={18} className="text-emerald-400" /> Security
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center gap-3">
              <Shield size={18} className="text-emerald-400 shrink-0" />
              <div>
                <p className="text-sm font-bold text-emerald-300">Session Active & Secured</p>
                <p className="text-xs text-slate-400 mt-0.5">All data is encrypted with AES-256. JWT session expires in 24h.</p>
              </div>
            </div>
            <button onClick={() => showToast('Password reset email sent')} className="w-full py-3 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-900 rounded-xl text-sm font-bold transition-all">
              Change Password
            </button>
            <button onClick={() => showToast('2FA setup email sent')} className="w-full py-3 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-900 rounded-xl text-sm font-bold transition-all">
              Enable Two-Factor Auth
            </button>
          </div>
        </Card>

        {/* Regional */}
        <Card padding="lg" className="bg-[#0F172A] border-slate-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
            <Globe size={18} className="text-sky-400" /> Regional Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Jurisdiction Name</label>
              <input defaultValue="Municipal Corporation of Greater Mumbai" className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-600 transition" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">State</label>
              <input defaultValue="Maharashtra" className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-600 transition" />
            </div>
            <button onClick={() => showToast('Regional settings saved')} className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/10">
              <Save size={15} /> Save Regional Settings
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

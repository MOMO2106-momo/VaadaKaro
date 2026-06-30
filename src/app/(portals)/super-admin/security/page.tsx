'use client';

import React, { useState } from 'react';
import { Shield, Key, Eye, ShieldAlert, AlertTriangle, CheckCircle, RefreshCw, Lock, Radio } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface SecurityPolicy {
  id: number;
  name: string;
  desc: string;
  enabled: boolean;
  type: 'system' | 'auth' | 'network';
}

const INITIAL_POLICIES: SecurityPolicy[] = [
  { id: 1, name: 'Enforce Muted Admin Sessions', desc: 'Terminate sessions inactive for over 15 minutes automatically.', enabled: true, type: 'auth' },
  { id: 2, name: 'Mandatory 2FA for Officers & Admins', desc: 'Enforce MFA setup on next login for governmental staff.', enabled: false, type: 'auth' },
  { id: 3, name: 'JWT Key Rotation', desc: 'Rotate JWT signing secrets on a 30-day automated cycle.', enabled: true, type: 'system' },
  { id: 4, name: 'Rate Limiting Gatekeeper', desc: 'Throttle client requests to maximum 60 requests per minute per IP.', enabled: true, type: 'network' },
  { id: 5, name: 'Immutable Audit Trail Logging', desc: 'Enforce double-write audit trail to secondary database server.', enabled: true, type: 'system' },
];

export default function SecurityCenterPage() {
  const [policies, setPolicies] = useState<SecurityPolicy[]>(INITIAL_POLICIES);
  const [rotating, setRotating] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const rotateKeys = () => {
    setRotating(true);
    showToast('Initializing secure key rotation process...');
    setTimeout(() => {
      setRotating(false);
      showToast('JWT private/public keys rotated successfully');
    }, 1500);
  };

  const togglePolicy = (id: number) => {
    setPolicies(prev => prev.map(p => {
      if (p.id !== id) return p;
      const nextVal = !p.enabled;
      showToast(`Security Policy "${p.name}" has been ${nextVal ? 'Enforced' : 'Disabled'}`);
      return { ...p, enabled: nextVal };
    }));
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
            <Shield size={16} className="text-emerald-400" />
            Security &amp; Compliance Center
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Security Control</h1>
          <p className="text-slate-400 text-[15px] leading-relaxed">
            Monitor authentication flags, manage access policy rules, and rotate JWT signatures.
          </p>
        </div>
        <button 
          onClick={rotateKeys}
          disabled={rotating}
          className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-800 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-rose-500/10"
        >
          <RefreshCw size={15} className={rotating ? 'animate-spin' : ''} />
          {rotating ? 'Rotating Keys...' : 'Rotate JWT Keys'}
        </button>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Session Tokens', value: '1,492', sub: 'JWT Strategy active', icon: Lock, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'Threat Index', value: '0.0%', sub: 'No anomalies detected', icon: ShieldAlert, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'System Hardening', value: '96%', sub: 'CIS Benchmark aligned', icon: Shield, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
          { label: 'Network Firewall', value: 'Active', sub: 'Monitoring port 443/80', icon: Radio, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
        ].map((s) => (
          <div key={s.label} className="bg-[#0F172A] rounded-xl p-5 border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${s.bg}`}>
                <s.icon size={14} className={s.color} />
              </div>
            </div>
            <div>
              <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
              <p className="text-[11px] text-slate-500 font-bold mt-1">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Security Policies */}
      <Card padding="lg" className="bg-[#0F172A] border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
          <Key className="text-emerald-400" size={20} />
          Active Security Policies &amp; Directives
        </h2>

        <div className="space-y-4">
          {policies.map(p => (
            <div key={p.id} className="flex items-center justify-between p-5 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-slate-200 text-sm">{p.name}</p>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase ${
                    p.type === 'auth' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    p.type === 'network' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {p.type}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{p.desc}</p>
              </div>
              <Toggle value={p.enabled} onChange={() => togglePolicy(p.id)} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

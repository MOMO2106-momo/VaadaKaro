'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, Send, User, ShieldCheck } from 'lucide-react';

const SUGGESTIONS = [
  'Summarize high priority cases this week',
  'Which area has the most complaints?',
  'Draft a response for CMP-0043',
  'What is my resolution rate this month?',
];

const PRESETS: Record<string, string> = {
  'summarize high priority cases this week': "Here is a summary of active high priority cases:\n\n1. **CMP-0043 (Critical — Sanitation)**: Overflowing drains on MG Road. Impact score: 9.2. Needs urgent field verification.\n2. **CMP-0042 (High — Infrastructure)**: Waterlogging issue in Sector 5. Impact score: 8.5. Drainage clearance in progress.\n3. **CMP-0045 (High — Water Supply)**: Sector 12 water supply outage. Status: Resolved today.",
  'which area has the most complaints?': "Based on geofence density analysis:\n\n- **Sector 5 (MG Road)** has the highest density — 45% of total this week, primarily sanitation and road waterlogging.\n- **Sector 9** accounts for 20%, mostly streetlights and electrical faults.\n\nRecommendation: Deploy field team to Sector 5 immediately.",
  'draft a response for cmp-0043': "Here is a drafted official update for **CMP-0043**:\n\n*\"Dear Citizen, we have reviewed your complaint regarding overflowing drains. A sanitation engineering crew has been dispatched. We expect full resolution within 24 hours. Thank you for your patience.\"*\n\nShall I post this response to the tracker directly?",
  'what is my resolution rate this month?': "Your performance metrics look excellent:\n\n- **Total Resolved**: 24 cases\n- **Resolution Rate**: 94%\n- **Average time to resolution**: 2.1 days\n- **Citizen satisfaction**: 4.7/5 ⭐\n\nYou are in the top 10% of officers this month!",
};

export default function OfficerAIPage() {
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    { sender: 'ai', text: "Hello! I'm VaadaAI, your intelligent officer assistant. I can summarize cases, draft official responses, and analyze complaint trends for your jurisdiction.\n\nWhat would you like to know?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInput('');
    setLoading(true);
    setTimeout(() => {
      const query = text.toLowerCase().trim();
      let responseText = "I'm processing that request. Please select one of the suggested prompts below for pre-loaded demo responses, or ask me about your assigned cases or performance metrics.";
      for (const key of Object.keys(PRESETS)) {
        if (query.includes(key.split(' ')[0]) && query.includes(key.split(' ').slice(-1)[0])) {
          responseText = PRESETS[key];
          break;
        }
      }
      setMessages(prev => [...prev, { sender: 'ai', text: responseText }]);
      setLoading(false);
    }, 900);
  };

  return (
    <div className="flex flex-col gap-6 min-h-screen bg-[#020817] text-white p-6 md:p-10">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-4 border-b border-slate-800/80">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
            <ShieldCheck className="text-violet-400" size={16} />
            AI Intelligence
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">AI Colleague — VaadaAI</h1>
          <p className="text-slate-400 text-[15px] leading-relaxed">Your AI-powered assistant for case insights, drafts, and legal guidance.</p>
        </div>
      </header>

      {/* Chat container */}
      <div className="bg-[#0F172A] rounded-2xl border border-slate-800 flex flex-col overflow-hidden" style={{ minHeight: '500px' }}>
        <div className="p-6 flex-1 overflow-y-auto space-y-5">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex items-start gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                  <Bot size={15} className="text-violet-400" />
                </div>
              )}
              <div className={`rounded-2xl p-4 max-w-md text-sm whitespace-pre-line leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-violet-600 text-white rounded-tr-none shadow-lg shadow-violet-500/10'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-none'
              }`}>{m.text}</div>
              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                  <User size={15} className="text-slate-400" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                <Bot size={15} className="text-violet-400 animate-spin" />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-4 text-xs text-slate-500 italic">
                VaadaAI is analyzing...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        <div className="px-5 pb-3 pt-3 border-t border-slate-800 bg-slate-950/30">
          <p className="text-[10px] text-slate-500 mb-2 flex items-center gap-1 font-bold uppercase tracking-wider"><Sparkles size={10} /> Quick Prompts</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => handleSend(s)} className="text-xs px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-full hover:bg-violet-500/20 transition-all font-semibold">
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <form onSubmit={e => { e.preventDefault(); handleSend(input); }} className="border-t border-slate-800 p-4 bg-[#0F172A]">
          <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus-within:border-violet-500/50 transition-colors">
            <input className="flex-1 bg-transparent text-sm text-slate-300 placeholder-slate-500 outline-none" placeholder="Ask VaadaAI anything about your jurisdiction..." value={input} onChange={e => setInput(e.target.value)} />
            <button type="submit" className="p-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-all shadow-sm shadow-violet-500/20">
              <Send size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

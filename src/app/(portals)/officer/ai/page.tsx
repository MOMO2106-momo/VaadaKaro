'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, Send, Zap, User } from 'lucide-react';

const SUGGESTIONS = [
  'Summarize high priority cases this week',
  'Which area has the most complaints?',
  'Draft a response for CMP-0043',
  'What is my resolution rate this month?',
];

const PRESETS: Record<string, string> = {
  'summarize high priority cases this week': "Here is a summary of active high priority cases:\n1. **CMP-0043 (Critical - Sanitation)**: Overflowing drains on MG Road. Impact score: 9.2. Needs urgent field verification.\n2. **CMP-0042 (High - Infrastructure)**: Waterlogging issue in Sector 5. Impact score: 8.5. Roads dept is working on drainage clearance.\n3. **CMP-0045 (High - Water Supply)**: Sector 12 water supply outage. Resolved today.",
  'which area has the most complaints?': "Based on geofence density and GPS tracking:\n- **Sector 5 (MG Road area)** has the highest density of reports (45% of total this week), primarily related to sanitation and road waterlogging.\n- **Sector 9** has 20% of cases, mostly streetlights and minor electrical faults.",
  'draft a response for cmp-0043': "Here is a drafted official update for **CMP-0043**:\n\n*\"Dear Citizen, we have reviewed your complaint regarding the overflowing drains. A sanitation engineering crew has been dispatched to clear the obstruction. We expect resolution within 24 hours. Thank you for your patience.\"*\n\nWould you like to post this response directly to the tracker?",
  'what is my resolution rate this month?': "Your performance metrics look excellent this month:\n- **Total Resolved**: 24 cases\n- **Resolution Rate**: 94%\n- **Average time to resolution**: 2.1 days (down from 2.5 last month)."
};

export default function OfficerAIPage() {
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    { sender: 'ai', text: "Hello! I'm your AI Colleague. I can help you summarize cases, draft official responses, and analyze complaint trends. What would you like to know?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const query = text.toLowerCase().trim();
      let responseText = "I'm processing that request. Currently, in mock mode, you can click on the suggestions below to see pre-programmed answers, or ask about cases and resolution times.";
      
      for (const presetKey of Object.keys(PRESETS)) {
        if (query.includes(presetKey) || presetKey.includes(query)) {
          responseText = PRESETS[presetKey];
          break;
        }
      }

      setMessages(prev => [...prev, { sender: 'ai', text: responseText }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col space-y-6">

        <header>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <Bot className="text-violet-500" size={30} />
            AI Colleague
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Your AI-powered assistant for case insights and draft responses.</p>
        </header>

        {/* Chat area */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col flex-1 overflow-hidden" style={{ minHeight: '500px' }}>
          {/* Messages */}
          <div className="p-6 flex-1 overflow-y-auto space-y-4">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex items-start gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center shrink-0">
                    <Bot size={16} className="text-violet-500" />
                  </div>
                )}
                <div className={`rounded-2xl p-4 max-w-md text-sm whitespace-pre-line ${
                  m.sender === 'user' 
                    ? 'bg-violet-600 text-white rounded-tr-none' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-none border border-slate-200/50 dark:border-slate-700/50'
                }`}>
                  {m.text}
                </div>
                {m.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <User size={16} className="text-slate-600 dark:text-slate-400" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-violet-500 animate-spin" />
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-none p-4 text-xs text-slate-400">
                  AI Colleague is thinking...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          <div className="px-4 pb-3 pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <p className="text-xs text-slate-400 mb-2 flex items-center gap-1"><Sparkles size={11} /> Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button 
                  key={s} 
                  onClick={() => handleSend(s)}
                  className="text-xs px-3 py-1.5 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-700 dark:text-violet-400 rounded-full hover:bg-violet-100 dark:hover:bg-violet-500/20 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form 
            onSubmit={e => { e.preventDefault(); handleSend(input); }}
            className="border-t border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900"
          >
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700 focus-within:border-violet-500 transition">
              <Zap size={16} className="text-violet-500 shrink-0" />
              <input
                className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 outline-none"
                placeholder="Ask your AI Colleague anything..."
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <button type="submit" className="p-1.5 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition">
                <Send size={14} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

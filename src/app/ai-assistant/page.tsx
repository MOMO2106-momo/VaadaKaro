"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import styles from "./ai-assistant.module.css";
import { Send, Bot, User, Sparkles, AlertCircle, Scale, AlertTriangle, Trash2, RotateCcw, Maximize2, Minimize2 } from "lucide-react";
import { getLegalAdvice, getChatHistory, clearChatHistory } from "@/lib/actions/legal-assistant";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

const STORAGE_KEY = "vaadaai_messages";

interface Message {
  id: string;
  role: "user" | "bot";
  content?: string;
  data?: {
    insight?: string;
    analysis?: string;
    recommendedAction?: string;
    escalationFlag?: boolean;
    escalationReason?: string | null;
    urgencyLevel?: string;
    suggestedAuthorityAction?: string | null;
    actionButtons?: { label: string; url: string }[];
    fallback?: boolean;
    [key: string]: unknown;
  };
}

const WELCOME: Message = {
  id: "welcome",
  role: "bot",
  data: {
    insight: "VaadaAI Civic Copilot Initialized.",
    analysis: "Connected to live civic memory and database clusters.",
    recommendedAction: "Select an action below or ask a civic question.",
    actionButtons: [],
  },
};

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function parseMarkdown(text: string) {
  let html = text;
  // Code blocks
  html = html.replace(/```([\s\S]*?)```/g, '<pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md font-mono text-sm overflow-x-auto"><code>$1</code></pre>');
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm text-pink-600 dark:text-pink-400">$1</code>');
  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Italic
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  // Custom links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" className="text-blue-600 dark:text-blue-400 font-bold hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
  // Lists
  html = html.replace(/^- (.*)$/gm, '<li className="ml-4 list-disc">$1</li>');
  html = html.replace(/\n\s*<li/g, '<li');
  // Line breaks
  html = html.replace(/\n/g, '<br />');

  return html;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [pageContext, setPageContext] = useState("General");
  const [expanded, setExpanded] = useState(false);
  const [lastQuery, setLastQuery] = useState<string | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ref = document.referrer.toLowerCase();
      if (ref.includes("dashboard")) setPageContext("Dashboard");
      else if (ref.includes("map")) setPageContext("Map");
      else if (ref.includes("track") || ref.includes("promise")) setPageContext("Promise Tracking");

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Message[];
          if (parsed.length > 0) setMessages(parsed);
        } catch { /* ignore */ }
      }
    }
  }, []);

  useEffect(() => {
    if (historyLoaded) return;
    (async () => {
      try {
        const dbHistory = await getChatHistory();
        if (dbHistory.length > 0) {
          const restored: Message[] = [WELCOME];
          for (const row of dbHistory) {
            restored.push({ id: uid(), role: "user", content: row.query });
            restored.push({ id: uid(), role: "bot", data: row.response as Message["data"] });
          }
          setMessages(restored);
        }
      } catch { /* guest or offline */ }
      setHistoryLoaded(true);
    })();
  }, [historyLoaded]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isPending]);

  const sendMessage = useCallback(async (query: string, isRetry = false) => {
    if (!query.trim() || isPending) return;

    abortRef.current = false;
    setLastQuery(query);

    if (!isRetry) {
      setMessages((prev) => [...prev, { id: uid(), role: "user", content: query }]);
    }
    setInput("");
    setIsPending(true);

    try {
      const historyPayload = messages
        .slice(1)
        .filter((msg) => msg.role === "user" || (msg.role === "bot" && (msg.content || msg.data)))
        .map((msg) => ({
          role: msg.role === "user" ? "user" : "bot",
          content: msg.content || JSON.stringify(msg.data),
        }));

      const result = await getLegalAdvice(query, pageContext, historyPayload);

      if (abortRef.current) return;

      if (result.response) {
        setMessages((prev) => [
          ...prev,
          { id: uid(), role: "bot", data: result.response as Message["data"] },
        ]);
      }
    } catch {
      if (!abortRef.current) {
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: "bot",
            data: {
              insight: "Connection interrupted",
              analysis: "Could not reach VaadaAI. Your conversation is saved — tap Retry.",
              recommendedAction: "Check your connection and try again.",
              actionButtons: [],
            },
          },
        ]);
      }
    } finally {
      setIsPending(false);
    }
  }, [isPending, messages, pageContext]);

  const handleSubmit = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    sendMessage(customQuery || input.trim());
  };

  const handleClear = async () => {
    setMessages([WELCOME]);
    localStorage.removeItem(STORAGE_KEY);
    try { await clearChatHistory(); } catch { /* guest */ }
  };

  const handleStop = () => {
    abortRef.current = true;
    setIsPending(false);
  };

  const handleRegenerate = () => {
    if (lastQuery) sendMessage(lastQuery, true);
  };

  const suggestions =
    pageContext === "Map"
      ? ["Check pending promises near me", "Report broken road"]
      : pageContext === "Dashboard"
        ? ["Summarize community issues", "Escalate delayed complaint"]
        : ["How do I escalate an issue?", "Create a civic promise"];

  return (
    <ErrorBoundary componentName="AIAssistantPage">
      <div className={`${styles.container} ${expanded ? styles.containerExpanded : ""}`}>
        {!expanded && <div className={styles.backdrop} />}

        <div className={`${styles.sidePanel} ${expanded ? styles.sidePanelExpanded : ""}`}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.headerIcon}><Scale size={22} /></div>
              <div>
                <h1 className={styles.title}>VaadaAI</h1>
                <p className={styles.subtitle}>Context: {pageContext}</p>
              </div>
            </div>
            <div className={styles.headerActions}>
              <div className={styles.headerBadge}>
                <Sparkles size={14} /> {isPending ? "Analyzing..." : "Ready"}
              </div>
              <button type="button" className={styles.iconAction} onClick={() => setExpanded(!expanded)} title={expanded ? "Compact view" : "Expand"}>
                {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button type="button" className={styles.iconAction} onClick={handleRegenerate} disabled={!lastQuery || isPending} title="Regenerate">
                <RotateCcw size={16} />
              </button>
              <button type="button" className={styles.iconAction} onClick={handleClear} title="Clear conversation">
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className={styles.chatWrapper}>
            <div className={styles.messages} ref={scrollRef}>
              {messages.map((msg) => (
                <div key={msg.id} className={`${styles.message} ${msg.role === "user" ? styles.userMessage : styles.botMessage}`}>
                  <div className={styles.messageMeta}>
                    {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                    <span>{msg.role === "user" ? "YOUR QUERY" : "VAADAAI"}</span>
                  </div>

                  {msg.content && <div className={styles.messageContent} dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }} />}

                  {msg.data && (
                    <div className={styles.insightCard}>
                      {msg.data.insight && <h3 className={styles.insightTitle}>{msg.data.insight}</h3>}
                      {msg.data.analysis && <div className={styles.analysis} dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.data.analysis) }} />}
                      {msg.data.recommendedAction && <p className={styles.recommendation}>{msg.data.recommendedAction}</p>}

                      {msg.data.escalationFlag && msg.data.urgencyLevel && (
                        <div className={styles.escalationCard}>
                          <div className={`${styles.urgencyBadge} ${styles[msg.data.urgencyLevel] || styles.URGENT}`}>
                            <AlertTriangle size={14} /> ESCALATION: {msg.data.urgencyLevel}
                          </div>
                          {msg.data.escalationReason && <p className={styles.escalationReason}><strong>Reason:</strong> {msg.data.escalationReason}</p>}
                          {msg.data.suggestedAuthorityAction && <p className={styles.authorityAction}><strong>Authority Action:</strong> {msg.data.suggestedAuthorityAction}</p>}
                        </div>
                      )}

                      {msg.data.actionButtons && msg.data.actionButtons.length > 0 && (
                        <div className={styles.actionButtons}>
                          {msg.data.actionButtons.map((btn, idx) => (
                            <a key={idx} href={btn.url} className={styles.actionBtn}>{btn.label}</a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {isPending && (
                <div className={styles.typing}>
                  <Bot size={14} />
                  <span>VaadaAI is analyzing civic data</span>
                  <div className={styles.dotPulse} />
                  <div className={styles.dotPulse} style={{ animationDelay: "0.2s" }} />
                  <div className={styles.dotPulse} style={{ animationDelay: "0.4s" }} />
                  <button type="button" className={styles.stopBtn} onClick={handleStop}>Stop</button>
                </div>
              )}
            </div>

            <div className={styles.inputArea}>
              <div className={styles.suggestionChips}>
                {suggestions.map((sug) => (
                  <button key={sug} type="button" className={styles.chip} onClick={() => handleSubmit(undefined, sug)} disabled={isPending}>
                    {sug}
                  </button>
                ))}
              </div>
              <form onSubmit={handleSubmit} className={styles.form}>
                <input
                  type="text"
                  placeholder="Ask VaadaAI..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isPending}
                  aria-label="Message VaadaAI"
                />
                <button type="submit" className={styles.sendBtn} disabled={isPending || !input.trim()} aria-label="Send message">
                  <Send size={18} />
                </button>
              </form>
              <p className={styles.disclaimer}>
                <AlertCircle size={12} />
                Guidance is informational only and not a substitute for professional legal advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

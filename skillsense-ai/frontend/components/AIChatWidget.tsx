'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import api from '../lib/api';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import {
  MessageSquare,
  Bot,
  X,
  Send,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Cpu,
  ArrowRight,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { AIBadge } from '@/components/ui/AIBadge';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
}

const DEFAULT_SUGGESTIONS = [
  'Explain my skill gaps & priority actions',
  'Build an upskilling roadmap for NSQF Level 5',
  'Which tech companies in India are hiring for my profile?',
  'How do I prepare for full-stack system design interviews?',
];

export default function AIChatWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Hello! I am your SkillSense AI Career Copilot. Ask me anything about your verified skills, gap closures, career matching, or tech interviews in India.",
      suggestions: DEFAULT_SUGGESTIONS,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch session history
  useEffect(() => {
    if (user) {
      api
        .get('/ai/history')
        .then(({ data }) => {
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            const mapped: Message[] = data.data.map((m: any, i: number) => ({
              id: `hist_${i}`,
              role: m.role,
              content: m.content,
            }));
            setMessages((prev) => [prev[0], ...mapped]);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Auto-focus on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Response copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = async () => {
    try {
      await api.get('/ai/history?clear=true');
      setMessages([
        {
          id: '0',
          role: 'assistant',
          content: "Conversation history cleared. How can I help you accelerate your technical career today?",
          suggestions: DEFAULT_SUGGESTIONS,
        },
      ]);
      toast.success('Chat history cleared');
    } catch {
      toast.error('Failed to clear chat history');
    }
  };

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text.trim() };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setLoading(true);

      const history = messages.slice(-6).map((m) => ({ role: m.role, content: m.content }));
      const aiMsgId = `${Date.now() + 1}_ai`;

      setMessages((prev) => [...prev, { id: aiMsgId, role: 'assistant', content: '' }]);

      try {
        const token = localStorage.getItem('skillsense_token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token && token !== 'null' && token !== 'undefined') {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/ai/chat`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify({
              message: text.trim(),
              history,
              context: user?.name ? `User: ${user.name}, Role: ${user.role || 'student'}` : '',
            }),
          }
        );

        if (!response.ok) {
          throw new Error('AI service response error');
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';
        let finalSuggestions: string[] = DEFAULT_SUGGESTIONS;

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const textChunk = decoder.decode(value, { stream: true });
            const lines = textChunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const parsed = JSON.parse(line.replace('data: ', '').trim());
                  if (parsed.chunk) {
                    accumulated += parsed.chunk;
                    setMessages((prev) =>
                      prev.map((m) => (m.id === aiMsgId ? { ...m, content: accumulated } : m))
                    );
                  }
                  if (parsed.suggestions) {
                    finalSuggestions = parsed.suggestions;
                  }
                } catch {
                  // Non-JSON chunk
                }
              }
            }
          }
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId
              ? { ...m, content: accumulated || 'Response received.', suggestions: finalSuggestions }
              : m
          )
        );
      } catch (err: any) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId
              ? {
                  ...m,
                  content:
                    "I encountered a momentary connection issue. Please verify your internet connection or retry your prompt.",
                  suggestions: DEFAULT_SUGGESTIONS,
                }
              : m
          )
        );
      } finally {
        setLoading(false);
      }
    },
    [messages, loading, user]
  );

  return (
    <>
      {/* ── Floating Launcher Button ── */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 50,
            padding: '10px 18px',
            borderRadius: 99,
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#090a0f',
            border: '1px solid #f59e0b',
            fontWeight: 800,
            fontSize: 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 8px 32px rgba(245,158,11,0.35)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          className="hover:scale-105 active:scale-95"
        >
          <Sparkles size={16} />
          <span>AI Copilot</span>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 6px #10b981',
            }}
          />
        </button>
      )}

      {/* ── Chat Modal / Drawer ── */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: expanded ? 580 : 380,
            height: expanded ? 680 : 540,
            maxWidth: 'calc(100vw - 48px)',
            maxHeight: 'calc(100vh - 48px)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 50,
            overflow: 'hidden',
            transition: 'width 0.2s ease, height 0.2s ease',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '14px 18px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg-surface-elevated)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: 'rgba(245,158,11,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold)',
                }}
              >
                <Bot size={18} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <h3 style={{ fontSize: 13.5, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                    SkillSense Copilot
                  </h3>
                  <AIBadge type="live" label="LIVE" />
                </div>
                <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>
                  Profile Aware · NSQF Intelligent
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                type="button"
                onClick={handleClearHistory}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
                title="Clear chat history"
              >
                <Trash2 size={14} />
              </button>

              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
                title={expanded ? 'Minimize' : 'Maximize'}
              >
                {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
                title="Close chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {messages.map((m) => {
              const isAssistant = m.role === 'assistant';

              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isAssistant ? 'flex-start' : 'flex-end',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '88%',
                      padding: '10px 14px',
                      borderRadius: isAssistant ? '4px 12px 12px 12px' : '12px 12px 4px 12px',
                      background: isAssistant ? 'rgba(255,255,255,0.03)' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: isAssistant ? '#cbd5e1' : '#090a0f',
                      border: isAssistant ? '1px solid var(--border)' : 'none',
                      fontSize: 12.5,
                      lineHeight: 1.5,
                      fontWeight: isAssistant ? 400 : 600,
                      position: 'relative',
                    }}
                  >
                    {m.content || (
                      <div style={{ display: 'flex', gap: 4, padding: '4px 0', alignItems: 'center' }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--gold)', animation: 'pulse-slow 1s infinite' }} />
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--gold)', animation: 'pulse-slow 1.2s infinite' }} />
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--gold)', animation: 'pulse-slow 1.4s infinite' }} />
                      </div>
                    )}

                    {isAssistant && m.content && (
                      <button
                        type="button"
                        onClick={() => handleCopy(m.id, m.content)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 3,
                          marginTop: 6,
                          background: 'transparent',
                          border: 'none',
                          color: copiedId === m.id ? '#10b981' : 'var(--text-muted)',
                          fontSize: 10,
                          cursor: 'pointer',
                        }}
                      >
                        {copiedId === m.id ? <Check size={11} /> : <Copy size={11} />}
                        <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    )}
                  </div>

                  {/* Suggestion Chips */}
                  {isAssistant && m.suggestions && m.suggestions.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8, maxWidth: '92%' }}>
                      {m.suggestions.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => sendMessage(s)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: 99,
                            background: 'rgba(245,158,11,0.06)',
                            border: '1px solid rgba(245,158,11,0.2)',
                            color: 'var(--gold)',
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: 'pointer',
                            textAlign: 'left',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <Sparkles size={10} /> {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            style={{
              padding: '12px 14px',
              borderTop: '1px solid var(--border)',
              background: 'var(--bg-surface-elevated)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Copilot about skills, career paths, interview prep..."
              disabled={loading}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: 8,
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                color: '#fff',
                fontSize: 12.5,
              }}
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: input.trim() && !loading ? 'var(--gold)' : 'rgba(255,255,255,0.06)',
                color: input.trim() && !loading ? '#090a0f' : 'var(--text-muted)',
                border: 'none',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              {loading ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

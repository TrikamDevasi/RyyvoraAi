'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import api from '../lib/api';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Maximize2,
  Minimize2,
  AlertTriangle,
  RotateCcw,
  User,
  ChevronRight,
} from 'lucide-react';
import { AIBadge } from '@/components/ui/AIBadge';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
  isError?: boolean;
  failedPrompt?: string;
}

// ── Inline Markdown & List Formatter ──────────────────────────────────────────
function renderInlineText(text: string) {
  // Replace bold **...** and inline code `...`
  const parts: (string | React.ReactNode)[] = [];
  const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
  let lastIdx = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.substring(lastIdx, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} style={{ color: '#fde68a', fontWeight: 650 }}>
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={match.index}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '2px 5px',
            borderRadius: 4,
            fontSize: '0.9em',
            fontFamily: 'monospace',
            color: '#38bdf8',
          }}
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} style={{ color: '#e2e8f0' }}>
          {token.slice(1, -1)}
        </em>
      );
    }
    lastIdx = regex.lastIndex;
  }

  if (lastIdx < text.length) {
    parts.push(text.substring(lastIdx));
  }

  return parts;
}

function FormattedMessageContent({ text }: { text: string }) {
  // Pre-process text to separate numbered items if joined in one line (e.g. "... 1. **Title:** ... 2. **Title:** ...")
  let normalized = text;
  normalized = normalized.replace(/\s+(?=\d+\.\s+\*\*|\d+\.\s+[A-Z])/g, '\n\n');
  normalized = normalized.replace(/\s+(?=-\s+\*\*|-\s+[A-Z])/g, '\n');

  // Split into paragraphs / lines
  const rawParagraphs = normalized.split(/\n\n+/).filter(Boolean);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, lineHeight: 1.62 }}>
      {rawParagraphs.map((para, pIdx) => {
        const trimmed = para.trim();

        // Check if paragraph is a numbered item (e.g. "1. **Title:** Description" or "1. Description")
        const numberedMatch = trimmed.match(/^(\d+)\.\s+([\s\S]*)$/);
        if (numberedMatch) {
          const num = numberedMatch[1];
          const rest = numberedMatch[2];

          return (
            <div
              key={pIdx}
              style={{
                display: 'flex',
                gap: 9,
                background: 'rgba(255, 255, 255, 0.025)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: 8,
                padding: '8px 10px',
                marginTop: 2,
              }}
            >
              <div
                style={{
                  minWidth: 20,
                  height: 20,
                  borderRadius: 6,
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#f59e0b',
                  fontSize: 11,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 1,
                }}
              >
                {num}
              </div>
              <div style={{ flex: 1, color: '#f1f5f9' }}>
                {renderInlineText(rest)}
              </div>
            </div>
          );
        }

        // Check if paragraph is a bullet list (lines starting with '-' or '*')
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const bulletLines = trimmed.split(/\n/).filter(Boolean);
          return (
            <div key={pIdx} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {bulletLines.map((line, bIdx) => {
                const cleanLine = line.replace(/^[-*]\s+/, '');
                return (
                  <div key={bIdx} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: '#f59e0b', fontSize: 13, lineHeight: '18px' }}>•</span>
                    <div style={{ flex: 1, color: '#f1f5f9' }}>{renderInlineText(cleanLine)}</div>
                  </div>
                );
              })}
            </div>
          );
        }

        // Regular paragraph
        return (
          <p key={pIdx} style={{ margin: 0, color: '#f1f5f9' }}>
            {renderInlineText(trimmed)}
          </p>
        );
      })}
    </div>
  );
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
  const abortControllerRef = useRef<AbortController | null>(null);

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

  // Clean up streaming on unmount or when closed
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  const handleClose = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
    setOpen(false);
  };

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

      // Abort any existing stream
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text.trim() };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setLoading(true);

      const history = messages.slice(-6).map((m) => ({ role: m.role, content: m.content }));
      const aiMsgId = `${Date.now() + 1}_ai`;

      setMessages((prev) => [...prev, { id: aiMsgId, role: 'assistant', content: '' }]);

      // 20-second connection timeout
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 20000);

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
            signal: controller.signal,
            body: JSON.stringify({
              message: text.trim(),
              history,
              context: user?.name ? `User: ${user.name}, Role: ${user.role || 'student'}` : '',
            }),
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error('AI service returned non-200 status');
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';
        let finalSuggestions: string[] = DEFAULT_SUGGESTIONS;
        let streamError = '';

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
                  if (parsed.error) {
                    streamError = parsed.error as string;
                  }
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
              ? {
                  ...m,
                  content: streamError || accumulated,
                  suggestions: finalSuggestions,
                  isError: !!streamError,
                  failedPrompt: streamError ? text.trim() : m.failedPrompt,
                }
              : m
          )
        );
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiMsgId
                ? {
                    ...m,
                    content: "Request was cancelled or timed out. Click retry to try again.",
                    suggestions: DEFAULT_SUGGESTIONS,
                    isError: true,
                    failedPrompt: text.trim(),
                  }
                : m
            )
          );
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiMsgId
                ? {
                    ...m,
                    content:
                      "AI services are temporarily unavailable or busy. Please check your connection and retry.",
                    suggestions: DEFAULT_SUGGESTIONS,
                    isError: true,
                    failedPrompt: text.trim(),
                  }
                : m
            )
          );
        }
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
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
          aria-label="Open SkillSense AI Copilot assistant"
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
          role="dialog"
          aria-label="SkillSense AI Copilot"
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
                aria-label="Clear chat history"
              >
                <Trash2 size={14} />
              </button>

              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
                title={expanded ? 'Minimize' : 'Maximize'}
                aria-label={expanded ? 'Minimize assistant drawer' : 'Maximize assistant drawer'}
              >
                {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>

              <button
                type="button"
                onClick={handleClose}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
                title="Close chat"
                aria-label="Close assistant drawer"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div
            aria-live="polite"
            style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            {messages.map((m) => {
              const isAssistant = m.role === 'assistant';

              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    flexDirection: isAssistant ? 'row' : 'row-reverse',
                    alignItems: 'flex-start',
                    gap: 10,
                    width: '100%',
                  }}
                >
                  {/* Assistant Avatar */}
                  {isAssistant && (
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))',
                        border: '1px solid rgba(245,158,11,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#f59e0b',
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      <Bot size={15} />
                    </div>
                  )}

                  <div
                    style={{
                      maxWidth: isAssistant ? '88%' : '82%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isAssistant ? 'flex-start' : 'flex-end',
                    }}
                  >
                    {/* Chat Bubble */}
                    <div
                      style={{
                        padding: isAssistant ? '12px 16px' : '10px 15px',
                        borderRadius: isAssistant ? '4px 14px 14px 14px' : '14px 14px 4px 14px',
                        background: isAssistant
                          ? m.isError
                            ? 'rgba(239, 68, 68, 0.12)'
                            : '#141724'
                          : 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: isAssistant ? (m.isError ? '#fca5a5' : '#f1f5f9') : '#090a0f',
                        border: isAssistant
                          ? `1px solid ${m.isError ? 'rgba(239,68,68,0.35)' : 'rgba(255,255,255,0.09)'}`
                          : 'none',
                        boxShadow: isAssistant
                          ? '0 4px 16px rgba(0,0,0,0.3)'
                          : '0 4px 12px rgba(245,158,11,0.25)',
                        fontFamily: 'var(--font-inter), system-ui, -apple-system, sans-serif',
                        fontSize: 13,
                        lineHeight: 1.6,
                        fontWeight: isAssistant ? 400 : 600,
                        position: 'relative',
                        width: '100%',
                      }}
                    >
                      {m.content ? (
                        isAssistant && !m.isError ? (
                          <FormattedMessageContent text={m.content} />
                        ) : (
                          <span style={{ whiteSpace: 'pre-wrap' }}>{m.content}</span>
                        )
                      ) : (
                        <div style={{ display: 'flex', gap: 5, padding: '6px 0', alignItems: 'center' }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', animation: 'pulse-slow 1s infinite' }} />
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', animation: 'pulse-slow 1.2s infinite' }} />
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', animation: 'pulse-slow 1.4s infinite' }} />
                        </div>
                      )}

                      {/* Assistant Card Footer Bar */}
                      {isAssistant && m.content && !m.isError && (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            marginTop: 10,
                            paddingTop: 6,
                            borderTop: '1px solid rgba(255,255,255,0.06)',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => handleCopy(m.id, m.content)}
                            aria-label="Copy AI response"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              background: 'rgba(255,255,255,0.04)',
                              border: '1px solid rgba(255,255,255,0.08)',
                              borderRadius: 6,
                              padding: '3px 8px',
                              color: copiedId === m.id ? '#10b981' : '#94a3b8',
                              fontSize: 10.5,
                              fontWeight: 500,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                            className="hover:text-white hover:bg-white/10"
                          >
                            {copiedId === m.id ? <Check size={12} /> : <Copy size={12} />}
                            <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      )}

                      {/* Retry Button on Error */}
                      {isAssistant && m.isError && m.failedPrompt && (
                        <button
                          type="button"
                          onClick={() => sendMessage(m.failedPrompt!)}
                          className="btn-gold"
                          style={{ fontSize: 11, padding: '5px 12px', marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 5 }}
                        >
                          <RotateCcw size={12} /> Retry Request
                        </button>
                      )}
                    </div>

                    {/* Suggestion Chips */}
                    {isAssistant && m.suggestions && m.suggestions.length > 0 && !m.isError && (
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
              aria-label="Ask SkillSense AI Copilot"
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
              aria-label="Send message to Copilot"
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

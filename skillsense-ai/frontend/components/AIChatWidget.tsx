'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import api from '../lib/api';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { MessageCircle, Bot, X } from 'lucide-react';

/* ── Types ───────────────────────────────────────────── */
interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    suggestions?: string[];
}

/* ── Design tokens ───────────────────────────────────── */
const INDIGO  = '#6366f1';
const PURPLE  = '#8b5cf6';
const BG      = '#0c0a16';
const PANEL_BG = '#0f0d1c';

/* ── Typing dots ─────────────────────────────────────── */
function TypingDots() {
    return (
        <div style={{ display: 'flex', gap: 4, padding: '12px 16px', alignItems: 'center' }}>
            {[0, 0.15, 0.3].map((d, i) => (
                <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#64748b', animation: `pulseDot 1.2s ${d}s ease-in-out infinite` }} />
            ))}
        </div>
    );
}

export default function AIChatWidget() {
    const { user } = useAuth();
    const [open, setOpen]       = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '0',
            role: 'assistant',
            content: "Hi! I'm SkillSense AI. Ask me anything about careers, skills, or job preparation in India!",
            suggestions: ["What skills are in demand in 2025?", "How do I crack a tech interview?", "What is NSQF certification?"],
        },
    ]);
    const [input, setInput]     = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState<string | null>(null);
    const bottomRef             = useRef<HTMLDivElement>(null);
    const inputRef              = useRef<HTMLInputElement>(null);

    // Fetch history
    useEffect(() => {
        if (user) {
            api.get('/ai/history').then(({ data }) => {
                if (data.success && data.data?.length > 0) {
                    const mapped: Message[] = data.data.map((m: any, i: number) => ({
                        id: `hist_${i}`,
                        role: m.role,
                        content: m.content
                    }));
                    setMessages(prev => [prev[0], ...mapped]);
                }
            }).catch(() => {});
        }
    }, [user]);

    // Auto-scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    // Focus input when opened
    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 100);
    }, [open]);

    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim() || loading) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text.trim() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);
        setError(null);

        const history = messages.slice(-6).map(m => ({ role: m.role, content: m.content }));
        
        // Add a placeholder assistant message that we will update
        const aiMsgId = (Date.now() + 1).toString() + '_ai';
        setMessages(prev => [...prev, { id: aiMsgId, role: 'assistant', content: '' }]);

        try {
            const token = localStorage.getItem('skillsense_token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/ai/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: text.trim(),
                    history,
                    context: `Student using SkillSense AI dashboard`,
                }),
            });

            if (!response.ok) throw new Error('Network response was not ok');
            
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let accumulatedContent = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n');
                    
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6));
                                if (data.chunk) {
                                    accumulatedContent += data.chunk;
                                    setMessages(prev => prev.map(m => 
                                        m.id === aiMsgId ? { ...m, content: accumulatedContent } : m
                                    ));
                                }
                                if (data.done) {
                                    setMessages(prev => prev.map(m => 
                                        m.id === aiMsgId ? { ...m, suggestions: data.suggestions } : m
                                    ));
                                }
                                if (data.error) {
                                    throw new Error(data.error);
                                }
                            } catch (e) {
                                // Ignore parse errors for partial chunks
                            }
                        }
                    }
                }
            }
        } catch (err: any) {
            setError('Connection failed. Please try again.');
            setMessages(prev => prev.map(m => 
                m.id === aiMsgId 
                ? { ...m, content: "I'm having trouble connecting right now. Please try again in a moment!", suggestions: ['What is JavaScript?', 'How to get a job in IT?'] }
                : m
            ));
        } finally {
            setLoading(false);
        }
    }, [messages, loading]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
    };

    return (
        <>
            <style>{`
                @keyframes pulseDot { 0%,100%{opacity:.3;transform:scale(0.85)} 50%{opacity:1;transform:scale(1)} }
                @keyframes slideUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
                @keyframes popIn    { from{transform:scale(0)} to{transform:scale(1)} }
                .chat-msg-user { 
                    background: linear-gradient(135deg, ${INDIGO}, ${PURPLE});
                    border-radius: 16px 16px 4px 16px;
                }
                .chat-msg-ai {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 16px 16px 16px 4px;
                }
                .chat-input:focus { outline: none; border-color: rgba(99,102,241,0.5) !important; }
                .suggestion-chip:hover { background: rgba(99,102,241,0.2) !important; }
                .send-btn:hover:not(:disabled) { transform: scale(1.05); }
                .send-btn:disabled { opacity: 0.5; }
            `}</style>

            {/* ── Floating Button ─────────────────────────────────── */}
            <button
                onClick={() => setOpen(o => !o)}
                style={{
                    position: 'fixed', bottom: 80, right: 24, zIndex: 300,
                    width: 52, height: 52, borderRadius: '50%', border: 'none',
                    background: `linear-gradient(135deg, ${INDIGO}, ${PURPLE})`,
                    color: '#fff', cursor: 'pointer', fontSize: 22,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 6px 28px rgba(99,102,241,0.45)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    animation: 'popIn 0.3s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 8px 36px rgba(99,102,241,0.6)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)';   e.currentTarget.style.boxShadow = '0 6px 28px rgba(99,102,241,0.45)'; }}
                aria-label="Open AI Chat"
                title="Chat with SkillSense AI"
            >
                {open ? <X size={24} /> : <MessageCircle size={24} />}
            </button>

            {/* ── Chat Panel ──────────────────────────────────────── */}
            {open && (
                <div style={{
                    position: 'fixed', bottom: 144, right: 24, zIndex: 299,
                    width: 380, height: 500, borderRadius: 18, overflow: 'hidden',
                    background: PANEL_BG,
                    border: '1px solid rgba(99,102,241,0.2)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)',
                    display: 'flex', flexDirection: 'column',
                    animation: 'slideUp 0.25s ease',
                    fontFamily: 'Inter, sans-serif',
                }}>
                    {/* Header */}
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 10, background: `linear-gradient(135deg, ${INDIGO}18, ${PURPLE}14)`, flexShrink: 0 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg, ${INDIGO}, ${PURPLE})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Bot size={20} color="#fff" /></div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>SkillSense AI</div>
                            <div style={{ fontSize: 10, color: '#22c55e', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e' }} /> Online · GPT-4o-mini
                            </div>
                        </div>
                        <button onClick={async () => {
                             if (confirm('Clear all chat history?')) {
                                 await api.get('/ai/history?clear=true'); // Backend usually handles this or just clear local
                                 setMessages([{ id: '0', role: 'assistant', content: "Hi! I'm SkillSense AI. How can I help you today?", suggestions: ["What skills are in demand?", "Help me prepare for interviews", "What is NSQF?"] }]);
                                 toast.success('Chat history cleared');
                             }
                        }}
                            style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 11, padding: '4px 8px', borderRadius: 6, transition: 'color 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                            onMouseLeave={e => e.currentTarget.style.color = '#475569'}
                            title="Clear chat">
                            Clear
                        </button>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 8px', display: 'flex', flexDirection: 'column', gap: 10, scrollbarWidth: 'thin' }}>
                        {messages.map(msg => (
                            <div key={msg.id}>
                                <div style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                    {msg.role === 'assistant' && (
                                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: `linear-gradient(135deg, ${INDIGO}, ${PURPLE})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginRight: 6, alignSelf: 'flex-end' }}><Bot size={14} color="#fff" /></div>
                                    )}
                                    <div className={msg.role === 'user' ? 'chat-msg-user' : 'chat-msg-ai'}
                                        style={{ maxWidth: '78%', padding: '10px 14px', fontSize: 13, lineHeight: 1.65, color: '#fff', wordBreak: 'break-word' }}>
                                        {msg.content}
                                    </div>
                                </div>
                                {/* Suggestion chips */}
                                {msg.role === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8, paddingLeft: 30 }}>
                                        {msg.suggestions.map((s, i) => (
                                            <button key={i} onClick={() => sendMessage(s)}
                                                className="suggestion-chip"
                                                style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc', cursor: 'pointer', transition: 'background 0.2s' }}>
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {loading && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ width: 24, height: 24, borderRadius: '50%', background: `linear-gradient(135deg, ${INDIGO}, ${PURPLE})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bot size={14} color="#fff" /></div>
                                <div className="chat-msg-ai"><TypingDots /></div>
                            </div>
                        )}

                        {error && (
                            <div style={{ fontSize: 11, color: '#ef4444', textAlign: 'center', padding: '4px 12px' }}>{error}</div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div style={{ padding: '10px 14px 12px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 8, flexShrink: 0 }}>
                        <input
                            ref={inputRef}
                            className="chat-input"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask me anything..."
                            disabled={loading}
                            style={{
                                flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 10, padding: '9px 12px', color: '#fff', fontSize: 13,
                                transition: 'border-color 0.2s',
                            }}
                        />
                        <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading}
                            className="send-btn"
                            style={{
                                width: 36, height: 36, borderRadius: 10, border: 'none',
                                background: `linear-gradient(135deg, ${INDIGO}, ${PURPLE})`,
                                color: '#fff', cursor: 'pointer', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', fontSize: 14,
                                transition: 'transform 0.2s', flexShrink: 0,
                            }}>
                            ↑
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

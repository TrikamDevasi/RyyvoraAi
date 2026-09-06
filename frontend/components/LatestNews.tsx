'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

/* ─── Types ─── */
interface DevToArticle {
    id: number;
    title: string;
    description: string;
    url: string;
    cover_image: string | null;
    social_image: string | null;
    readable_publish_date: string;
    reading_time_minutes: number;
    positive_reactions_count: number;
    comments_count: number;
    tag_list: string[];
    user: {
        name: string;
        username: string;
        profile_image_90: string;
    };
    organization?: {
        name: string;
        profile_image_90: string;
    };
}

/* ─── API Endpoints ─── */
const API_TAGS = [
    'javascript', 'react', 'frontend', 'webdev', 'fullstack',
    'node', 'backend', 'html', 'css', 'softwareengineer',
];

/* ─── Props ─── */
interface LatestNewsProps {
    accent: string;
    sectionLabel: string;
}

/* ─── Tag Colors ─── */
const tagColorMap: Record<string, string> = {
    javascript: '#F7DF1E',
    react: '#61DAFB',
    frontend: '#06b6d4',
    webdev: '#22c55e',
    fullstack: '#a78bfa',
    node: '#68A063',
    backend: '#F59E0B',
    html: '#E44D26',
    css: '#264de4',
    softwareengineer: '#D4A843',
    typescript: '#3178C6',
    programming: '#a78bfa',
    ai: '#06b6d4',
    beginners: '#22c55e',
    tutorial: '#F59E0B',
};

const getTagColor = (tag: string): string => tagColorMap[tag] || '#94a3b8';

/* ─── Component ─── */
export default function LatestNews({ accent, sectionLabel }: LatestNewsProps) {
    const [articles, setArticles] = useState<DevToArticle[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [fadeClass, setFadeClass] = useState<'in' | 'out'>('in');
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const transitionRef = useRef<NodeJS.Timeout | null>(null);

    /* ── Fetch articles ── */
    useEffect(() => {
        const fetchArticles = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const promises = API_TAGS.map(tag =>
                    fetch(`https://dev.to/api/articles?tag=${tag}&per_page=3`)
                        .then(res => {
                            if (!res.ok) throw new Error(`API error for tag: ${tag}`);
                            return res.json();
                        })
                        .catch(() => [])
                );

                const results = await Promise.all(promises);
                const allArticles: DevToArticle[] = results.flat();

                // Deduplicate by id, shuffle, take top 30
                const uniqueMap = new Map<number, DevToArticle>();
                allArticles.forEach(a => {
                    if (!uniqueMap.has(a.id)) uniqueMap.set(a.id, a);
                });

                const unique = Array.from(uniqueMap.values());
                // Sort by reactions (most popular first) then shuffle for variety
                unique.sort((a, b) => b.positive_reactions_count - a.positive_reactions_count);
                const top = unique.slice(0, 30);
                // Light shuffle to keep it interesting
                for (let i = top.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [top[i], top[j]] = [top[j], top[i]];
                }

                setArticles(top);
            } catch (err) {
                setError('Failed to load news. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticles();
    }, []);

    /* ── Auto-rotate ── */
    const goToNext = useCallback(() => {
        if (articles.length === 0) return;
        setFadeClass('out');
        transitionRef.current = setTimeout(() => {
            setCurrentIndex(prev => (prev + 1) % articles.length);
            setFadeClass('in');
        }, 500);
    }, [articles.length]);

    useEffect(() => {
        if (isPaused || articles.length === 0) return;
        timerRef.current = setInterval(goToNext, 4000);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (transitionRef.current) clearTimeout(transitionRef.current);
        };
    }, [isPaused, articles.length, goToNext]);

    const goToPrev = () => {
        if (articles.length === 0) return;
        setFadeClass('out');
        transitionRef.current = setTimeout(() => {
            setCurrentIndex(prev => (prev - 1 + articles.length) % articles.length);
            setFadeClass('in');
        }, 500);
    };

    const goToIdx = (idx: number) => {
        setFadeClass('out');
        transitionRef.current = setTimeout(() => {
            setCurrentIndex(idx);
            setFadeClass('in');
        }, 500);
    };

    if (isLoading) {
        return (
            <div>
                <div style={{ marginBottom: 24 }}>
                    <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>
                        Latest <span style={{ color: accent }}>News</span>
                    </h1>
                    <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
                        Tech news and articles curated for {sectionLabel}
                    </p>
                </div>

                {/* Loading skeleton */}
                <div className="stat-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{
                        height: 280,
                        background: `linear-gradient(135deg, rgba(${accent === '#D4A843' ? '212,168,67' : accent === '#a78bfa' ? '167,139,250' : accent === '#34d399' ? '52,211,153' : '245,158,11'},0.05), transparent)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: 36, height: 36, border: `3px solid ${accent}`, borderTopColor: 'transparent',
                                borderRadius: '50%', margin: '0 auto 16px',
                                animation: 'spin 1s linear infinite',
                            }} />
                            <p style={{ color: '#94a3b8', fontSize: 13 }}>Fetching latest articles...</p>
                        </div>
                    </div>
                    <div style={{ padding: '24px 28px' }}>
                        <div style={{ height: 20, width: '70%', background: 'rgba(212,168,67,0.06)', borderRadius: 8, marginBottom: 12 }} />
                        <div style={{ height: 14, width: '100%', background: 'rgba(212,168,67,0.04)', borderRadius: 6, marginBottom: 8 }} />
                        <div style={{ height: 14, width: '85%', background: 'rgba(212,168,67,0.04)', borderRadius: 6 }} />
                    </div>
                </div>

                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
        );
    }

    if (error || articles.length === 0) {
        return (
            <div>
                <div style={{ marginBottom: 24 }}>
                    <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>
                        Latest <span style={{ color: accent }}>News</span>
                    </h1>
                </div>
                <div className="stat-card" style={{ textAlign: 'center', padding: 40 }}>
                    <p style={{ color: '#ef4444', fontSize: 14, fontWeight: 600 }}>{error || 'No articles found'}</p>
                    <button onClick={() => window.location.reload()} className="btn-ghost" style={{ marginTop: 16, fontSize: 13 }}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const article = articles[currentIndex];
    const coverImg = article.cover_image || article.social_image;

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>
                    Latest <span style={{ color: accent }}>News</span>
                </h1>
                <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
                    Tech news and articles curated for {sectionLabel}
                </p>
            </div>

            {/* ── Featured Article (auto-rotating) ── */}
            <div
                className="stat-card"
                style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Progress bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, height: 3, background: 'rgba(212,168,67,0.08)' }}>
                    <div style={{
                        height: '100%', background: accent,
                        width: isPaused ? `${((currentIndex + 1) / articles.length) * 100}%` : `${((currentIndex + 1) / articles.length) * 100}%`,
                        transition: 'width 0.5s ease',
                    }} />
                </div>

                <div
                    onClick={() => window.open(article.url, '_blank')}
                    style={{
                        opacity: fadeClass === 'in' ? 1 : 0,
                        transform: fadeClass === 'in' ? 'translateY(0)' : 'translateY(12px)',
                        transition: 'opacity 0.5s ease, transform 0.5s ease',
                    }}
                >
                    {/* Cover image */}
                    {coverImg && (
                        <div style={{
                            height: 280, overflow: 'hidden', position: 'relative',
                            background: `linear-gradient(135deg, rgba(0,0,0,0.85), rgba(0,0,0,0.4))`,
                        }}>
                            <img
                                src={coverImg}
                                alt={article.title}
                                style={{
                                    width: '100%', height: '100%', objectFit: 'cover',
                                    opacity: 0.4, transition: 'opacity 0.3s',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.opacity = '0.6')}
                                onMouseLeave={e => (e.currentTarget.style.opacity = '0.4')}
                            />
                            {/* Overlay content on image */}
                            <div style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0,
                                padding: '32px 28px 20px',
                                background: 'linear-gradient(transparent, rgba(8,6,15,0.95))',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                                    {article.tag_list.slice(0, 4).map(tag => (
                                        <span key={tag} style={{
                                            fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
                                            background: `${getTagColor(tag)}18`, color: getTagColor(tag),
                                            textTransform: 'uppercase', letterSpacing: '0.5px',
                                        }}>{tag}</span>
                                    ))}
                                </div>
                                <h2 className="font-display" style={{
                                    fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1.35,
                                    margin: 0,
                                }}>
                                    {article.title}
                                </h2>
                            </div>

                            {/* Article counter badge */}
                            <div style={{
                                position: 'absolute', top: 16, right: 16, zIndex: 10,
                                background: 'rgba(8,6,15,0.7)', backdropFilter: 'blur(8px)',
                                padding: '5px 12px', borderRadius: 99,
                                fontSize: 11, color: '#94a3b8', fontWeight: 600,
                                border: '1px solid rgba(212,168,67,0.15)',
                            }}>
                                {currentIndex + 1} / {articles.length}
                            </div>

                            {/* Live badge */}
                            <div style={{
                                position: 'absolute', top: 16, left: 16, zIndex: 10,
                                display: 'flex', alignItems: 'center', gap: 6,
                                background: 'rgba(8,6,15,0.7)', backdropFilter: 'blur(8px)',
                                padding: '5px 12px', borderRadius: 99,
                                border: '1px solid rgba(212,168,67,0.15)',
                            }}>
                                <div style={{
                                    width: 7, height: 7, borderRadius: '50%',
                                    background: isPaused ? '#64748b' : '#22c55e',
                                    boxShadow: isPaused ? 'none' : '0 0 8px rgba(34,197,94,0.5)',
                                    animation: isPaused ? 'none' : 'pulse 2s ease-in-out infinite',
                                }} />
                                <span style={{ fontSize: 11, color: isPaused ? '#64748b' : '#22c55e', fontWeight: 700 }}>
                                    {isPaused ? 'PAUSED' : 'LIVE'}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* No cover fallback */}
                    {!coverImg && (
                        <div style={{
                            height: 180,
                            background: `linear-gradient(135deg, rgba(${accent === '#D4A843' ? '212,168,67' : '100,100,100'},0.08), transparent)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            position: 'relative',
                        }}>
                            <div style={{ padding: '0 28px', textAlign: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginBottom: 12 }}>
                                    {article.tag_list.slice(0, 4).map(tag => (
                                        <span key={tag} style={{
                                            fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
                                            background: `${getTagColor(tag)}18`, color: getTagColor(tag),
                                            textTransform: 'uppercase', letterSpacing: '0.5px',
                                        }}>{tag}</span>
                                    ))}
                                </div>
                                <h2 className="font-display" style={{ fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1.35, margin: 0 }}>
                                    {article.title}
                                </h2>
                            </div>
                            <div style={{
                                position: 'absolute', top: 16, right: 16,
                                background: 'rgba(8,6,15,0.7)', padding: '5px 12px', borderRadius: 99,
                                fontSize: 11, color: '#94a3b8', fontWeight: 600,
                            }}>
                                {currentIndex + 1} / {articles.length}
                            </div>
                        </div>
                    )}

                    {/* Article body */}
                    <div style={{ padding: '20px 28px 16px' }}>
                        <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, margin: '0 0 16px', maxHeight: 48, overflow: 'hidden' }}>
                            {article.description}
                        </p>

                        {/* Author + Meta */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <img
                                    src={article.user.profile_image_90}
                                    alt={article.user.name}
                                    style={{ width: 32, height: 32, borderRadius: '50%', border: `2px solid ${accent}30` }}
                                />
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{article.user.name}</div>
                                    <div style={{ fontSize: 11, color: '#94a3b8' }}>@{article.user.username}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#94a3b8' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                                    {article.positive_reactions_count}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                    {article.comments_count}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                    {article.reading_time_minutes} min
                                </span>
                                <span>{article.readable_publish_date}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation arrows */}
                <div style={{
                    position: 'absolute', top: '50%', left: 12, transform: 'translateY(-50%)', zIndex: 15,
                    opacity: isPaused ? 1 : 0, transition: 'opacity 0.3s',
                }}>
                    <button
                        onClick={e => { e.stopPropagation(); goToPrev(); }}
                        style={{
                            width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(212,168,67,0.2)',
                            background: 'rgba(8,6,15,0.8)', backdropFilter: 'blur(8px)',
                            color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 16, transition: 'border-color 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = accent)}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(212,168,67,0.2)')}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                    </button>
                </div>
                <div style={{
                    position: 'absolute', top: '50%', right: 12, transform: 'translateY(-50%)', zIndex: 15,
                    opacity: isPaused ? 1 : 0, transition: 'opacity 0.3s',
                }}>
                    <button
                        onClick={e => { e.stopPropagation(); goToNext(); }}
                        style={{
                            width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(212,168,67,0.2)',
                            background: 'rgba(8,6,15,0.8)', backdropFilter: 'blur(8px)',
                            color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 16, transition: 'border-color 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = accent)}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(212,168,67,0.2)')}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                    </button>
                </div>
            </div>

            {/* ── Dot indicators ── */}
            <div style={{
                display: 'flex', justifyContent: 'center', gap: 5, marginTop: 16,
            }}>
                {articles.slice(0, 12).map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => goToIdx(idx)}
                        style={{
                            width: currentIndex === idx ? 24 : 8,
                            height: 8,
                            borderRadius: 99,
                            border: 'none',
                            background: currentIndex === idx ? accent : 'rgba(212,168,67,0.3)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            padding: 0,
                        }}
                    />
                ))}
                {articles.length > 12 && (
                    <span style={{ fontSize: 11, color: '#475569', alignSelf: 'center', marginLeft: 4 }}>
                        +{articles.length - 12}
                    </span>
                )}
            </div>

            {/* ── Recent Articles Grid ── */}
            <div style={{ marginTop: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 4, height: 18, borderRadius: 2, background: accent }} />
                    <h3 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>More Articles</h3>
                    <div style={{ flex: 1, height: 1, background: 'rgba(212,168,67,0.08)', marginLeft: 8 }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
                    {articles.filter((_, i) => i !== currentIndex).slice(0, 6).map(a => (
                        <div
                            key={a.id}
                            className="stat-card"
                            onClick={() => window.open(a.url, '_blank')}
                            style={{
                                cursor: 'pointer', transition: 'border-color 0.2s, transform 0.2s',
                                padding: '16px',
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.borderColor = `${accent}40`;
                                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,168,67,0.1)';
                                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                            }}
                        >
                            <div style={{ display: 'flex', gap: 4, marginBottom: 10, flexWrap: 'wrap' }}>
                                {a.tag_list.slice(0, 3).map(tag => (
                                    <span key={tag} style={{
                                        fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                                        background: `${getTagColor(tag)}14`, color: getTagColor(tag),
                                        textTransform: 'uppercase', letterSpacing: '0.3px',
                                    }}>{tag}</span>
                                ))}
                            </div>
                            <h4 className="font-display" style={{
                                fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.4,
                                marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical', overflow: 'hidden',
                            }}>
                                {a.title}
                            </h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <img src={a.user.profile_image_90} alt={a.user.name}
                                        style={{ width: 20, height: 20, borderRadius: '50%' }} />
                                    <span style={{ fontSize: 11, color: '#94a3b8' }}>{a.user.name}</span>
                                </div>
                                <div style={{ display: 'flex', gap: 10, fontSize: 11, color: '#475569' }}>
                                    <span>{a.positive_reactions_count} likes</span>
                                    <span>{a.reading_time_minutes} min</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Animations */}
            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}

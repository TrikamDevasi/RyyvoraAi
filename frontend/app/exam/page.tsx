'use client';

import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

/* ─── Sample Questions ─── */
const questionBank: Record<string, { question: string; options: string[]; correct: number }[]> = {
    'React.js Fundamentals': [
        { question: 'What hook is used to manage side effects in React?', options: ['useState', 'useEffect', 'useReducer', 'useMemo'], correct: 1 },
        { question: 'Which of the following is NOT a valid React hook?', options: ['useContext', 'useHistory', 'useCallback', 'useRef'], correct: 1 },
        { question: 'What does JSX stand for?', options: ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JavaScript Extension'], correct: 0 },
        { question: 'How do you pass data from parent to child component?', options: ['State', 'Props', 'Context', 'Redux'], correct: 1 },
        { question: 'Which method is used to update state in a functional component?', options: ['this.setState()', 'useState setter', 'forceUpdate()', 'render()'], correct: 1 },
        { question: 'What is the virtual DOM?', options: ['A copy of the real DOM in memory', 'A new browser API', 'A CSS framework', 'A testing tool'], correct: 0 },
        { question: 'What is the purpose of React.memo()?', options: ['Memoize expensive calculations', 'Prevent unnecessary re-renders', 'Create refs', 'Handle errors'], correct: 1 },
        { question: 'Which hook replaces componentDidMount in functional components?', options: ['useState', 'useEffect with empty deps', 'useLayoutEffect', 'useCallback'], correct: 1 },
        { question: 'How do you handle forms in React?', options: ['Controlled components', 'Uncontrolled components', 'Both A and B', 'None of the above'], correct: 2 },
        { question: 'What is React Context used for?', options: ['Routing', 'State management across components', 'CSS styling', 'API calls'], correct: 1 },
        { question: 'What is the correct way to conditionally render in JSX?', options: ['if-else in JSX', 'Ternary operator', 'switch statement', 'for loop'], correct: 1 },
        { question: 'Which lifecycle method is called after a component renders?', options: ['componentWillMount', 'componentDidMount', 'componentWillUpdate', 'render'], correct: 1 },
        { question: 'What does useReducer return?', options: ['[state, dispatch]', '[state, setState]', 'state only', 'dispatch only'], correct: 0 },
        { question: 'What is a Higher-Order Component (HOC)?', options: ['A component that returns another component', 'A class component', 'A styled component', 'A hook'], correct: 0 },
        { question: 'How do you optimize a list rendering in React?', options: ['Using key prop', 'Using id attribute', 'Using class names', 'Using inline styles'], correct: 0 },
        { question: 'What is React Fiber?', options: ['A CSS framework', 'React\'s reconciliation algorithm', 'A state management library', 'A testing framework'], correct: 1 },
        { question: 'Which hook is used to access DOM elements?', options: ['useState', 'useEffect', 'useRef', 'useMemo'], correct: 2 },
        { question: 'What is the purpose of useCallback?', options: ['Memoize functions', 'Manage state', 'Handle side effects', 'Create context'], correct: 0 },
        { question: 'How do you handle errors in React?', options: ['try-catch', 'Error Boundaries', 'Promise.catch', 'All of the above'], correct: 1 },
        { question: 'What is the default behavior of useEffect?', options: ['Runs once', 'Runs on every render', 'Never runs', 'Runs on unmount'], correct: 1 },
    ],
};

const defaultQuestions = [
    { question: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correct: 1 },
    { question: 'Which data structure uses FIFO?', options: ['Stack', 'Queue', 'Tree', 'Graph'], correct: 1 },
    { question: 'What is polymorphism in OOP?', options: ['Multiple forms of a method', 'Data hiding', 'Code reuse', 'Memory management'], correct: 0 },
    { question: 'Which sorting algorithm has the best average case?', options: ['Bubble Sort', 'Quick Sort', 'Selection Sort', 'Insertion Sort'], correct: 1 },
    { question: 'What is a closure in JavaScript?', options: ['A function with access to its outer scope', 'A class method', 'A loop construct', 'An error handler'], correct: 0 },
    { question: 'What does REST stand for?', options: ['Representational State Transfer', 'Remote Execution Standard', 'Real-time Event System', 'Resource Encoding Standard'], correct: 0 },
    { question: 'Which protocol does HTTPS use?', options: ['TCP', 'TLS/SSL', 'FTP', 'UDP'], correct: 1 },
    { question: 'What is normalization in databases?', options: ['Reducing redundancy', 'Adding indexes', 'Creating backups', 'Encrypting data'], correct: 0 },
    { question: 'What is the purpose of an index in a database?', options: ['Security', 'Faster queries', 'Data validation', 'Backup'], correct: 1 },
    { question: 'What is Git used for?', options: ['Version control', 'Database management', 'Web hosting', 'Testing'], correct: 0 },
    { question: 'What does CI/CD stand for?', options: ['Continuous Integration/Continuous Deployment', 'Code Integration/Code Deployment', 'Central Integration/Central Delivery', 'None of the above'], correct: 0 },
    { question: 'What is Docker used for?', options: ['Containerization', 'Version control', 'Testing', 'Monitoring'], correct: 0 },
    { question: 'What is an API?', options: ['Application Programming Interface', 'Automated Program Integration', 'Application Process Integration', 'Advanced Programming Interface'], correct: 0 },
    { question: 'Which HTTP method is used to update a resource?', options: ['GET', 'POST', 'PUT', 'DELETE'], correct: 2 },
    { question: 'What is the purpose of middleware in Express?', options: ['Handle requests between routes', 'Manage database', 'Style frontend', 'Deploy apps'], correct: 0 },
    { question: 'What is a Promise in JavaScript?', options: ['Async operation result', 'A variable type', 'A loop', 'A class'], correct: 0 },
    { question: 'What does ORM stand for?', options: ['Object-Relational Mapping', 'Object Resource Management', 'Online Resource Manager', 'Object Reference Model'], correct: 0 },
    { question: 'What is the purpose of a load balancer?', options: ['Distribute traffic across servers', 'Store data', 'Run tests', 'Monitor logs'], correct: 0 },
    { question: 'What is Redis used for?', options: ['In-memory caching', 'Version control', 'CI/CD', 'Frontend framework'], correct: 0 },
    { question: 'What is WebSocket used for?', options: ['Real-time bidirectional communication', 'File storage', 'Database queries', 'CSS styling'], correct: 0 },
];

const GOLD = '#D4A843';

function ExamContent() {
    const searchParams = useSearchParams();
    const testTitle = searchParams.get('title') || 'Skill Assessment';
    const testDuration = parseInt(searchParams.get('duration') || '30');
    const totalQuestions = parseInt(searchParams.get('questions') || '20');
    const subject = searchParams.get('subject') || 'General';

    const questions = (questionBank[testTitle] || defaultQuestions).slice(0, totalQuestions);

    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
    const [timeLeft, setTimeLeft] = useState(testDuration * 60); // seconds
    const [tabWarnings, setTabWarnings] = useState(0);
    const [showWarning, setShowWarning] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [autoSubmitReason, setAutoSubmitReason] = useState('');
    const warningCountRef = useRef(0);
    const submittedRef = useRef(false);
    const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState(false);

    /* ── Request fullscreen on mount ── */
    useEffect(() => {
        const requestFS = async () => {
            try {
                await document.documentElement.requestFullscreen();
                setIsFullscreen(true);
            } catch {
                // Fullscreen not supported or denied
            }
        };
        requestFS();

        // Start webcam
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 200, height: 200, facingMode: 'user' },
                    audio: false,
                });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setCameraActive(true);
            } catch {
                setCameraError(true);
            }
        };
        startCamera();

        return () => {
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => { });
            }
            // Stop camera on unmount
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
            }
        };
    }, []);

    /* ── Fullscreen change listener ── */
    useEffect(() => {
        const handleFSChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFSChange);
        return () => document.removeEventListener('fullscreenchange', handleFSChange);
    }, []);

    /* ── Submit function ── */
    const submitTest = useCallback((reason?: string) => {
        if (submittedRef.current) return;
        submittedRef.current = true;
        if (reason) setAutoSubmitReason(reason);
        setIsSubmitted(true);
        setShowResults(true);
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => { });
        }
        // Stop camera on submit
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            setCameraActive(false);
        }
    }, []);

    /* ── Tab switch / visibility detection ── */
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && !submittedRef.current) {
                warningCountRef.current += 1;
                const count = warningCountRef.current;
                setTabWarnings(count);

                if (count > 2) {
                    submitTest('Tab switch limit exceeded (3 violations detected)');
                } else {
                    setShowWarning(true);
                    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
                    warningTimeoutRef.current = setTimeout(() => setShowWarning(false), 5000);
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
        };
    }, [submitTest]);

    /* ── Timer ── */
    useEffect(() => {
        if (isSubmitted) return;
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    submitTest('Time expired');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [isSubmitted, submitTest]);

    /* ── Keyboard shortcuts ── */
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isSubmitted) return;
            if (e.key === 'ArrowRight' && currentQ < questions.length - 1) setCurrentQ(p => p + 1);
            if (e.key === 'ArrowLeft' && currentQ > 0) setCurrentQ(p => p - 1);
            if (['1', '2', '3', '4'].includes(e.key)) {
                const idx = parseInt(e.key) - 1;
                setAnswers(prev => { const n = [...prev]; n[currentQ] = idx; return n; });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentQ, isSubmitted, questions.length]);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    const answeredCount = answers.filter(a => a !== null).length;
    const score: number = isSubmitted
        ? answers.reduce<number>((acc, a, i) => acc + (a === questions[i]?.correct ? 1 : 0), 0)
        : 0;
    const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

    /* ── RESULTS SCREEN ── */
    if (showResults) {
        return (
            <div style={{
                minHeight: '100vh', background: '#08060f',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Space Grotesk', sans-serif",
            }}>
                <div style={{
                    maxWidth: 560, width: '90%', padding: 40, borderRadius: 20,
                    background: 'rgba(212,168,67,0.03)', border: '1px solid rgba(212,168,67,0.12)',
                    textAlign: 'center',
                }}>
                    {autoSubmitReason && (
                        <div style={{
                            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                            borderRadius: 10, padding: '10px 16px', marginBottom: 24,
                            fontSize: 13, color: '#ef4444', fontWeight: 600,
                        }}>
                            Auto-submitted: {autoSubmitReason}
                        </div>
                    )}

                    <div style={{
                        width: 80, height: 80, borderRadius: '50%', margin: '0 auto 20px',
                        background: percentage >= 70 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: `3px solid ${percentage >= 70 ? '#22c55e' : '#ef4444'}`,
                    }}>
                        <span style={{ fontSize: 28, fontWeight: 800, color: percentage >= 70 ? '#22c55e' : '#ef4444' }}>
                            {percentage}%
                        </span>
                    </div>

                    <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
                        {percentage >= 70 ? 'Congratulations!' : 'Test Completed'}
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 24 }}>{testTitle}</p>

                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24,
                    }}>
                        {[
                            { label: 'Correct', value: score, color: '#22c55e' },
                            { label: 'Wrong', value: answeredCount - score, color: '#ef4444' },
                            { label: 'Unanswered', value: questions.length - answeredCount, color: '#64748b' },
                        ].map((stat, i) => (
                            <div key={i} style={{
                                background: `${stat.color}0a`, border: `1px solid ${stat.color}20`,
                                borderRadius: 12, padding: '14px',
                            }}>
                                <div style={{ fontSize: 24, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                                <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24,
                    }}>
                        <div style={{ background: 'rgba(212,168,67,0.04)', borderRadius: 10, padding: '12px', textAlign: 'center' }}>
                            <div style={{ fontSize: 11, color: '#64748b' }}>Tab Violations</div>
                            <div style={{ fontSize: 18, fontWeight: 800, color: tabWarnings > 0 ? '#ef4444' : '#22c55e' }}>{tabWarnings}</div>
                        </div>
                        <div style={{ background: 'rgba(212,168,67,0.04)', borderRadius: 10, padding: '12px', textAlign: 'center' }}>
                            <div style={{ fontSize: 11, color: '#64748b' }}>Time Used</div>
                            <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>
                                {formatTime(testDuration * 60 - timeLeft)}
                            </div>
                        </div>
                    </div>

                    <button onClick={() => window.close()} style={{
                        width: '100%', padding: '12px 0', borderRadius: 10,
                        background: `linear-gradient(135deg, ${GOLD}, #F0C05A)`,
                        border: 'none', color: '#08060f', fontSize: 14, fontWeight: 700,
                        cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif",
                    }}>
                        Close Window
                    </button>
                </div>
            </div>
        );
    }

    /* ── EXAM INTERFACE ── */
    return (
        <div style={{
            minHeight: '100vh', background: '#08060f', color: '#fff',
            fontFamily: "'Space Grotesk', sans-serif",
            display: 'flex', flexDirection: 'column',
        }}>
            {/* Warning Overlay */}
            {showWarning && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 99999,
                    background: 'rgba(239,68,68,0.12)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'fadeIn 0.3s ease',
                }}>
                    <div style={{
                        background: '#1a1020', border: '2px solid rgba(239,68,68,0.5)',
                        borderRadius: 20, padding: '32px 40px', maxWidth: 440, textAlign: 'center',
                        boxShadow: '0 0 60px rgba(239,68,68,0.15)',
                    }}>
                        <div style={{
                            width: 60, height: 60, borderRadius: '50%',
                            background: 'rgba(239,68,68,0.15)', margin: '0 auto 16px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            animation: 'pulse 1s ease-in-out infinite',
                        }}>
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </div>
                        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#ef4444', marginBottom: 8 }}>
                            Tab Switch Detected!
                        </h2>
                        <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, marginBottom: 12 }}>
                            You switched away from this tab. This has been recorded.
                        </p>
                        <div style={{
                            background: 'rgba(239,68,68,0.08)', borderRadius: 10, padding: '10px 16px',
                            marginBottom: 16,
                        }}>
                            <span style={{ fontSize: 13, color: '#ef4444', fontWeight: 700 }}>
                                Warning {tabWarnings} of 2
                            </span>
                            <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 8 }}>
                                — {2 - tabWarnings > 0 ? `${2 - tabWarnings} remaining` : 'Next violation will auto-submit!'}
                            </span>
                        </div>
                        <div style={{
                            display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 16,
                        }}>
                            {[1, 2].map(i => (
                                <div key={i} style={{
                                    width: 40, height: 6, borderRadius: 3,
                                    background: i <= tabWarnings ? '#ef4444' : 'rgba(239,68,68,0.15)',
                                    transition: 'background 0.3s',
                                }} />
                            ))}
                        </div>
                        <button onClick={() => setShowWarning(false)} style={{
                            padding: '10px 28px', borderRadius: 10,
                            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                            color: '#ef4444', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                            fontFamily: "'Space Grotesk', sans-serif",
                        }}>
                            I Understand, Continue Test
                        </button>
                    </div>
                </div>
            )}

            {/* Top Bar */}
            <div style={{
                padding: '12px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderBottom: '1px solid rgba(212,168,67,0.08)', background: 'rgba(8,6,15,0.95)',
                position: 'sticky', top: 0, zIndex: 100,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: 'linear-gradient(135deg, #D4A843, #F0C05A)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16, fontWeight: 800, color: '#08060f',
                    }}>S</div>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{testTitle}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{subject}</div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    {/* Tab warnings indicator */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{
                            width: 8, height: 8, borderRadius: '50%',
                            background: tabWarnings === 0 ? '#22c55e' : tabWarnings === 1 ? '#F59E0B' : '#ef4444',
                            boxShadow: tabWarnings > 0 ? `0 0 8px ${tabWarnings === 1 ? '#F59E0B' : '#ef4444'}50` : 'none',
                        }} />
                        <span style={{ fontSize: 11, color: tabWarnings > 0 ? '#ef4444' : '#22c55e', fontWeight: 600 }}>
                            {tabWarnings === 0 ? 'Clean' : `${tabWarnings}/2 Warnings`}
                        </span>
                    </div>

                    {/* Timer */}
                    <div style={{
                        padding: '6px 16px', borderRadius: 10,
                        background: timeLeft < 60 ? 'rgba(239,68,68,0.15)' : timeLeft < 300 ? 'rgba(245,158,11,0.1)' : 'rgba(212,168,67,0.06)',
                        border: `1px solid ${timeLeft < 60 ? 'rgba(239,68,68,0.3)' : timeLeft < 300 ? 'rgba(245,158,11,0.2)' : 'rgba(212,168,67,0.1)'}`,
                        animation: timeLeft < 60 ? 'pulse 1s ease-in-out infinite' : 'none',
                    }}>
                        <span style={{
                            fontSize: 18, fontWeight: 800, fontFamily: "'Space Grotesk', monospace",
                            color: timeLeft < 60 ? '#ef4444' : timeLeft < 300 ? '#F59E0B' : '#fff',
                        }}>
                            {formatTime(timeLeft)}
                        </span>
                    </div>

                    {/* Progress */}
                    <div style={{ fontSize: 12, color: '#64748b' }}>
                        <span style={{ color: '#fff', fontWeight: 700 }}>{answeredCount}</span>/{questions.length} answered
                    </div>

                    {/* Submit button */}
                    <button onClick={() => {
                        if (confirm(`Submit test? You've answered ${answeredCount} of ${questions.length} questions.`)) {
                            submitTest();
                        }
                    }} style={{
                        padding: '8px 20px', borderRadius: 10,
                        background: 'linear-gradient(135deg, #D4A843, #F0C05A)',
                        border: 'none', color: '#08060f', fontSize: 13, fontWeight: 700,
                        cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif",
                    }}>
                        Submit Test
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, display: 'flex', padding: '28px' }}>
                {/* Question Panel */}
                <div style={{ flex: 1, maxWidth: 800, marginRight: 28 }}>
                    <div style={{
                        background: 'rgba(212,168,67,0.03)', border: '1px solid rgba(212,168,67,0.08)',
                        borderRadius: 16, padding: '32px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: 8,
                                background: 'linear-gradient(135deg, #D4A843, #F0C05A)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 14, fontWeight: 800, color: '#08060f',
                            }}>
                                {currentQ + 1}
                            </div>
                            <span style={{ fontSize: 12, color: '#64748b' }}>of {questions.length} questions</span>
                            {/* Progress bar */}
                            <div style={{ flex: 1, height: 4, background: 'rgba(212,168,67,0.08)', borderRadius: 2, marginLeft: 8 }}>
                                <div style={{
                                    height: '100%', width: `${((currentQ + 1) / questions.length) * 100}%`,
                                    background: 'linear-gradient(90deg, #D4A843, #F0C05A)',
                                    borderRadius: 2, transition: 'width 0.3s ease',
                                }} />
                            </div>
                        </div>

                        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', lineHeight: 1.5, marginBottom: 28 }}>
                            {questions[currentQ].question}
                        </h2>

                        {/* Options */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {questions[currentQ].options.map((opt, i) => {
                                const isSelected = answers[currentQ] === i;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setAnswers(prev => {
                                                const n = [...prev];
                                                n[currentQ] = i;
                                                return n;
                                            });
                                        }}
                                        style={{
                                            padding: '14px 20px', borderRadius: 12, textAlign: 'left',
                                            border: `2px solid ${isSelected ? GOLD : 'rgba(212,168,67,0.1)'}`,
                                            background: isSelected ? 'rgba(212,168,67,0.08)' : 'rgba(212,168,67,0.02)',
                                            color: isSelected ? '#fff' : '#94a3b8',
                                            fontSize: 15, cursor: 'pointer',
                                            fontFamily: "'Space Grotesk', sans-serif",
                                            transition: 'all 0.2s',
                                            display: 'flex', alignItems: 'center', gap: 14,
                                        }}
                                    >
                                        <span style={{
                                            width: 28, height: 28, borderRadius: 8,
                                            background: isSelected ? GOLD : 'rgba(212,168,67,0.06)',
                                            color: isSelected ? '#08060f' : '#64748b',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 12, fontWeight: 700, flexShrink: 0,
                                            transition: 'all 0.2s',
                                        }}>
                                            {String.fromCharCode(65 + i)}
                                        </span>
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Navigation */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
                            <button
                                onClick={() => currentQ > 0 && setCurrentQ(p => p - 1)}
                                disabled={currentQ === 0}
                                style={{
                                    padding: '10px 20px', borderRadius: 10,
                                    background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.1)',
                                    color: currentQ === 0 ? '#475569' : '#fff', fontSize: 13, fontWeight: 600,
                                    cursor: currentQ === 0 ? 'default' : 'pointer',
                                    fontFamily: "'Space Grotesk', sans-serif", opacity: currentQ === 0 ? 0.5 : 1,
                                    display: 'flex', alignItems: 'center', gap: 6,
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                                Previous
                            </button>
                            <button
                                onClick={() => currentQ < questions.length - 1 && setCurrentQ(p => p + 1)}
                                disabled={currentQ === questions.length - 1}
                                style={{
                                    padding: '10px 20px', borderRadius: 10,
                                    background: currentQ === questions.length - 1 ? 'rgba(212,168,67,0.06)' : 'linear-gradient(135deg, #D4A843, #F0C05A)',
                                    border: 'none',
                                    color: currentQ === questions.length - 1 ? '#475569' : '#08060f',
                                    fontSize: 13, fontWeight: 700,
                                    cursor: currentQ === questions.length - 1 ? 'default' : 'pointer',
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    opacity: currentQ === questions.length - 1 ? 0.5 : 1,
                                    display: 'flex', alignItems: 'center', gap: 6,
                                }}
                            >
                                Next
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                            </button>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: 14, fontSize: 11, color: '#475569' }}>
                            Use arrow keys to navigate · Press 1-4 to select option
                        </div>
                    </div>
                </div>

                {/* Question Grid */}
                <div style={{ width: 240 }}>
                    <div style={{
                        background: 'rgba(212,168,67,0.03)', border: '1px solid rgba(212,168,67,0.08)',
                        borderRadius: 16, padding: '20px', position: 'sticky', top: 80,
                    }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 14 }}>Question Map</div>
                        <div style={{
                            display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6,
                        }}>
                            {questions.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentQ(i)}
                                    style={{
                                        width: 36, height: 36, borderRadius: 8,
                                        background: i === currentQ
                                            ? 'linear-gradient(135deg, #D4A843, #F0C05A)'
                                            : answers[i] !== null
                                                ? 'rgba(34,197,94,0.2)'
                                                : 'rgba(212,168,67,0.06)',
                                        color: i === currentQ ? '#08060f' : answers[i] !== null ? '#22c55e' : '#64748b',
                                        fontSize: 12, fontWeight: 700, cursor: 'pointer',
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        transition: 'all 0.2s',
                                        border: i === currentQ ? 'none' : `1px solid ${answers[i] !== null ? 'rgba(34,197,94,0.3)' : 'rgba(212,168,67,0.1)'}`,
                                    }}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            {[
                                { label: 'Current', color: GOLD },
                                { label: 'Answered', color: '#22c55e' },
                                { label: 'Unanswered', color: '#64748b' },
                            ].map(l => (
                                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: 3, background: l.color }} />
                                    <span style={{ fontSize: 10, color: '#64748b' }}>{l.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Clear answer */}
                        {answers[currentQ] !== null && (
                            <button
                                onClick={() => setAnswers(prev => { const n = [...prev]; n[currentQ] = null; return n; })}
                                style={{
                                    width: '100%', marginTop: 14, padding: '8px 0', borderRadius: 8,
                                    background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)',
                                    color: '#ef4444', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                                    fontFamily: "'Space Grotesk', sans-serif",
                                }}>
                                Clear Answer
                            </button>
                        )}
                    </div>

                    {/* Webcam Feed */}
                    <div style={{
                        marginTop: 16,
                        background: 'rgba(212,168,67,0.03)', border: '1px solid rgba(212,168,67,0.08)',
                        borderRadius: 16, padding: '14px', overflow: 'hidden',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                            <div style={{
                                width: 8, height: 8, borderRadius: '50%',
                                background: cameraActive ? '#ef4444' : '#475569',
                                boxShadow: cameraActive ? '0 0 8px rgba(239,68,68,0.5)' : 'none',
                                animation: cameraActive ? 'pulse 1.5s ease-in-out infinite' : 'none',
                            }} />
                            <span style={{ fontSize: 11, fontWeight: 700, color: cameraActive ? '#ef4444' : '#475569' }}>
                                {cameraActive ? 'RECORDING' : cameraError ? 'CAMERA OFF' : 'CONNECTING...'}
                            </span>
                        </div>
                        <div style={{
                            width: '100%', aspectRatio: '1/1', borderRadius: 12, overflow: 'hidden',
                            background: '#0a0814', border: '2px solid rgba(239,68,68,0.2)',
                            position: 'relative',
                        }}>
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                playsInline
                                style={{
                                    width: '100%', height: '100%', objectFit: 'cover',
                                    transform: 'scaleX(-1)', // mirror
                                    display: cameraError ? 'none' : 'block',
                                }}
                            />
                            {cameraError && (
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center',
                                    gap: 8,
                                }}>
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2">
                                        <path d="M1 1l22 22M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34" />
                                        <path d="M14.12 14.12A3 3 0 1 1 9.88 9.88" />
                                    </svg>
                                    <span style={{ fontSize: 10, color: '#475569', textAlign: 'center' }}>
                                        Camera access<br />denied
                                    </span>
                                </div>
                            )}
                            {/* Corner frame markers */}
                            {!cameraError && [
                                { top: 0, left: 0 }, { top: 0, right: 0 },
                                { bottom: 0, left: 0 }, { bottom: 0, right: 0 },
                            ].map((pos, idx) => (
                                <div key={idx} style={{
                                    position: 'absolute', ...pos,
                                    width: 16, height: 16,
                                    borderTop: pos.top === 0 ? '2px solid rgba(239,68,68,0.6)' : 'none',
                                    borderBottom: pos.bottom === 0 ? '2px solid rgba(239,68,68,0.6)' : 'none',
                                    borderLeft: pos.left === 0 ? '2px solid rgba(239,68,68,0.6)' : 'none',
                                    borderRight: pos.right === 0 ? '2px solid rgba(239,68,68,0.6)' : 'none',
                                } as React.CSSProperties} />
                            ))}
                        </div>
                        <p style={{ fontSize: 9, color: '#475569', textAlign: 'center', marginTop: 8 }}>
                            Proctoring active — Face must be visible
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { overflow-x: hidden; }
            `}</style>
        </div>
    );
}

export default function ExamPage() {
    return (
        <Suspense fallback={
            <div style={{
                minHeight: '100vh', background: '#08060f',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: 40, height: 40, border: '3px solid #D4A843', borderTopColor: 'transparent',
                        borderRadius: '50%', margin: '0 auto 16px',
                        animation: 'spin 1s linear infinite',
                    }} />
                    <p style={{ color: '#64748b', fontSize: 14, fontFamily: "'Space Grotesk', sans-serif" }}>
                        Loading exam...
                    </p>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        }>
            <ExamContent />
        </Suspense>
    );
}

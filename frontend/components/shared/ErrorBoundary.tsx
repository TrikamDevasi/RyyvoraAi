'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div style={{ 
                    padding: 40, 
                    textAlign: 'center', 
                    background: 'rgba(212,168,67,0.02)',
                    border: '1px solid rgba(212,168,67,0.1)',
                    borderRadius: 16,
                    margin: 20
                }}>
                    <h2 className="font-display" style={{ color: '#fff', fontSize: 20, marginBottom: 12 }}>Something went wrong</h2>
                    <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 20 }}>
                        The AI module encountered a temporary hiccup.
                    </p>
                    <button 
                        onClick={() => this.setState({ hasError: false })}
                        className="btn-primary"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

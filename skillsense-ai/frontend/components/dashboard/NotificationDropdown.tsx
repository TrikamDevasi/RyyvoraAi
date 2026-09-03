'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bell, Check, CheckCheck, Award, Brain, Shield, Sparkles, ExternalLink, X } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  unread: boolean;
  href: string;
  type: 'passport' | 'ai' | 'compliance';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Skill Passport Cryptographically Signed',
    description: 'SHA-256 verified ledger record is active with NSQF Level 5 certification.',
    timestamp: '10m ago',
    unread: true,
    href: '/student/passport',
    type: 'passport',
  },
  {
    id: 'n2',
    title: 'AI Competency Analysis Ready',
    description: 'Market grounding report updated with +15% Cloud Architecture recommendations.',
    timestamp: '1h ago',
    unread: true,
    href: '/student/analyzer',
    type: 'ai',
  },
  {
    id: 'n3',
    title: 'Algorithmic Fairness Audit Passed',
    description: '4/5ths parity standard satisfied across all cohort demographic buckets.',
    timestamp: '3h ago',
    unread: true,
    href: '/admin/fairness',
    type: 'compliance',
  },
];

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Handle outside click to dismiss
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const displayedNotifications =
    activeTab === 'unread'
      ? notifications.filter((n) => n.unread)
      : notifications;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'passport':
        return <Award size={15} style={{ color: 'var(--gold)' }} />;
      case 'ai':
        return <Brain size={15} style={{ color: '#60a5fa' }} />;
      case 'compliance':
        return <Shield size={15} style={{ color: '#34d399' }} />;
      default:
        return <Sparkles size={15} style={{ color: 'var(--gold)' }} />;
    }
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications (${unreadCount} unread)`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="Notifications"
        className="icon-btn-hover"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 38,
          height: 38,
          borderRadius: 10,
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border)',
          color: unreadCount > 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
          cursor: 'pointer',
          position: 'relative',
        }}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: 7,
              right: 7,
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: 'var(--gold)',
              boxShadow: '0 0 6px rgba(245, 158, 11, 0.7)',
            }}
          />
        )}
      </button>

      {/* Floating Notification Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Notifications Panel"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: 360,
            maxWidth: 'calc(100vw - 32px)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            boxShadow: 'var(--shadow-lg)',
            zIndex: 1000,
            overflow: 'hidden',
            animation: 'dropdownFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-surface-elevated)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                Notifications
              </span>
              {unreadCount > 0 && (
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 800,
                    padding: '1px 6px',
                    borderRadius: 99,
                    background: 'var(--gold-muted)',
                    color: 'var(--gold)',
                    border: '1px solid var(--gold-border)',
                  }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '2px 6px',
                  borderRadius: 4,
                }}
              >
                <CheckCheck size={13} />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div
            style={{
              display: 'flex',
              padding: '6px 12px',
              borderBottom: '1px solid var(--border)',
              gap: 6,
              background: 'var(--bg-surface)',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              style={{
                fontSize: 11.5,
                fontWeight: activeTab === 'all' ? 700 : 500,
                padding: '4px 10px',
                borderRadius: 6,
                background: activeTab === 'all' ? 'var(--bg-surface-elevated)' : 'transparent',
                color: activeTab === 'all' ? 'var(--text-primary)' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('unread')}
              style={{
                fontSize: 11.5,
                fontWeight: activeTab === 'unread' ? 700 : 500,
                padding: '4px 10px',
                borderRadius: 6,
                background: activeTab === 'unread' ? 'var(--bg-surface-elevated)' : 'transparent',
                color: activeTab === 'unread' ? 'var(--text-primary)' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* List */}
          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {displayedNotifications.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12.5 }}>
                <Check size={24} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                No unread notifications
              </div>
            ) : (
              displayedNotifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.href}
                  onClick={() => {
                    markAsRead(n.id);
                    setIsOpen(false);
                  }}
                  className="menu-item-hover"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border-subtle)',
                    background: n.unread ? 'var(--gold-muted)' : 'transparent',
                    textDecoration: 'none',
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {getIcon(n.type)}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 6 }}>
                      <div
                        style={{
                          fontSize: 12.5,
                          fontWeight: n.unread ? 700 : 600,
                          color: 'var(--text-primary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {n.title}
                      </div>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', flexShrink: 0 }}>
                        {n.timestamp}
                      </span>
                    </div>

                    <p
                      style={{
                        fontSize: 11.5,
                        color: 'var(--text-secondary)',
                        margin: '3px 0 0',
                        lineHeight: 1.4,
                      }}
                    >
                      {n.description}
                    </p>
                  </div>

                  {n.unread && (
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'var(--gold)',
                        flexShrink: 0,
                        marginTop: 6,
                      }}
                    />
                  )}
                </Link>
              ))
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '8px 16px',
              borderTop: '1px solid var(--border)',
              textAlign: 'center',
              background: 'var(--bg-surface-elevated)',
            }}
          >
            <Link
              href="/ai-health"
              onClick={() => setIsOpen(false)}
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: 'var(--gold)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span>View System Telemetry & Health</span>
              <ExternalLink size={11} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

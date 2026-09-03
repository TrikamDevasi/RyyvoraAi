'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getMobileNavigationItems, RouteItem } from '@/config/navigation';

interface MobileBottomNavProps {
  onOpenMore: () => void;
  isMoreOpen: boolean;
}

export default function MobileBottomNav({ onOpenMore, isMoreOpen }: MobileBottomNavProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const role = (user?.role || 'student').toLowerCase();

  const primaryRoutes: RouteItem[] = getMobileNavigationItems(role);

  const isRouteActive = (href: string) => {
    // Root role paths require exact match so they don't falsely stay active on sub-features
    if (
      href === '/student' ||
      href === '/institute' ||
      href === '/industry' ||
      href === '/employer' ||
      href === '/government' ||
      href === '/admin'
    ) {
      return pathname === href;
    }
    // Nested child routes keep parent active
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Check if current route is not one of the 4 primary items (meaning it's in the secondary/more set)
  const isSecondaryActive =
    !primaryRoutes.some((item) => isRouteActive(item.href)) &&
    (isMoreOpen ||
      pathname === '/student/profile' ||
      pathname === '/settings/billing' ||
      pathname === '/student/consent' ||
      pathname.includes('/jobs') ||
      pathname.includes('/leaderboard') ||
      pathname.includes('/submissions') ||
      pathname.includes('/passport') ||
      pathname.includes('/market') ||
      pathname.includes('/assessment'));

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 45,
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border)',
        boxShadow: '0 -4px 18px -2px rgba(0, 0, 0, 0.12)',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          height: 64,
          padding: '0 4px',
          maxWidth: 600,
          margin: '0 auto',
        }}
      >
        {primaryRoutes.map((item) => {
          const Icon = item.icon;
          const active = isRouteActive(item.href);
          const label = item.mobileLabel || item.shortLabel || item.label;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              className="mobile-nav-item"
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                height: '100%',
                minHeight: 48,
                textDecoration: 'none',
                color: active ? 'var(--gold)' : 'var(--text-muted)',
                position: 'relative',
              }}
            >
              {/* Active subtle pill / indicator */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 44,
                  height: 30,
                  borderRadius: 12,
                  background: active ? 'var(--gold-muted)' : 'transparent',
                  border: active ? '1px solid var(--gold-border)' : '1px solid transparent',
                  transition: 'all 0.18s ease',
                }}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.4 : 1.8}
                  style={{
                    color: active ? 'var(--gold)' : 'currentColor',
                    transition: 'transform 0.18s ease',
                    transform: active ? 'scale(1.06)' : 'scale(1)',
                  }}
                />
              </div>

              {/* Label */}
              <span
                style={{
                  fontSize: 11,
                  fontWeight: active ? 700 : 500,
                  lineHeight: 1.1,
                  letterSpacing: '-0.01em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: 64,
                  textAlign: 'center',
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}

        {/* 5th Navigation Item: "More" Action */}
        <button
          type="button"
          onClick={onOpenMore}
          aria-label="Open more navigation"
          aria-haspopup="dialog"
          aria-expanded={isMoreOpen}
          className="mobile-nav-item"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            height: '100%',
            minHeight: 48,
            background: 'transparent',
            border: 'none',
            color: isMoreOpen || isSecondaryActive ? 'var(--gold)' : 'var(--text-muted)',
            cursor: 'pointer',
            padding: 0,
            position: 'relative',
          }}
        >
          {/* Subtle Pill for More */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 30,
              borderRadius: 12,
              background: isMoreOpen || isSecondaryActive ? 'var(--gold-muted)' : 'transparent',
              border: isMoreOpen || isSecondaryActive ? '1px solid var(--gold-border)' : '1px solid transparent',
              transition: 'all 0.18s ease',
            }}
          >
            <Menu
              size={20}
              strokeWidth={isMoreOpen || isSecondaryActive ? 2.4 : 1.8}
              style={{
                color: isMoreOpen || isSecondaryActive ? 'var(--gold)' : 'currentColor',
                transition: 'transform 0.15s ease',
                transform: isMoreOpen ? 'rotate(90deg)' : 'scale(1)',
              }}
            />
          </div>

          <span
            style={{
              fontSize: 11,
              fontWeight: isMoreOpen || isSecondaryActive ? 700 : 500,
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 64,
              textAlign: 'center',
            }}
          >
            More
          </span>
        </button>
      </div>
    </nav>
  );
}

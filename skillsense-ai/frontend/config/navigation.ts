// frontend/config/navigation.ts
import {
  LayoutDashboard,
  Brain,
  Award,
  CheckSquare,
  Compass,
  FileCode,
  Briefcase,
  TrendingUp,
  Trophy,
  User,
  Newspaper,
  Building,
  Landmark,
  Shield,
  Activity,
  BarChart3,
  Users,
  Layers,
  Sparkles,
  Milestone,
  Lock,
  CreditCard,
  FileCheck2,
  PieChart,
  HelpCircle,
  FileSpreadsheet,
} from 'lucide-react';
import React from 'react';

export interface RouteItem {
  label: string;
  shortLabel?: string;
  mobileLabel?: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  description?: string;
}

export interface NavGroup {
  group: string;
  routes: RouteItem[];
}

export const NAVIGATION_CONFIG: Record<string, NavGroup[]> = {
  // ── 1. STUDENT / TRAINEE ROLE ─────────────────────────────────────────────
  student: [
    {
      group: 'Overview',
      routes: [
        { label: 'Dashboard', shortLabel: 'Dashboard', mobileLabel: 'Home', href: '/student', icon: LayoutDashboard },
        { label: 'Employment Journey', shortLabel: 'Employment', mobileLabel: 'Journey', href: '/student/journey', icon: Milestone, badge: 'TIMELINE' },
      ],
    },
    {
      group: 'Intelligence & Skills',
      routes: [
        { label: 'AI Skill Analyzer', shortLabel: 'AI Tools', mobileLabel: 'AI', href: '/student/analyzer', icon: Brain, badge: 'AI' },
        { label: 'Career Predictor', shortLabel: 'Career', mobileLabel: 'Career', href: '/student/career', icon: Compass },
        { label: 'Market Demand', shortLabel: 'Market', mobileLabel: 'Market', href: '/student/market', icon: TrendingUp },
      ],
    },
    {
      group: 'Assessments & Credentials',
      routes: [
        { label: 'Evaluations & Tests', shortLabel: 'Evaluations', mobileLabel: 'Tests', href: '/student/assessment', icon: CheckSquare },
        { label: 'Project Submissions', shortLabel: 'Submissions', mobileLabel: 'Projects', href: '/student/submissions', icon: FileSpreadsheet },
        { label: 'Skill Passport', shortLabel: 'Passport', mobileLabel: 'Passport', href: '/student/passport', icon: Award, badge: 'VERIFIED' },
      ],
    },
    {
      group: 'Opportunities & Community',
      routes: [
        { label: 'Job Matches', href: '/student/jobs', icon: Briefcase, badge: 'NEW' },
        { label: 'Leaderboard', href: '/student/leaderboard', icon: Trophy },
      ],
    },
    {
      group: 'Account & Trust',
      routes: [
        { label: 'DPDP Consent & Privacy', href: '/student/consent', icon: Lock, badge: 'DPDP' },
        { label: 'Profile & Settings', mobileLabel: 'Profile', href: '/student/profile', icon: User },
      ],
    },
  ],

  // ── 2. TRAINING PROVIDER / INSTITUTE ROLE ─────────────────────────────────
  institute: [
    {
      group: 'Overview',
      routes: [
        { label: 'Institutional Cockpit', shortLabel: 'Cockpit', mobileLabel: 'Home', href: '/institute', icon: LayoutDashboard },
      ],
    },
    {
      group: 'Students & Training',
      routes: [
        { label: 'Student Roster', shortLabel: 'Students', mobileLabel: 'Trainees', href: '/institute/students', icon: Users },
        { label: 'Upload Batch Cohort', href: '/institute/upload', icon: FileCode, badge: 'BATCH' },
        { label: 'Competency Evaluations', shortLabel: 'Evaluations', mobileLabel: 'Assess', href: '/institute/evaluations', icon: Brain },
      ],
    },
    {
      group: 'Outcomes & ROI',
      routes: [
        { label: 'Placement Tracker', shortLabel: 'Placement', mobileLabel: 'Placements', href: '/institute/placement', icon: TrendingUp },
        { label: 'Curriculum & ROI', href: '/institute/roi', icon: BarChart3, badge: 'FINANCIAL' },
      ],
    },
    {
      group: 'Account & Quotas',
      routes: [
        { label: 'Institute Profile', href: '/institute/profile', icon: User },
        { label: 'Billing & Quotas', href: '/settings/billing', icon: CreditCard },
      ],
    },
  ],

  // ── 3. EMPLOYER / INDUSTRY ROLE ──────────────────────────────────────────
  employer: [
    {
      group: 'Overview',
      routes: [
        { label: 'Employer Dashboard', shortLabel: 'Dashboard', mobileLabel: 'Home', href: '/employer', icon: LayoutDashboard },
      ],
    },
    {
      group: 'Verification & Outcomes',
      routes: [
        { label: 'Candidate Validations', shortLabel: 'Validations', mobileLabel: 'Validations', href: '/employer/validations', icon: Award, badge: 'LEDGER' },
        { label: 'Hired Placements', shortLabel: 'Placements', mobileLabel: 'Placements', href: '/employer/placements', icon: Briefcase },
        { label: 'Performance Feedback', href: '/employer/feedback', icon: FileCheck2 },
      ],
    },
    {
      group: 'Talent Acquisition',
      routes: [
        { label: 'Verified Talent Pool', shortLabel: 'Talent', mobileLabel: 'Talent', href: '/industry/talent', icon: Users, badge: 'VERIFIED' },
        { label: 'Campus Connect', href: '/industry/campus', icon: Building },
      ],
    },
    {
      group: 'Account & Plan',
      routes: [
        { label: 'Company Profile', href: '/employer/profile', icon: User },
        { label: 'Subscription & Tier', href: '/settings/billing', icon: CreditCard },
      ],
    },
  ],

  industry: [
    {
      group: 'Overview',
      routes: [
        { label: 'Sector Intelligence Cockpit', shortLabel: 'Cockpit', mobileLabel: 'Home', href: '/industry', icon: LayoutDashboard },
      ],
    },
    {
      group: 'Workforce & Standards',
      routes: [
        { label: 'Market Demand & NOS', shortLabel: 'Demand', mobileLabel: 'Demand', href: '/industry/demand', icon: TrendingUp },
        { label: 'Industry & Sector News', href: '/industry/news', icon: Newspaper },
      ],
    },
    {
      group: 'Talent & Institution Network',
      routes: [
        { label: 'Verified Candidate Pool', shortLabel: 'Candidates', mobileLabel: 'Candidates', href: '/industry/talent', icon: Users, badge: 'VERIFIED' },
        { label: 'Campus Drives Network', shortLabel: 'Campus', mobileLabel: 'Campus', href: '/industry/campus', icon: Building },
      ],
    },
    {
      group: 'Council Governance',
      routes: [
        { label: 'Sector Council Profile', href: '/industry/profile', icon: User },
        { label: 'Enterprise Access', href: '/settings/billing', icon: CreditCard },
      ],
    },
  ],

  // ── 4. GOVERNMENT / POLICY ROLE ──────────────────────────────────────────
  government: [
    {
      group: 'Overview',
      routes: [
        { label: 'State Macro Dashboard', shortLabel: 'Dashboard', mobileLabel: 'Home', href: '/government', icon: Landmark, badge: 'LIVE' },
      ],
    },
    {
      group: 'Analytics & Regions',
      routes: [
        { label: 'Regional Heatmap', shortLabel: 'Heatmap', mobileLabel: 'Heatmap', href: '/government/heatmap', icon: BarChart3 },
        { label: 'Fund Targeting', shortLabel: 'Targeting', mobileLabel: 'Targeting', href: '/government/fund-targeting', icon: TrendingUp, badge: 'BUDGET' },
      ],
    },
    {
      group: 'Compliance & Governance',
      routes: [
        { label: 'NSQF Compliance', shortLabel: 'Compliance', mobileLabel: 'Compliance', href: '/government/compliance', icon: Shield },
        { label: 'Policy Intelligence', href: '/government/news', icon: Newspaper },
      ],
    },
    {
      group: 'Auditing & System Reports',
      routes: [
        { label: 'Algorithmic Fairness', href: '/admin/fairness', icon: Shield, badge: '4/5th' },
        { label: 'System Reports', href: '/admin/reports', icon: BarChart3 },
      ],
    },
    {
      group: 'Account & Security',
      routes: [
        { label: 'Directorate Profile', href: '/government/profile', icon: User },
        { label: 'DPDP Security & Trust', href: '/student/consent', icon: Lock },
      ],
    },
  ],

  // ── 5. SYSTEM ADMIN ROLE ─────────────────────────────────────────────────
  admin: [
    {
      group: 'Overview',
      routes: [
        { label: 'System Overview', shortLabel: 'Overview', mobileLabel: 'Home', href: '/admin', icon: LayoutDashboard },
      ],
    },
    {
      group: 'Management & Directory',
      routes: [
        { label: 'User Directory', shortLabel: 'Users', mobileLabel: 'Users', href: '/admin/users', icon: Users },
        { label: 'Institute Registry', shortLabel: 'Institutes', mobileLabel: 'Institutes', href: '/admin/institutes', icon: Building },
      ],
    },
    {
      group: 'Auditing & Governance',
      routes: [
        { label: 'Platform Reports', shortLabel: 'Reports', mobileLabel: 'Reports', href: '/admin/reports', icon: BarChart3 },
        { label: 'Algorithmic Fairness', href: '/admin/fairness', icon: Shield, badge: '4/5th' },
        { label: 'System Audit Logs', href: '/admin/audit-logs', icon: Activity },
      ],
    },
    {
      group: 'Account & Billing',
      routes: [
        { label: 'Administrator Profile', href: '/admin/profile', icon: User },
        { label: 'Platform Billing Engine', href: '/settings/billing', icon: CreditCard },
      ],
    },
  ],
};

/**
 * Returns exactly 4 primary mobile bottom navigation destinations for a given role.
 * Guaranteed to return 4 canonical, authenticated routes adhering to RBAC.
 */
export function getMobileNavigationItems(role?: string): RouteItem[] {
  const normalizedRole = (role || 'student').toLowerCase();
  const groups = NAVIGATION_CONFIG[normalizedRole] || NAVIGATION_CONFIG.student;
  const allRoutes = groups.flatMap((g) => g.routes);

  // Preferred primary mobile routes per role for optimal mobile workflows
  const preferredHrefs: Record<string, string[]> = {
    student: ['/student', '/student/journey', '/student/analyzer', '/student/career'],
    employer: ['/employer', '/employer/validations', '/employer/placements', '/industry/talent'],
    institute: ['/institute', '/institute/students', '/institute/evaluations', '/institute/placement'],
    industry: ['/industry', '/industry/talent', '/industry/campus', '/industry/demand'],
    government: ['/government', '/government/heatmap', '/government/fund-targeting', '/government/compliance'],
    admin: ['/admin', '/admin/users', '/admin/institutes', '/admin/reports'],
  };

  const targetHrefs = preferredHrefs[normalizedRole];
  if (targetHrefs) {
    const matchedRoutes: RouteItem[] = [];
    for (const href of targetHrefs) {
      const found = allRoutes.find((r) => r.href === href);
      if (found) matchedRoutes.push(found);
    }
    if (matchedRoutes.length === 4) {
      return matchedRoutes;
    }
  }

  // Fallback: Pick first 4 non-profile routes
  return allRoutes.filter((r) => r.href !== '/student/profile' && r.href !== '/settings/billing').slice(0, 4);
}

/**
 * Returns secondary navigation groups for the "More" drawer, excluding primary bottom nav routes.
 */
export function getSecondaryNavigationGroups(role?: string, primaryHrefs: string[] = []): NavGroup[] {
  const normalizedRole = (role || 'student').toLowerCase();
  const groups = NAVIGATION_CONFIG[normalizedRole] || NAVIGATION_CONFIG.student;

  return groups
    .map((group) => ({
      group: group.group,
      routes: group.routes.filter((route) => !primaryHrefs.includes(route.href)),
    }))
    .filter((group) => group.routes.length > 0);
}

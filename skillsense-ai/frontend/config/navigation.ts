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
        { label: 'Dashboard', shortLabel: 'Dashboard', href: '/student', icon: LayoutDashboard },
        { label: 'Employment Journey', shortLabel: 'Employment', href: '/student/journey', icon: Milestone, badge: 'TIMELINE' },
      ],
    },
    {
      group: 'Intelligence & Skills',
      routes: [
        { label: 'AI Skill Analyzer', shortLabel: 'AI Analyzer', href: '/student/analyzer', icon: Brain, badge: 'AI' },
        { label: 'Career Predictor', shortLabel: 'Career', href: '/student/career', icon: Compass },
        { label: 'Market Demand', shortLabel: 'Market', href: '/student/market', icon: TrendingUp },
      ],
    },
    {
      group: 'Assessments & Credentials',
      routes: [
        { label: 'Evaluations & Tests', shortLabel: 'Evaluations', href: '/student/assessment', icon: CheckSquare },
        { label: 'Project Submissions', shortLabel: 'Submissions', href: '/student/submissions', icon: FileSpreadsheet },
        { label: 'Skill Passport', shortLabel: 'Passport', href: '/student/passport', icon: Award, badge: 'VERIFIED' },
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
        { label: 'Profile & Settings', href: '/student/profile', icon: User },
      ],
    },
  ],

  // ── 2. TRAINING PROVIDER / INSTITUTE ROLE ─────────────────────────────────
  institute: [
    {
      group: 'Overview',
      routes: [
        { label: 'Institutional Cockpit', href: '/institute', icon: LayoutDashboard },
      ],
    },
    {
      group: 'Students & Training',
      routes: [
        { label: 'Student Roster', href: '/institute/students', icon: Users },
        { label: 'Upload Batch Cohort', href: '/institute/upload', icon: FileCode, badge: 'BATCH' },
        { label: 'AI Evaluations', href: '/institute/evaluations', icon: Brain },
      ],
    },
    {
      group: 'Outcomes & ROI',
      routes: [
        { label: 'Placement Tracker', href: '/institute/placement', icon: TrendingUp },
        { label: 'Curriculum & ROI', href: '/institute/roi', icon: BarChart3, badge: 'FINANCIAL' },
      ],
    },
    {
      group: 'Account & Billing',
      routes: [
        { label: 'Institute Profile', href: '/student/profile', icon: User },
        { label: 'Billing & Quotas', href: '/settings/billing', icon: CreditCard },
      ],
    },
  ],

  // ── 3. EMPLOYER / INDUSTRY ROLE ──────────────────────────────────────────
  employer: [
    {
      group: 'Overview',
      routes: [
        { label: 'Employer Dashboard', href: '/employer', icon: LayoutDashboard },
      ],
    },
    {
      group: 'Verification & Outcomes',
      routes: [
        { label: 'Candidate Validations', href: '/employer/validations', icon: Award, badge: 'LEDGER' },
        { label: 'Hired Placements', href: '/employer/placements', icon: Briefcase },
        { label: 'Feedback & Claims', href: '/employer/feedback', icon: FileCheck2 },
      ],
    },
    {
      group: 'Talent & Campus',
      routes: [
        { label: 'Verified Talent Pool', href: '/industry/talent', icon: Users, badge: 'VERIFIED' },
        { label: 'Campus Connect', href: '/industry/campus', icon: Building },
        { label: 'Market Demand', href: '/industry/demand', icon: TrendingUp },
        { label: 'Hiring News', href: '/industry/news', icon: Newspaper },
      ],
    },
    {
      group: 'Account & Billing',
      routes: [
        { label: 'Company Profile', href: '/student/profile', icon: User },
        { label: 'Subscription & Tier', href: '/settings/billing', icon: CreditCard },
      ],
    },
  ],

  industry: [
    {
      group: 'Overview',
      routes: [
        { label: 'Industry Cockpit', href: '/industry', icon: LayoutDashboard },
      ],
    },
    {
      group: 'Talent & Campus',
      routes: [
        { label: 'Verified Candidates', href: '/industry/talent', icon: Users, badge: 'VERIFIED' },
        { label: 'Campus Drives', href: '/industry/campus', icon: Building },
        { label: 'Market Demand', href: '/industry/demand', icon: TrendingUp },
        { label: 'Industry News', href: '/industry/news', icon: Newspaper },
      ],
    },
    {
      group: 'Verification & Placements',
      routes: [
        { label: 'Candidate Validations', href: '/employer/validations', icon: Award },
        { label: 'Placements Tracker', href: '/employer/placements', icon: Briefcase },
      ],
    },
    {
      group: 'Account & Billing',
      routes: [
        { label: 'Organization Profile', href: '/student/profile', icon: User },
        { label: 'Enterprise Billing', href: '/settings/billing', icon: CreditCard },
      ],
    },
  ],

  // ── 4. GOVERNMENT / POLICY ROLE ──────────────────────────────────────────
  government: [
    {
      group: 'Overview',
      routes: [
        { label: 'State Macro Dashboard', href: '/government', icon: Landmark, badge: 'LIVE' },
      ],
    },
    {
      group: 'Analytics & Regions',
      routes: [
        { label: 'Regional Heatmap', href: '/government/heatmap', icon: BarChart3 },
        { label: 'Fund Targeting', href: '/government/fund-targeting', icon: TrendingUp, badge: 'BUDGET' },
      ],
    },
    {
      group: 'Compliance & Governance',
      routes: [
        { label: 'NSQF Compliance', href: '/government/compliance', icon: Shield },
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
        { label: 'Official Profile', href: '/student/profile', icon: User },
        { label: 'DPDP Security & Trust', href: '/student/consent', icon: Lock },
      ],
    },
  ],

  // ── 5. SYSTEM ADMIN ROLE ─────────────────────────────────────────────────
  admin: [
    {
      group: 'Overview',
      routes: [
        { label: 'System Overview', href: '/admin', icon: LayoutDashboard },
      ],
    },
    {
      group: 'Management & Directory',
      routes: [
        { label: 'User Directory', href: '/admin/users', icon: Users },
        { label: 'Institute Registry', href: '/admin/institutes', icon: Building },
      ],
    },
    {
      group: 'Auditing & Governance',
      routes: [
        { label: 'Algorithmic Fairness', href: '/admin/fairness', icon: Shield, badge: '4/5th' },
        { label: 'System Audit Logs', href: '/admin/audit-logs', icon: Activity },
        { label: 'Platform Reports', href: '/admin/reports', icon: BarChart3 },
      ],
    },
    {
      group: 'Account & Billing',
      routes: [
        { label: 'Administrator Profile', href: '/student/profile', icon: User },
        { label: 'Platform Billing Engine', href: '/settings/billing', icon: CreditCard },
      ],
    },
  ],
};

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
} from 'lucide-react';
import React from 'react';

export interface RouteItem {
  label: string;
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
  student: [
    {
      group: 'Longitudinal Journey & Outcomes',
      routes: [
        { label: 'Overview', href: '/student', icon: LayoutDashboard },
        { label: 'Employment Journey', href: '/student/journey', icon: Milestone, badge: 'TIMELINE' },
        { label: 'Skill Passport', href: '/student/passport', icon: Award, badge: 'VERIFIED' },
        { label: 'Consent & Privacy', href: '/student/consent', icon: Lock, badge: 'DPDP' },
      ],
    },
    {
      group: 'Intelligence & Skills',
      routes: [
        { label: 'AI Skill Analyzer', href: '/student/analyzer', icon: Brain, badge: 'AI' },
        { label: 'Evaluations & Tests', href: '/student/assessment', icon: CheckSquare },
        { label: 'Career Predictor', href: '/student/career', icon: Compass },
        { label: 'Market Demand', href: '/student/market', icon: TrendingUp },
      ],
    },
    {
      group: 'Community & Profile',
      routes: [
        { label: 'Find Jobs', href: '/student/jobs', icon: Briefcase, badge: 'NEW' },
        { label: 'Leaderboard', href: '/student/leaderboard', icon: Trophy },
        { label: 'Profile & Settings', href: '/student/profile', icon: User },
      ],
    },
  ],

  institute: [
    {
      group: 'Institutional Cockpit',
      routes: [
        { label: 'Dashboard', href: '/institute', icon: LayoutDashboard },
        { label: 'Student Roster', href: '/institute/students', icon: Users },
        { label: 'Placement & Outcomes', href: '/institute/placement', icon: TrendingUp },
        { label: 'Upload Cohort', href: '/institute/upload', icon: FileCode, badge: 'BATCH' },
        { label: 'Curriculum & ROI', href: '/institute/roi', icon: BarChart3 },
        { label: 'AI Evaluations', href: '/institute/evaluations', icon: Brain },
      ],
    },
  ],

  industry: [
    {
      group: 'Enterprise Talent Pool',
      routes: [
        { label: 'Talent Dashboard', href: '/industry', icon: LayoutDashboard },
        { label: 'Verified Candidates', href: '/industry/talent', icon: Users, badge: 'VERIFIED' },
        { label: 'Campus Drives', href: '/industry/campus', icon: Building },
        { label: 'Market Demand', href: '/industry/demand', icon: TrendingUp },
        { label: 'Hiring News', href: '/industry/news', icon: Newspaper },
      ],
    },
  ],

  government: [
    {
      group: 'State Workforce Intelligence (Maharashtra)',
      routes: [
        { label: 'State Macro Dashboard', href: '/government', icon: Landmark, badge: 'LIVE' },
        { label: 'Regional Heatmap', href: '/government/heatmap', icon: BarChart3 },
        { label: 'NSQF Compliance', href: '/government/compliance', icon: Shield },
        { label: 'Fund Targeting', href: '/government/fund-targeting', icon: TrendingUp },
        { label: 'Policy News', href: '/government/news', icon: Newspaper },
      ],
    },
  ],

  employer: [
    {
      group: 'Employer Verification Portal',
      routes: [
        { label: 'Overview', href: '/employer', icon: LayoutDashboard },
        { label: 'Candidate Validations', href: '/employer/validations', icon: Award, badge: 'LEDGER' },
        { label: 'Placements', href: '/employer/placements', icon: Briefcase },
        { label: 'Feedback & Demand', href: '/employer/feedback', icon: CheckSquare },
      ],
    },
  ],

  admin: [
    {
      group: 'System Governance',
      routes: [
        { label: 'Admin Overview', href: '/admin', icon: LayoutDashboard },
        { label: 'User Directory', href: '/admin/users', icon: Users },
        { label: 'Fairness Engine', href: '/admin/fairness', icon: Shield, badge: '4/5th' },
        { label: 'Audit Logs', href: '/admin/audit-logs', icon: Activity },
        { label: 'Institutes', href: '/admin/institutes', icon: Building },
        { label: 'System Reports', href: '/admin/reports', icon: BarChart3 },
      ],
    },
  ],
};


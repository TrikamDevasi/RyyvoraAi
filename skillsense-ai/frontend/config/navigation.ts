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
      group: 'Intelligence & Skills',
      routes: [
        { label: 'Overview', href: '/student', icon: LayoutDashboard },
        { label: 'AI Skill Analyzer', href: '/student/analyzer', icon: Brain, badge: 'AI' },
        { label: 'Skill Passport', href: '/student/passport', icon: Award, badge: 'VERIFIED' },
        { label: 'Evaluations & Tests', href: '/student/assessment', icon: CheckSquare },
      ],
    },
    {
      group: 'Career & Growth',
      routes: [
        { label: 'Career Predictor', href: '/student/career', icon: Compass },
        { label: 'Market Demand', href: '/student/market', icon: TrendingUp },
        { label: 'Find Jobs', href: '/student/jobs', icon: Briefcase, badge: 'NEW' },
        { label: 'My Submissions', href: '/student/submissions', icon: FileCode },
      ],
    },
    {
      group: 'Community & Profile',
      routes: [
        { label: 'Leaderboard', href: '/student/leaderboard', icon: Trophy },
        { label: 'Profile & Settings', href: '/student/profile', icon: User },
        { label: 'Tech News', href: '/student/news', icon: Newspaper },
      ],
    },
  ],

  institute: [
    {
      group: 'Institutional Cockpit',
      routes: [
        { label: 'Dashboard', href: '/institute', icon: LayoutDashboard },
        { label: 'Student Roster', href: '/institute/students', icon: Users },
        { label: 'Curriculum & ROI', href: '/institute/roi', icon: BarChart3 },
        { label: 'Placement Trends', href: '/institute/placement', icon: TrendingUp },
        { label: 'Upload Cohort', href: '/institute/upload', icon: FileCode },
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
      group: 'National Workforce Intelligence',
      routes: [
        { label: 'Macro Dashboard', href: '/government', icon: Landmark },
        { label: 'Regional Heatmap', href: '/government/heatmap', icon: BarChart3 },
        { label: 'NSQF Compliance', href: '/government/compliance', icon: Shield },
        { label: 'Fund Targeting', href: '/government/fund-targeting', icon: TrendingUp },
        { label: 'Policy News', href: '/government/news', icon: Newspaper },
      ],
    },
  ],

  employer: [
    {
      group: 'Employer Portal',
      routes: [
        { label: 'Overview', href: '/employer', icon: LayoutDashboard },
        { label: 'Placements', href: '/employer/placements', icon: Briefcase },
        { label: 'Feedback', href: '/employer/feedback', icon: CheckSquare },
        { label: 'Validations', href: '/employer/validations', icon: Award },
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

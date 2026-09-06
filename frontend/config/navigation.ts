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
      group: 'Core Workspace',
      routes: [
        { label: 'Dashboard', shortLabel: 'Dashboard', mobileLabel: 'Home', href: '/student', icon: LayoutDashboard, description: 'Overview of your skill readiness and next actions' },
        { label: 'Employment Journey', shortLabel: 'Journey', mobileLabel: 'Journey', href: '/student/journey', icon: Milestone, badge: 'CAREER', description: 'Track milestones from training to job retention' },
        { label: 'Assessments & Tests', shortLabel: 'Tests', mobileLabel: 'Tests', href: '/student/assessment', icon: CheckSquare, badge: 'EVAL', description: 'NSQF competency evaluations & quizzes' },
        { label: 'AI Skill Gap Analyzer', shortLabel: 'Skill Gap', mobileLabel: 'Skills', href: '/student/analyzer', icon: Brain, badge: 'AI', description: 'Personalized skill deficit roadmap' },
        { label: 'Career Pathways', shortLabel: 'Careers', mobileLabel: 'Career', href: '/student/career', icon: Compass, description: 'Workforce alignment & salary projections' },
        { label: 'Skill Passport', shortLabel: 'Passport', mobileLabel: 'Passport', href: '/student/passport', icon: Award, badge: 'VERIFIED', description: 'Tamper-proof digital credentials' },
      ],
    },
    {
      group: 'Opportunities & Market',
      routes: [
        { label: 'Job Matches', shortLabel: 'Jobs', href: '/student/jobs', icon: Briefcase, badge: 'NEW', description: 'Open positions aligned to your skills' },
        { label: 'Market Hiring Demand', shortLabel: 'Market', href: '/student/market', icon: TrendingUp, description: 'Live industry demand across Indian sectors' },
        { label: 'Student Leaderboard', shortLabel: 'Ranks', href: '/student/leaderboard', icon: Trophy, description: 'Skill badges and cohort rankings' },
      ],
    },
    {
      group: 'Account & Trust',
      routes: [
        { label: 'Profile & Settings', mobileLabel: 'Profile', href: '/student/profile', icon: User, description: 'Personal details and vocational trade' },
        { label: 'DPDP Privacy & Consent', href: '/student/consent', icon: Lock, badge: 'DPDP', description: 'Manage your data privacy rights' },
      ],
    },
  ],

  // ── 2. TRAINING PROVIDER / INSTITUTE ROLE ─────────────────────────────────
  institute: [
    {
      group: 'Overview',
      routes: [
        { label: 'Institutional Cockpit', shortLabel: 'Cockpit', mobileLabel: 'Home', href: '/institute', icon: LayoutDashboard, description: 'Cohort training progress and placement ROI' },
      ],
    },
    {
      group: 'Students & Training',
      routes: [
        { label: 'Student Roster', shortLabel: 'Students', mobileLabel: 'Trainees', href: '/institute/students', icon: Users, description: 'Trainee records and academic milestones' },
        { label: 'Upload Batch Cohort', href: '/institute/upload', icon: FileCode, badge: 'BATCH', description: 'Bulk CSV trainee enrollment' },
        { label: 'Competency Evaluations', shortLabel: 'Evaluations', mobileLabel: 'Assess', href: '/institute/evaluations', icon: Brain, description: 'Diagnostic test completion & marks' },
      ],
    },
    {
      group: 'Outcomes & ROI',
      routes: [
        { label: 'Placement Tracker', shortLabel: 'Placement', mobileLabel: 'Placements', href: '/institute/placement', icon: TrendingUp, description: 'Track verified job placements' },
        { label: 'Curriculum & ROI', href: '/institute/roi', icon: BarChart3, badge: 'FINANCIAL', description: 'Department salary multiplier analysis' },
      ],
    },
    {
      group: 'Account & Plan',
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
        { label: 'Employer Dashboard', shortLabel: 'Dashboard', mobileLabel: 'Home', href: '/employer', icon: LayoutDashboard, description: 'Recruitment velocity and candidate validations' },
      ],
    },
    {
      group: 'Verification & Outcomes',
      routes: [
        { label: 'Verify Credentials', shortLabel: 'Validations', mobileLabel: 'Validations', href: '/employer/validations', icon: Award, badge: 'VERIFIED', description: 'Instant Skill Passport ledger verification' },
        { label: 'Hired Placements', shortLabel: 'Placements', mobileLabel: 'Placements', href: '/employer/placements', icon: Briefcase, description: 'Candidate offers and campus drives' },
        { label: 'Performance Feedback', href: '/employer/feedback', icon: FileCheck2, description: 'Post-hire retention surveys' },
      ],
    },
    {
      group: 'Talent Acquisition',
      routes: [
        { label: 'Verified Talent Pool', shortLabel: 'Talent', mobileLabel: 'Talent', href: '/industry/talent', icon: Users, badge: 'ASSESSED', description: 'Pre-screened vocational candidates' },
        { label: 'Campus Connect', href: '/industry/campus', icon: Building, description: 'Partner with technical institutes' },
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
        { label: 'Sector Intelligence Cockpit', shortLabel: 'Cockpit', mobileLabel: 'Home', href: '/industry', icon: LayoutDashboard, description: 'Macro industry skill demand and talent shortages' },
      ],
    },
    {
      group: 'Workforce & Standards',
      routes: [
        { label: 'Industry Demand & NOS', shortLabel: 'Demand', mobileLabel: 'Demand', href: '/industry/demand', icon: TrendingUp, description: 'National Occupational Standards talent deficits' },
        { label: 'Sector News & Briefings', href: '/industry/news', icon: Newspaper, description: 'Vocational council intelligence' },
      ],
    },
    {
      group: 'Talent & Institution Network',
      routes: [
        { label: 'Verified Candidate Pool', shortLabel: 'Candidates', mobileLabel: 'Candidates', href: '/industry/talent', icon: Users, badge: 'VERIFIED', description: 'Pre-evaluated vocational graduates' },
        { label: 'Campus Drives Network', shortLabel: 'Campus', mobileLabel: 'Campus', href: '/industry/campus', icon: Building, description: 'Institutional drive coordination' },
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
        { label: 'State Outcome Cockpit', shortLabel: 'Dashboard', mobileLabel: 'Home', href: '/government', icon: Landmark, badge: 'LIVE', description: 'Macro view of state employment and retention' },
      ],
    },
    {
      group: 'Analytics & Regions',
      routes: [
        { label: 'Regional Outcome Heatmap', shortLabel: 'Heatmap', mobileLabel: 'Heatmap', href: '/government/heatmap', icon: BarChart3, description: 'District performance & cluster mapping' },
        { label: 'Training Fund Allocation', shortLabel: 'Funding', mobileLabel: 'Funding', href: '/government/fund-targeting', icon: TrendingUp, badge: 'BUDGET', description: 'Target funds where outcomes are highest' },
      ],
    },
    {
      group: 'Compliance & Governance',
      routes: [
        { label: 'NSQF & State Compliance', shortLabel: 'Compliance', mobileLabel: 'Compliance', href: '/government/compliance', icon: Shield, description: 'Vocational standard compliance monitoring' },
        { label: 'Policy Intelligence', href: '/government/news', icon: Newspaper, description: 'State labor and skill council briefings' },
      ],
    },
    {
      group: 'Auditing & System Reports',
      routes: [
        { label: 'Fairness & Non-Bias Audit', href: '/admin/fairness', icon: Shield, badge: '4/5th', description: 'Algorithmic demographic parity verification' },
        { label: 'State System Reports', href: '/admin/reports', icon: BarChart3, description: 'Downloadable outcome dossiers' },
      ],
    },
    {
      group: 'Account & Trust',
      routes: [
        { label: 'Directorate Profile', href: '/government/profile', icon: User },
        { label: 'DPDP Security & Trust', href: '/student/consent', icon: Lock, description: 'Data protection compliance status' },
      ],
    },
  ],

  // ── 5. SYSTEM ADMIN ROLE ─────────────────────────────────────────────────
  admin: [
    {
      group: 'Overview',
      routes: [
        { label: 'System Overview', shortLabel: 'Overview', mobileLabel: 'Home', href: '/admin', icon: LayoutDashboard, description: 'Platform health and operational telemetry' },
      ],
    },
    {
      group: 'Management & Directory',
      routes: [
        { label: 'User Directory', shortLabel: 'Users', mobileLabel: 'Users', href: '/admin/users', icon: Users, description: 'Manage accounts and role permissions' },
        { label: 'Institute Registry', shortLabel: 'Institutes', mobileLabel: 'Institutes', href: '/admin/institutes', icon: Building, description: 'Accredited institution credentials' },
      ],
    },
    {
      group: 'Auditing & Governance',
      routes: [
        { label: 'Platform Reports', shortLabel: 'Reports', mobileLabel: 'Reports', href: '/admin/reports', icon: BarChart3, description: 'Audit-ready system compliance exports' },
        { label: 'Fairness & Non-Bias Audit', href: '/admin/fairness', icon: Shield, badge: '4/5th', description: 'Disparate impact & bias evaluation' },
        { label: 'System Audit Logs', href: '/admin/audit-logs', icon: Activity, description: 'Immutable ledger access records' },
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
    student: ['/student', '/student/journey', '/student/assessment', '/student/career'],
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

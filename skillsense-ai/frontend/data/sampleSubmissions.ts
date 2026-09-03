/**
 * OFFLINE DEVELOPMENT TEST FIXTURE ONLY
 * Note: Production evaluations and submissions query live backend Assessment records via `/api/institutes/:id/evaluations`.
 * This static dataset is retained strictly as an offline reference fixture and is not imported in active routes.
 */

export interface AssignmentSubmission {
    id: string;
    studentId: string;
    studentName: string;
    title: string;
    course: string;
    submittedAt: string;
    status: 'submitted' | 'under-review' | 'graded' | 'resubmit';
    score?: number;
    maxScore: number;
    feedback?: string;
    fileUrl?: string;
    skills: string[];
}

export interface ProjectEvaluation {
    id: string;
    studentId: string;
    studentName: string;
    projectTitle: string;
    description: string;
    technology: string[];
    submittedAt: string;
    status: 'pending' | 'evaluated' | 'revision';
    score?: number;
    maxScore: number;
    evaluatorName?: string;
    feedback?: string;
    repoUrl?: string;
    demoUrl?: string;
}

export interface PracticalExamScore {
    id: string;
    studentId: string;
    studentName: string;
    examTitle: string;
    skillTested: string;
    conductedOn: string;
    score: number;
    maxScore: number;
    grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';
    evaluator: string;
    remarks?: string;
}

export interface EmployerFeedbackEntry {
    id: string;
    studentId: string;
    studentName: string;
    employerName: string;
    companyName: string;
    role: string;
    period: string;
    rating: number;        // 1-5
    technicalScore: number; // 0-100
    softSkillScore: number; // 0-100
    recommendation: 'hire' | 'consider' | 'not-recommended';
    strengths: string[];
    improvements: string[];
    comments?: string;
    submittedAt: string;
}

export interface SkillAssessmentResult {
    id: string;
    studentId: string;
    studentName: string;
    assessmentTitle: string;
    skill: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    score: number;
    maxScore: number;
    percentile: number;
    completedAt: string;
    duration: number; // minutes
    badge?: string;
}

/* ─── Sample Assignment Submissions ─── */
export const sampleAssignments: AssignmentSubmission[] = [
    {
        id: 'ASG001', studentId: 'STU001', studentName: 'Arjun Mehta',
        title: 'React E-Commerce Dashboard', course: 'Full-Stack Development',
        submittedAt: '2026-03-10T14:30:00', status: 'graded', score: 88, maxScore: 100,
        feedback: 'Excellent component architecture and state management.',
        skills: ['React.js', 'TypeScript', 'REST APIs'],
    },
    {
        id: 'ASG002', studentId: 'STU002', studentName: 'Priya Sharma',
        title: 'ML Classification Pipeline', course: 'Data Science & Analytics',
        submittedAt: '2026-03-08T10:15:00', status: 'graded', score: 92, maxScore: 100,
        feedback: 'Strong feature engineering. Consider adding cross-validation.',
        skills: ['Python', 'Machine Learning', 'Statistics'],
    },
    {
        id: 'ASG003', studentId: 'STU003', studentName: 'Ravi Kumar',
        title: 'Kubernetes Cluster Setup', course: 'Cloud & DevOps Engineering',
        submittedAt: '2026-03-12T09:00:00', status: 'under-review', maxScore: 100,
        skills: ['Docker & Kubernetes', 'CI/CD Pipelines', 'Linux Administration'],
    },
    {
        id: 'ASG004', studentId: 'STU004', studentName: 'Anjali Verma',
        title: 'Design System Component Library', course: 'UI/UX Design & Frontend',
        submittedAt: '2026-03-11T16:45:00', status: 'graded', score: 95, maxScore: 100,
        feedback: 'Outstanding attention to detail and accessible components.',
        skills: ['Figma & Design Tools', 'HTML/CSS', 'Responsive Design'],
    },
    {
        id: 'ASG005', studentId: 'STU008', studentName: 'Sunita Yadav',
        title: 'NLP Sentiment Analyzer', course: 'AI & Machine Learning',
        submittedAt: '2026-03-13T11:20:00', status: 'submitted', maxScore: 100,
        skills: ['Python', 'NLP', 'TensorFlow/PyTorch'],
    },
    {
        id: 'ASG006', studentId: 'STU009', studentName: 'Rahul Bose',
        title: 'GraphQL API with Real-Time Subscriptions', course: 'Full-Stack Development',
        submittedAt: '2026-03-09T08:30:00', status: 'graded', score: 81, maxScore: 100,
        feedback: 'Good implementation. Optimize resolver performance.',
        skills: ['Next.js', 'GraphQL', 'Express.js'],
    },
    {
        id: 'ASG007', studentId: 'STU005', studentName: 'Suresh Patel',
        title: 'Microservices with Event Sourcing', course: 'Backend Development',
        submittedAt: '2026-03-07T13:00:00', status: 'resubmit', score: 55, maxScore: 100,
        feedback: 'Missing error handling and retry logic. Please resubmit.',
        skills: ['Java', 'Spring Boot', 'Microservices'],
    },
    {
        id: 'ASG008', studentId: 'STU010', studentName: 'Kavita Reddy',
        title: 'Automated E2E Test Suite', course: 'Software Testing & QA',
        submittedAt: '2026-03-14T07:45:00', status: 'submitted', maxScore: 100,
        skills: ['Selenium', 'Test Automation', 'API Testing'],
    },
];

/* ─── Sample Project Evaluations ─── */
export const sampleProjects: ProjectEvaluation[] = [
    {
        id: 'PRJ001', studentId: 'STU001', studentName: 'Arjun Mehta',
        projectTitle: 'FinTrack — Personal Finance Manager',
        description: 'Full-stack budgeting app with expense analytics and AI insights.',
        technology: ['React.js', 'Node.js', 'MongoDB', 'Chart.js'],
        submittedAt: '2026-02-28T10:00:00', status: 'evaluated', score: 90, maxScore: 100,
        evaluatorName: 'Dr. Rajan Shah', feedback: 'Impressive architecture. Clean codebase.',
        repoUrl: 'https://github.com/arjun/fintrack',
    },
    {
        id: 'PRJ002', studentId: 'STU002', studentName: 'Priya Sharma',
        projectTitle: 'MediPredict — Disease Prediction System',
        description: 'ML-based disease prediction from patient symptoms using ensemble models.',
        technology: ['Python', 'Scikit-learn', 'Flask', 'Pandas'],
        submittedAt: '2026-03-01T14:00:00', status: 'evaluated', score: 94, maxScore: 100,
        evaluatorName: 'Prof. Meera Iyer', feedback: 'Exceptional model accuracy and documentation.',
        repoUrl: 'https://github.com/priya/medipredict',
    },
    {
        id: 'PRJ003', studentId: 'STU004', studentName: 'Anjali Verma',
        projectTitle: 'Artisan — Design Token Manager',
        description: 'Tool for managing design tokens across Figma and codebase.',
        technology: ['React.js', 'TypeScript', 'Figma API'],
        submittedAt: '2026-03-05T09:30:00', status: 'evaluated', score: 91, maxScore: 100,
        evaluatorName: 'Ms. Neha Khatri', feedback: 'Innovative approach to design-dev handoff.',
        repoUrl: 'https://github.com/anjali/artisan',
    },
    {
        id: 'PRJ004', studentId: 'STU009', studentName: 'Rahul Bose',
        projectTitle: 'DevBoard — Developer Dashboard',
        description: 'Real-time developer productivity dashboard with GitHub integration.',
        technology: ['Next.js', 'GraphQL', 'PostgreSQL', 'Redis'],
        submittedAt: '2026-03-10T11:00:00', status: 'pending', maxScore: 100,
        repoUrl: 'https://github.com/rahul/devboard',
    },
    {
        id: 'PRJ005', studentId: 'STU007', studentName: 'Deepak Singh',
        projectTitle: 'SecureVault — Password Manager',
        description: 'End-to-end encrypted password manager with biometric auth.',
        technology: ['React Native', 'Node.js', 'AES-256', 'Biometric APIs'],
        submittedAt: '2026-03-02T08:00:00', status: 'revision', score: 68, maxScore: 100,
        evaluatorName: 'Dr. Vikram Rao', feedback: 'Encryption is solid but needs better UX and testing.',
        repoUrl: 'https://github.com/deepak/securevault',
    },
];

/* ─── Sample Practical Exam Scores ─── */
export const samplePracticalExams: PracticalExamScore[] = [
    { id: 'PEX001', studentId: 'STU001', studentName: 'Arjun Mehta', examTitle: 'Live Coding Challenge', skillTested: 'React.js', conductedOn: '2026-02-15', score: 85, maxScore: 100, grade: 'A', evaluator: 'Dr. Rajan Shah', remarks: 'Clean code under pressure.' },
    { id: 'PEX002', studentId: 'STU002', studentName: 'Priya Sharma', examTitle: 'Data Analysis Practicum', skillTested: 'Python', conductedOn: '2026-02-18', score: 92, maxScore: 100, grade: 'A+', evaluator: 'Prof. Meera Iyer' },
    { id: 'PEX003', studentId: 'STU003', studentName: 'Ravi Kumar', examTitle: 'Cloud Deployment Lab', skillTested: 'AWS Services', conductedOn: '2026-02-20', score: 78, maxScore: 100, grade: 'B+', evaluator: 'Mr. Sanjay Gupta', remarks: 'Good setup, missed monitoring.' },
    { id: 'PEX004', studentId: 'STU004', studentName: 'Anjali Verma', examTitle: 'UI Design Sprint', skillTested: 'Figma & Design Tools', conductedOn: '2026-02-22', score: 96, maxScore: 100, grade: 'A+', evaluator: 'Ms. Neha Khatri' },
    { id: 'PEX005', studentId: 'STU005', studentName: 'Suresh Patel', examTitle: 'API Design Workshop', skillTested: 'Spring Boot', conductedOn: '2026-02-25', score: 72, maxScore: 100, grade: 'B', evaluator: 'Dr. Anand Tiwari', remarks: 'Needs stronger error handling.' },
    { id: 'PEX006', studentId: 'STU008', studentName: 'Sunita Yadav', examTitle: 'ML Model Evaluation', skillTested: 'TensorFlow/PyTorch', conductedOn: '2026-03-01', score: 89, maxScore: 100, grade: 'A', evaluator: 'Prof. Meera Iyer' },
    { id: 'PEX007', studentId: 'STU010', studentName: 'Kavita Reddy', examTitle: 'Automation Testing Challenge', skillTested: 'Selenium', conductedOn: '2026-03-05', score: 88, maxScore: 100, grade: 'A', evaluator: 'Ms. Pooja Nair' },
    { id: 'PEX008', studentId: 'STU015', studentName: 'Sanjay Pillai', examTitle: 'System Design Interview Sim', skillTested: 'System Design', conductedOn: '2026-03-08', score: 82, maxScore: 100, grade: 'A', evaluator: 'Dr. Rajan Shah' },
];

/* ─── Sample Employer Feedback ─── */
export const sampleEmployerFeedback: EmployerFeedbackEntry[] = [
    {
        id: 'EFB001', studentId: 'STU001', studentName: 'Arjun Mehta',
        employerName: 'Ravi Desai', companyName: 'Infosys', role: 'Software Developer Intern',
        period: 'Jun 2025 – Aug 2025', rating: 4, technicalScore: 82, softSkillScore: 78,
        recommendation: 'hire', strengths: ['Problem Solving', 'Team Work', 'Quick Learner'],
        improvements: ['Time Management'], comments: 'Would love to have him full-time.',
        submittedAt: '2026-01-15T10:00:00',
    },
    {
        id: 'EFB002', studentId: 'STU002', studentName: 'Priya Sharma',
        employerName: 'Anita Nair', companyName: 'TCS', role: 'Data Analyst Intern',
        period: 'Jul 2025 – Sep 2025', rating: 5, technicalScore: 90, softSkillScore: 85,
        recommendation: 'hire', strengths: ['Analytical Thinking', 'Data Visualization', 'Communication'],
        improvements: ['Public Speaking'], comments: 'Exceptional analytical capabilities.',
        submittedAt: '2026-01-20T14:00:00',
    },
    {
        id: 'EFB003', studentId: 'STU005', studentName: 'Suresh Patel',
        employerName: 'Manoj KR', companyName: 'HCL Technologies', role: 'Backend Dev Intern',
        period: 'Aug 2025 – Oct 2025', rating: 3, technicalScore: 70, softSkillScore: 65,
        recommendation: 'consider', strengths: ['Java Knowledge', 'Database Design'],
        improvements: ['Code Quality', 'Documentation', 'Testing'],
        comments: 'Needs more practice with production standards.',
        submittedAt: '2026-02-01T09:00:00',
    },
    {
        id: 'EFB004', studentId: 'STU004', studentName: 'Anjali Verma',
        employerName: 'Sneha Gupta', companyName: 'Flipkart', role: 'UI/UX Design Intern',
        period: 'May 2025 – Jul 2025', rating: 5, technicalScore: 94, softSkillScore: 90,
        recommendation: 'hire', strengths: ['Design Thinking', 'Prototyping', 'User Research'],
        improvements: ['Front-end Animation'], comments: 'Outstanding designer, highly recommended.',
        submittedAt: '2026-01-25T11:00:00',
    },
    {
        id: 'EFB005', studentId: 'STU009', studentName: 'Rahul Bose',
        employerName: 'Amit Joshi', companyName: 'Freshworks', role: 'Full-Stack Dev Intern',
        period: 'Jun 2025 – Aug 2025', rating: 4, technicalScore: 85, softSkillScore: 80,
        recommendation: 'hire', strengths: ['Full-Stack Skills', 'Problem Solving', 'Initiative'],
        improvements: ['Performance Optimization'],
        comments: 'Great addition to the team.',
        submittedAt: '2026-02-10T13:00:00',
    },
];

/* ─── Sample Skill Assessment Results ─── */
export const sampleSkillAssessments: SkillAssessmentResult[] = [
    { id: 'SKA001', studentId: 'STU001', studentName: 'Arjun Mehta', assessmentTitle: 'React.js Proficiency Test', skill: 'React.js', level: 'advanced', score: 88, maxScore: 100, percentile: 85, completedAt: '2026-03-01T10:00:00', duration: 45, badge: 'React Master' },
    { id: 'SKA002', studentId: 'STU001', studentName: 'Arjun Mehta', assessmentTitle: 'Node.js Backend Assessment', skill: 'Node.js', level: 'intermediate', score: 74, maxScore: 100, percentile: 68, completedAt: '2026-03-03T14:00:00', duration: 60 },
    { id: 'SKA003', studentId: 'STU002', studentName: 'Priya Sharma', assessmentTitle: 'Python Data Science', skill: 'Python', level: 'advanced', score: 91, maxScore: 100, percentile: 92, completedAt: '2026-03-02T09:00:00', duration: 50, badge: 'Python Expert' },
    { id: 'SKA004', studentId: 'STU002', studentName: 'Priya Sharma', assessmentTitle: 'ML Fundamentals', skill: 'Machine Learning', level: 'advanced', score: 87, maxScore: 100, percentile: 88, completedAt: '2026-03-05T11:00:00', duration: 55, badge: 'ML Specialist' },
    { id: 'SKA005', studentId: 'STU004', studentName: 'Anjali Verma', assessmentTitle: 'UI Design Mastery', skill: 'Figma & Design Tools', level: 'expert', score: 96, maxScore: 100, percentile: 98, completedAt: '2026-03-04T10:00:00', duration: 40, badge: 'Design Virtuoso' },
    { id: 'SKA006', studentId: 'STU003', studentName: 'Ravi Kumar', assessmentTitle: 'AWS Cloud Practitioner', skill: 'AWS Services', level: 'intermediate', score: 72, maxScore: 100, percentile: 60, completedAt: '2026-03-06T15:00:00', duration: 65 },
    { id: 'SKA007', studentId: 'STU007', studentName: 'Deepak Singh', assessmentTitle: 'Network Security Basics', skill: 'Network Security', level: 'advanced', score: 80, maxScore: 100, percentile: 75, completedAt: '2026-03-07T08:00:00', duration: 50, badge: 'SecOps Analyst' },
    { id: 'SKA008', studentId: 'STU010', studentName: 'Kavita Reddy', assessmentTitle: 'Selenium Automation', skill: 'Selenium', level: 'expert', score: 93, maxScore: 100, percentile: 95, completedAt: '2026-03-08T12:00:00', duration: 35, badge: 'QA Champion' },
    { id: 'SKA009', studentId: 'STU008', studentName: 'Sunita Yadav', assessmentTitle: 'Deep Learning Assessment', skill: 'TensorFlow/PyTorch', level: 'advanced', score: 85, maxScore: 100, percentile: 82, completedAt: '2026-03-09T10:00:00', duration: 60 },
    { id: 'SKA010', studentId: 'STU015', studentName: 'Sanjay Pillai', assessmentTitle: 'TypeScript Mastery', skill: 'TypeScript', level: 'intermediate', score: 76, maxScore: 100, percentile: 65, completedAt: '2026-03-10T14:00:00', duration: 45 },
];

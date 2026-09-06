/**
 * OFFLINE DEVELOPMENT TEST FIXTURE ONLY
 * Note: Production dashboard pages query live longitudinal MongoDB collections via `/api/employers` and `/api/verification`.
 * This static dataset is retained strictly as an offline reference fixture and is not imported in active routes.
 */

export interface Employer {
    id: string;
    companyName: string;
    industry: string;
    contactPerson: string;
    email: string;
    phone: string;
    location: string;
    partnerSince: string;
    openPositions: number;
    studentsHired: number;
    avgRating: number;
    status: 'active' | 'inactive';
    verifiedSkills: number;
}

export interface InternshipFeedback {
    id: string;
    employerId: string;
    companyName: string;
    studentId: string;
    studentName: string;
    role: string;
    department: string;
    startDate: string;
    endDate: string;
    status: 'ongoing' | 'completed' | 'terminated';
    overallRating: number;
    technicalRating: number;
    communicationRating: number;
    teamworkRating: number;
    punctualityRating: number;
    supervisorName: string;
    strengths: string[];
    areasOfImprovement: string[];
    wouldHire: boolean;
    feedback: string;
    submittedAt: string;
}

export interface PlacementRecord {
    id: string;
    studentId: string;
    studentName: string;
    employerId: string;
    companyName: string;
    role: string;
    department: string;
    joiningDate: string;
    salary: number;
    location: string;
    type: 'full-time' | 'contract' | 'part-time';
    source: 'campus-drive' | 'referral' | 'direct-application' | 'off-campus';
    status: 'active' | 'probation' | 'resigned' | 'confirmed';
    verifiedAt?: string;
}

export interface SkillValidationLog {
    id: string;
    employerId: string;
    companyName: string;
    studentId: string;
    studentName: string;
    skill: string;
    claimedLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    validatedLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    isVerified: boolean;
    verifiedAt: string;
    verifierName: string;
    notes?: string;
    method: 'interview' | 'project-review' | 'practical-test' | 'reference-check';
}

/* ─── Sample Employers ─── */
export const sampleEmployers: Employer[] = [
    { id: 'EMP001', companyName: 'Infosys', industry: 'IT Services', contactPerson: 'Ravi Desai', email: 'ravi.desai@infosys.com', phone: '+91 98765 43210', location: 'Bangalore', partnerSince: '2023-01-15', openPositions: 12, studentsHired: 8, avgRating: 4.2, status: 'active', verifiedSkills: 34 },
    { id: 'EMP002', companyName: 'TCS', industry: 'IT Services', contactPerson: 'Anita Nair', email: 'anita.nair@tcs.com', phone: '+91 98765 43211', location: 'Mumbai', partnerSince: '2022-06-01', openPositions: 20, studentsHired: 15, avgRating: 4.5, status: 'active', verifiedSkills: 52 },
    { id: 'EMP003', companyName: 'Flipkart', industry: 'E-Commerce', contactPerson: 'Sneha Gupta', email: 'sneha@flipkart.com', phone: '+91 98765 43212', location: 'Bangalore', partnerSince: '2023-03-20', openPositions: 8, studentsHired: 5, avgRating: 4.7, status: 'active', verifiedSkills: 28 },
    { id: 'EMP004', companyName: 'HCL Technologies', industry: 'IT Services', contactPerson: 'Manoj KR', email: 'manoj.kr@hcl.com', phone: '+91 98765 43213', location: 'Noida', partnerSince: '2023-08-10', openPositions: 15, studentsHired: 6, avgRating: 3.8, status: 'active', verifiedSkills: 22 },
    { id: 'EMP005', companyName: 'Freshworks', industry: 'SaaS', contactPerson: 'Amit Joshi', email: 'amit@freshworks.com', phone: '+91 98765 43214', location: 'Chennai', partnerSince: '2024-01-05', openPositions: 6, studentsHired: 3, avgRating: 4.6, status: 'active', verifiedSkills: 18 },
    { id: 'EMP006', companyName: 'Razorpay', industry: 'FinTech', contactPerson: 'Karan Mehta', email: 'karan@razorpay.com', phone: '+91 98765 43215', location: 'Bangalore', partnerSince: '2024-04-12', openPositions: 4, studentsHired: 2, avgRating: 4.8, status: 'active', verifiedSkills: 14 },
    { id: 'EMP007', companyName: 'Zoho', industry: 'SaaS', contactPerson: 'Priya Patel', email: 'priya@zoho.com', phone: '+91 98765 43216', location: 'Chennai', partnerSince: '2023-11-01', openPositions: 10, studentsHired: 7, avgRating: 4.3, status: 'active', verifiedSkills: 30 },
    { id: 'EMP008', companyName: 'Tech Mahindra', industry: 'IT Services', contactPerson: 'Suresh Rao', email: 'suresh@techmahindra.com', phone: '+91 98765 43217', location: 'Pune', partnerSince: '2024-02-20', openPositions: 9, studentsHired: 4, avgRating: 3.9, status: 'inactive', verifiedSkills: 16 },
];

/* ─── Sample Internship Feedback ─── */
export const sampleInternshipFeedback: InternshipFeedback[] = [
    {
        id: 'IFB001', employerId: 'EMP001', companyName: 'Infosys', studentId: 'STU001', studentName: 'Arjun Mehta',
        role: 'Software Developer Intern', department: 'Digital Experience',
        startDate: '2025-06-01', endDate: '2025-08-31', status: 'completed',
        overallRating: 4, technicalRating: 4, communicationRating: 4, teamworkRating: 5, punctualityRating: 4,
        supervisorName: 'Ravi Desai', strengths: ['React.js', 'Problem Solving', 'Team Collaboration'],
        areasOfImprovement: ['Time Management', 'Documentation'], wouldHire: true,
        feedback: 'Arjun demonstrated strong technical skills and was a valuable team member. He quickly adapted to our tech stack and delivered quality code consistently.',
        submittedAt: '2025-09-05T10:00:00',
    },
    {
        id: 'IFB002', employerId: 'EMP002', companyName: 'TCS', studentId: 'STU002', studentName: 'Priya Sharma',
        role: 'Data Analyst Intern', department: 'Analytics Centre of Excellence',
        startDate: '2025-07-01', endDate: '2025-09-30', status: 'completed',
        overallRating: 5, technicalRating: 5, communicationRating: 4, teamworkRating: 5, punctualityRating: 5,
        supervisorName: 'Anita Nair', strengths: ['Python', 'Data Visualization', 'Statistical Analysis', 'Communication'],
        areasOfImprovement: ['Public Speaking'], wouldHire: true,
        feedback: 'Priya is one of the best interns we have had. Her analytical capabilities and proactive approach were exceptional.',
        submittedAt: '2025-10-10T14:00:00',
    },
    {
        id: 'IFB003', employerId: 'EMP003', companyName: 'Flipkart', studentId: 'STU004', studentName: 'Anjali Verma',
        role: 'UI/UX Design Intern', department: 'Product Design',
        startDate: '2025-05-15', endDate: '2025-07-31', status: 'completed',
        overallRating: 5, technicalRating: 5, communicationRating: 5, teamworkRating: 4, punctualityRating: 5,
        supervisorName: 'Sneha Gupta', strengths: ['Design Thinking', 'Prototyping', 'User Research', 'Figma'],
        areasOfImprovement: ['Front-end Animations'], wouldHire: true,
        feedback: 'Anjali brought incredible creativity and attention to detail. Her designs significantly improved our checkout flow.',
        submittedAt: '2025-08-05T11:00:00',
    },
    {
        id: 'IFB004', employerId: 'EMP004', companyName: 'HCL Technologies', studentId: 'STU005', studentName: 'Suresh Patel',
        role: 'Backend Developer Intern', department: 'Enterprise Services',
        startDate: '2025-08-01', endDate: '2025-10-31', status: 'completed',
        overallRating: 3, technicalRating: 3, communicationRating: 3, teamworkRating: 4, punctualityRating: 3,
        supervisorName: 'Manoj KR', strengths: ['Java', 'Database Design'],
        areasOfImprovement: ['Code Quality', 'Documentation', 'Testing', 'Performance Optimization'], wouldHire: false,
        feedback: 'Suresh has potential but needs more practice with production-grade development practices.',
        submittedAt: '2025-11-08T09:00:00',
    },
    {
        id: 'IFB005', employerId: 'EMP005', companyName: 'Freshworks', studentId: 'STU009', studentName: 'Rahul Bose',
        role: 'Full-Stack Developer Intern', department: 'Product Engineering',
        startDate: '2025-06-15', endDate: '2025-08-31', status: 'completed',
        overallRating: 4, technicalRating: 4, communicationRating: 4, teamworkRating: 4, punctualityRating: 5,
        supervisorName: 'Amit Joshi', strengths: ['Next.js', 'GraphQL', 'Initiative', 'Problem Solving'],
        areasOfImprovement: ['Performance Optimization'], wouldHire: true,
        feedback: 'Rahul is a proactive developer with strong full-stack skills. He contributed meaningfully to our product.',
        submittedAt: '2025-09-15T13:00:00',
    },
    {
        id: 'IFB006', employerId: 'EMP006', companyName: 'Razorpay', studentId: 'STU015', studentName: 'Sanjay Pillai',
        role: 'Software Engineer Intern', department: 'Payment Gateway',
        startDate: '2025-07-01', endDate: '2025-09-30', status: 'completed',
        overallRating: 4, technicalRating: 5, communicationRating: 3, teamworkRating: 4, punctualityRating: 4,
        supervisorName: 'Karan Mehta', strengths: ['Node.js', 'TypeScript', 'CI/CD', 'System Design'],
        areasOfImprovement: ['Communication', 'Documentation'], wouldHire: true,
        feedback: 'Technically excellent engineer with strong problem-solving skills.',
        submittedAt: '2025-10-05T10:00:00',
    },
];

/* ─── Sample Placement Records ─── */
export const samplePlacementRecords: PlacementRecord[] = [
    { id: 'PLR001', studentId: 'STU001', studentName: 'Arjun Mehta', employerId: 'EMP001', companyName: 'Infosys', role: 'Software Developer', department: 'Digital Experience', joiningDate: '2025-09-15', salary: 45000, location: 'Bangalore', type: 'full-time', source: 'campus-drive', status: 'confirmed' },
    { id: 'PLR002', studentId: 'STU002', studentName: 'Priya Sharma', employerId: 'EMP002', companyName: 'TCS', role: 'Data Analyst', department: 'Analytics', joiningDate: '2025-10-01', salary: 50000, location: 'Mumbai', type: 'full-time', source: 'campus-drive', status: 'confirmed' },
    { id: 'PLR003', studentId: 'STU003', studentName: 'Ravi Kumar', employerId: 'EMP004', companyName: 'Wipro', role: 'Cloud Engineer', department: 'Cloud Services', joiningDate: '2025-11-01', salary: 42000, location: 'Hyderabad', type: 'full-time', source: 'referral', status: 'confirmed' },
    { id: 'PLR004', studentId: 'STU004', studentName: 'Anjali Verma', employerId: 'EMP003', companyName: 'Flipkart', role: 'UI/UX Designer', department: 'Product Design', joiningDate: '2025-08-15', salary: 55000, location: 'Bangalore', type: 'full-time', source: 'campus-drive', status: 'confirmed' },
    { id: 'PLR005', studentId: 'STU005', studentName: 'Suresh Patel', employerId: 'EMP004', companyName: 'HCL Technologies', role: 'Backend Developer', department: 'Enterprise', joiningDate: '2025-11-15', salary: 40000, location: 'Noida', type: 'full-time', source: 'direct-application', status: 'probation' },
    { id: 'PLR006', studentId: 'STU009', studentName: 'Rahul Bose', employerId: 'EMP005', companyName: 'Freshworks', role: 'Full-Stack Developer', department: 'Product', joiningDate: '2025-09-20', salary: 52000, location: 'Chennai', type: 'full-time', source: 'campus-drive', status: 'confirmed' },
    { id: 'PLR007', studentId: 'STU007', studentName: 'Deepak Singh', employerId: 'EMP008', companyName: 'Quick Heal', role: 'Security Analyst', department: 'SecOps', joiningDate: '2025-10-10', salary: 48000, location: 'Pune', type: 'full-time', source: 'off-campus', status: 'confirmed' },
    { id: 'PLR008', studentId: 'STU015', studentName: 'Sanjay Pillai', employerId: 'EMP006', companyName: 'Razorpay', role: 'Software Engineer', department: 'Payments', joiningDate: '2025-10-15', salary: 58000, location: 'Bangalore', type: 'full-time', source: 'campus-drive', status: 'confirmed' },
    { id: 'PLR009', studentId: 'STU010', studentName: 'Kavita Reddy', employerId: 'EMP007', companyName: 'Cognizant', role: 'QA Engineer', department: 'Quality', joiningDate: '2025-09-01', salary: 38000, location: 'Hyderabad', type: 'full-time', source: 'campus-drive', status: 'active' },
    { id: 'PLR010', studentId: 'STU012', studentName: 'Lalita Kumari', employerId: 'EMP007', companyName: 'Zoho', role: 'Frontend Developer', department: 'Product', joiningDate: '2025-11-01', salary: 42000, location: 'Chennai', type: 'full-time', source: 'referral', status: 'probation' },
    { id: 'PLR011', studentId: 'STU017', studentName: 'Manoj Tiwari', employerId: 'EMP008', companyName: 'Tech Mahindra', role: 'SOC Analyst', department: 'Cybersecurity', joiningDate: '2025-12-01', salary: 40000, location: 'Pune', type: 'full-time', source: 'direct-application', status: 'confirmed' },
    { id: 'PLR012', studentId: 'STU019', studentName: 'Kiran Gowda', employerId: 'EMP006', companyName: 'Google India', role: 'Software Engineer', department: 'Cloud', joiningDate: '2025-08-01', salary: 120000, location: 'Bangalore', type: 'full-time', source: 'off-campus', status: 'confirmed' },
];

/* ─── Sample Skill Validation Logs ─── */
export const sampleSkillValidations: SkillValidationLog[] = [
    { id: 'SVL001', employerId: 'EMP001', companyName: 'Infosys', studentId: 'STU001', studentName: 'Arjun Mehta', skill: 'React.js', claimedLevel: 'advanced', validatedLevel: 'advanced', isVerified: true, verifiedAt: '2025-09-20', verifierName: 'Ravi Desai', method: 'project-review' },
    { id: 'SVL002', employerId: 'EMP001', companyName: 'Infosys', studentId: 'STU001', studentName: 'Arjun Mehta', skill: 'Node.js', claimedLevel: 'advanced', validatedLevel: 'intermediate', isVerified: true, verifiedAt: '2025-09-20', verifierName: 'Ravi Desai', method: 'interview', notes: 'Competent but not advanced-level yet.' },
    { id: 'SVL003', employerId: 'EMP002', companyName: 'TCS', studentId: 'STU002', studentName: 'Priya Sharma', skill: 'Python', claimedLevel: 'advanced', validatedLevel: 'advanced', isVerified: true, verifiedAt: '2025-10-15', verifierName: 'Anita Nair', method: 'practical-test' },
    { id: 'SVL004', employerId: 'EMP002', companyName: 'TCS', studentId: 'STU002', studentName: 'Priya Sharma', skill: 'Machine Learning', claimedLevel: 'advanced', validatedLevel: 'advanced', isVerified: true, verifiedAt: '2025-10-15', verifierName: 'Anita Nair', method: 'project-review' },
    { id: 'SVL005', employerId: 'EMP003', companyName: 'Flipkart', studentId: 'STU004', studentName: 'Anjali Verma', skill: 'Figma & Design Tools', claimedLevel: 'expert', validatedLevel: 'expert', isVerified: true, verifiedAt: '2025-08-10', verifierName: 'Sneha Gupta', method: 'project-review' },
    { id: 'SVL006', employerId: 'EMP003', companyName: 'Flipkart', studentId: 'STU004', studentName: 'Anjali Verma', skill: 'User Research', claimedLevel: 'advanced', validatedLevel: 'advanced', isVerified: true, verifiedAt: '2025-08-10', verifierName: 'Sneha Gupta', method: 'interview' },
    { id: 'SVL007', employerId: 'EMP004', companyName: 'HCL Technologies', studentId: 'STU005', studentName: 'Suresh Patel', skill: 'Java', claimedLevel: 'advanced', validatedLevel: 'intermediate', isVerified: true, verifiedAt: '2025-11-15', verifierName: 'Manoj KR', method: 'practical-test', notes: 'Solid fundamentals but needs more production experience.' },
    { id: 'SVL008', employerId: 'EMP005', companyName: 'Freshworks', studentId: 'STU009', studentName: 'Rahul Bose', skill: 'Next.js', claimedLevel: 'advanced', validatedLevel: 'advanced', isVerified: true, verifiedAt: '2025-09-25', verifierName: 'Amit Joshi', method: 'project-review' },
    { id: 'SVL009', employerId: 'EMP006', companyName: 'Razorpay', studentId: 'STU015', studentName: 'Sanjay Pillai', skill: 'TypeScript', claimedLevel: 'intermediate', validatedLevel: 'advanced', isVerified: true, verifiedAt: '2025-10-10', verifierName: 'Karan Mehta', method: 'practical-test', notes: 'Exceeded expectations — upgraded to advanced.' },
    { id: 'SVL010', employerId: 'EMP006', companyName: 'Razorpay', studentId: 'STU015', studentName: 'Sanjay Pillai', skill: 'CI/CD', claimedLevel: 'advanced', validatedLevel: 'advanced', isVerified: true, verifiedAt: '2025-10-10', verifierName: 'Karan Mehta', method: 'reference-check' },
];

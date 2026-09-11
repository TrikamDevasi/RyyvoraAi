// frontend/lib/domains.ts
/**
 * Ryyvora AI — Centralized Canonical Domain Registry (B.Tech Focus)
 * Single source of truth for all disciplines and engineering branches.
 * Used across: Analyzer, Assessments, Leaderboard, Job Matches, Profile, Filters.
 */

export interface DomainDefinition {
  id: string;
  code: string;
  name: string;
  shortName: string;
  category: 'Computing' | 'Core Engineering' | 'Electronics' | 'Emerging Tech';
  nsqfStandardLevel: number;
  description: string;
  coreKeywords: string[];
  trendingRoles: string[];
  topRecruiters: string[];
}

export const CANONICAL_DOMAINS: DomainDefinition[] = [
  {
    id: 'cse',
    code: 'CSE',
    name: 'Computer Science & Engineering',
    shortName: 'Computer Science',
    category: 'Computing',
    nsqfStandardLevel: 6,
    description: 'Software systems, distributed computing, algorithms, cloud architecture, and full-stack development.',
    coreKeywords: ['React', 'Next.js', 'Node.js', 'Data Structures', 'Distributed Systems', 'PostgreSQL', 'Docker'],
    trendingRoles: ['Full-Stack Systems Engineer', 'Backend Platform Engineer', 'Cloud Architect'],
    topRecruiters: ['TCS Digital', 'Infosys', 'Swiggy', 'Razorpay', 'Microsoft IDC', 'Flipkart'],
  },
  {
    id: 'it',
    code: 'IT',
    name: 'Information Technology',
    shortName: 'Information Tech',
    category: 'Computing',
    nsqfStandardLevel: 6,
    description: 'Enterprise information infrastructure, cybersecurity, cloud operations, and software delivery.',
    coreKeywords: ['DevOps', 'AWS', 'Kubernetes', 'Cybersecurity', 'API Design', 'Linux Administration'],
    trendingRoles: ['DevOps Engineer', 'Security Analyst', 'Cloud Infrastructure Specialist'],
    topRecruiters: ['Cognizant', 'Capgemini', 'Wipro', 'HCLTech', 'Accenture'],
  },
  {
    id: 'aids',
    code: 'AI/DS',
    name: 'Artificial Intelligence & Data Science',
    shortName: 'AI & Data Science',
    category: 'Emerging Tech',
    nsqfStandardLevel: 6,
    description: 'Machine learning platforms, predictive modeling, LLM pipelines, and enterprise data analytics.',
    coreKeywords: ['Python', 'PyTorch', 'FastAPI', 'Vector Databases', 'LangChain', 'Data Pipelines', 'SQL'],
    trendingRoles: ['Applied AI Engineer', 'Data Scientist', 'Machine Learning Platform Engineer'],
    topRecruiters: ['Fractal Analytics', 'Tiger Analytics', 'Amazon IDC', 'Reliance Jio', 'Persistent Systems'],
  },
  {
    id: 'ece',
    code: 'ECE',
    name: 'Electronics & Communication Engineering',
    shortName: 'Electronics & Comm',
    category: 'Electronics',
    nsqfStandardLevel: 6,
    description: 'Embedded firmware, digital signal processing, IoT telemetry, wireless comms, and VLSI design.',
    coreKeywords: ['Embedded C', 'RTOS', 'ARM Cortex', 'VLSI', 'Verilog', 'IoT Protocols', 'MATLAB'],
    trendingRoles: ['Embedded Systems Engineer', 'VLSI Design Verification Engineer', 'Firmware Developer'],
    topRecruiters: ['Texas Instruments', 'Qualcomm', 'Bosch Global', 'Intel India', 'L&T Technology Services'],
  },
  {
    id: 'electrical',
    code: 'EEE',
    name: 'Electrical & Electronics Engineering',
    shortName: 'Electrical Engg',
    category: 'Core Engineering',
    nsqfStandardLevel: 6,
    description: 'Power electronics, smart grid telematics, EV drive systems, automation, and energy systems.',
    coreKeywords: ['Power Electronics', 'PLC/SCADA', 'EV Powertrain', 'MATLAB Simulink', 'Control Systems'],
    trendingRoles: ['EV Systems Engineer', 'Power Electronics Specialist', 'Automation Engineer'],
    topRecruiters: ['Tata Motors EV', 'Schneider Electric', 'ABB India', 'Siemens', 'Mahindra Electric'],
  },
  {
    id: 'mechanical',
    code: 'MECH',
    name: 'Mechanical Engineering',
    shortName: 'Mechanical Engg',
    category: 'Core Engineering',
    nsqfStandardLevel: 5,
    description: 'CAD/CAM product design, FEA structural analysis, precision manufacturing, and thermal robotics.',
    coreKeywords: ['SolidWorks', 'ANSYS FEA', 'AutoCAD', 'Robotics Automation', 'Thermodynamics', 'GD&T'],
    trendingRoles: ['Design & Simulation Engineer', 'Robotics Manufacturing Engineer', 'Thermal Analyst'],
    topRecruiters: ['Larsen & Toubro', 'Tata Technologies', 'Thermax', 'Bharat Forge', 'Maruti Suzuki'],
  },
  {
    id: 'civil',
    code: 'CIVIL',
    name: 'Civil & Infrastructure Engineering',
    shortName: 'Civil Engg',
    category: 'Core Engineering',
    nsqfStandardLevel: 5,
    description: 'Structural engineering, BIM modeling, geotechnics, project management, and sustainable materials.',
    coreKeywords: ['STAAD Pro', 'Revit BIM', 'AutoCAD Civil', 'Structural Design', 'Surveying', 'Geotechnical'],
    trendingRoles: ['BIM Structural Modeler', 'Site Operations Engineer', 'Infrastructure Project Analyst'],
    topRecruiters: ['L&T Construction', 'Tata Projects', 'Shapoorji Pallonji', 'Afcons Infrastructure'],
  },
  {
    id: 'general',
    code: 'GEN',
    name: 'Engineering & Applied Sciences',
    shortName: 'All Engineering',
    category: 'Core Engineering',
    nsqfStandardLevel: 5,
    description: 'Cross-functional engineering foundation, systems thinking, industrial analytics, and quality assurance.',
    coreKeywords: ['Project Management', 'Quality Assurance', 'Applied Mathematics', 'Technical Communications'],
    trendingRoles: ['Technical Project Analyst', 'Operations Trainee', 'Quality Compliance Associate'],
    topRecruiters: ['TCS', 'Infosys', 'Wipro', 'L&T', 'Cognizant'],
  },
];

/**
 * Returns all active domains for selection dropdowns.
 */
export function getAllDomains(): DomainDefinition[] {
  return CANONICAL_DOMAINS;
}

/**
 * Resolves a domain from an input string (matches id, code, or aliases).
 */
export function resolveDomain(input?: string | null): DomainDefinition {
  if (!input) return CANONICAL_DOMAINS[0];
  const normalized = input.trim().toLowerCase();

  const found = CANONICAL_DOMAINS.find(
    (d) =>
      d.id.toLowerCase() === normalized ||
      d.code.toLowerCase() === normalized ||
      d.name.toLowerCase() === normalized ||
      d.shortName.toLowerCase() === normalized ||
      d.name.toLowerCase().includes(normalized) ||
      normalized.includes(d.id.toLowerCase())
  );

  return found || CANONICAL_DOMAINS[0];
}

/**
 * Validates whether a domain string exists in the canonical registry.
 */
export function isValidDomain(domainId: string): boolean {
  return CANONICAL_DOMAINS.some((d) => d.id === domainId.toLowerCase() || d.code.toLowerCase() === domainId.toLowerCase());
}

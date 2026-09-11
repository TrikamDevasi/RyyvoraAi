// backend/src/config/domains.config.ts
/**
 * Ryyvora AI — Backend Canonical Domain Configuration (B.Tech Focus)
 * Authoritative registry matching frontend/lib/domains.ts
 */

export interface DomainMetadata {
  id: string;
  code: string;
  name: string;
  shortName: string;
  category: string;
  nsqfStandardLevel: number;
  coreKeywords: string[];
}

export const CANONICAL_DOMAINS: DomainMetadata[] = [
  {
    id: 'cse',
    code: 'CSE',
    name: 'Computer Science & Engineering',
    shortName: 'Computer Science',
    category: 'Computing',
    nsqfStandardLevel: 6,
    coreKeywords: ['React', 'Next.js', 'Node.js', 'Data Structures', 'Distributed Systems', 'PostgreSQL', 'Docker'],
  },
  {
    id: 'it',
    code: 'IT',
    name: 'Information Technology',
    shortName: 'Information Tech',
    category: 'Computing',
    nsqfStandardLevel: 6,
    coreKeywords: ['DevOps', 'AWS', 'Kubernetes', 'Cybersecurity', 'API Design', 'Linux Administration'],
  },
  {
    id: 'aids',
    code: 'AI/DS',
    name: 'Artificial Intelligence & Data Science',
    shortName: 'AI & Data Science',
    category: 'Emerging Tech',
    nsqfStandardLevel: 6,
    coreKeywords: ['Python', 'PyTorch', 'FastAPI', 'Vector Databases', 'LangChain', 'Data Pipelines', 'SQL'],
  },
  {
    id: 'ece',
    code: 'ECE',
    name: 'Electronics & Communication Engineering',
    shortName: 'Electronics & Comm',
    category: 'Electronics',
    nsqfStandardLevel: 6,
    coreKeywords: ['Embedded C', 'RTOS', 'ARM Cortex', 'VLSI', 'Verilog', 'IoT Protocols', 'MATLAB'],
  },
  {
    id: 'electrical',
    code: 'EEE',
    name: 'Electrical & Electronics Engineering',
    shortName: 'Electrical Engg',
    category: 'Core Engineering',
    nsqfStandardLevel: 6,
    coreKeywords: ['Power Electronics', 'PLC/SCADA', 'EV Powertrain', 'MATLAB Simulink', 'Control Systems'],
  },
  {
    id: 'mechanical',
    code: 'MECH',
    name: 'Mechanical Engineering',
    shortName: 'Mechanical Engg',
    category: 'Core Engineering',
    nsqfStandardLevel: 5,
    coreKeywords: ['SolidWorks', 'ANSYS FEA', 'AutoCAD', 'Robotics Automation', 'Thermodynamics', 'GD&T'],
  },
  {
    id: 'civil',
    code: 'CIVIL',
    name: 'Civil & Infrastructure Engineering',
    shortName: 'Civil Engg',
    category: 'Core Engineering',
    nsqfStandardLevel: 5,
    coreKeywords: ['STAAD Pro', 'Revit BIM', 'AutoCAD Civil', 'Structural Design', 'Surveying', 'Geotechnical'],
  },
  {
    id: 'general',
    code: 'GEN',
    name: 'Engineering & Applied Sciences',
    shortName: 'All Engineering',
    category: 'Core Engineering',
    nsqfStandardLevel: 5,
    coreKeywords: ['Project Management', 'Quality Assurance', 'Applied Mathematics', 'Technical Communications'],
  },
];

export function getAllDomains(): DomainMetadata[] {
  return CANONICAL_DOMAINS;
}

export function resolveDomain(input?: string | null): DomainMetadata {
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

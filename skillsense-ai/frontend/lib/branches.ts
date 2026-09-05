// frontend/lib/branches.ts
/**
 * SkillSense AI — Client Branch Registry & Real Branch-Specific Data
 * Mirrors backend branch architecture for immediate, responsive client interaction:
 * - Real core subjects & modules
 * - NSQF-aligned industry skills
 * - Authentic diagnostic assessment topics & curated question banks
 * - Certification tests catalogue
 * - Sector-specific career pathways & Indian enterprise trajectories
 * - Domain-specific resume/project analyzer presets & heuristics
 */

export interface BranchQuestion {
  question: string;
  codeSnippet?: string;
  options: string[];
  correct: string;
  explanation: string;
}

export interface AssessmentTopic {
  id: string;
  name: string;
  desc: string;
  nsqfLevel: number;
  badge: string;
  questions: BranchQuestion[];
}

export interface BranchTestInfo {
  id: string;
  title: string;
  subject: string;
  duration: number;
  questions: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  skills: string[];
}

export interface BranchCareerPath {
  title: string;
  organization: string;
  match: number;
  salaryRange: string;
  growth: string;
  timeToReady: string;
  requiredSkills: string[];
  missingSkills: string[];
  roadmap: string[];
  reasoning?: string;
}

export interface BranchPreset {
  name: string;
  skills: string;
  interests: string;
  education: string;
  badge: string;
}

export interface AnalyzerDemoPreset {
  title: string;
  mode: 'text';
  text: string;
  targetLevel: number;
  keywords: string[];
}

export interface BranchData {
  id: string;
  code: string;
  name: string;
  aliases: string[];
  domain: string;
  coreSubjects: string[];
  skills: { name: string; category: string; nsqfLevel: number; industryDemandScore: number }[];
  assessmentTopics: AssessmentTopic[];
  tests: BranchTestInfo[];
  careerPaths: BranchCareerPath[];
  presets: BranchPreset[];
  analyzerPresets: AnalyzerDemoPreset[];
  radarDimensions: { subject: string; baseScoreOffset: number }[];
  competencyCategories: { category: string; description: string }[];
  defaultRole: string;
  topEmployers: string[];
  trendingTopics: string[];
}

export const BRANCH_REGISTRY: Record<string, BranchData> = {
  // ── 1. Computer Science & Engineering ──────────────────────────────────────
  cse: {
    id: 'cse',
    code: 'CSE',
    name: 'Computer Science & Engineering',
    aliases: ['cse', 'computer science', 'computer science & engineering', 'computer science and engineering', 'cs', 'software engineering'],
    domain: 'Information Technology & Software',
    defaultRole: 'Full-Stack Software Engineer',
    topEmployers: ['TCS', 'Infosys', 'Swiggy', 'Razorpay', 'Wipro', 'Microsoft IDC', 'Flipkart'],
    trendingTopics: ['Next.js 15 App Router', 'Distributed Systems', 'Microservices', 'GraphQL', 'Prisma ORM'],
    coreSubjects: ['Data Structures & Algorithms', 'Database Management Systems', 'Operating Systems', 'Computer Networks', 'Web Technologies', 'Software Engineering Principles'],
    skills: [
      { name: 'Data Structures & Algorithms', category: 'Core CS', nsqfLevel: 5, industryDemandScore: 92 },
      { name: 'React.js & Next.js', category: 'Frontend', nsqfLevel: 5, industryDemandScore: 90 },
      { name: 'Node.js & Express', category: 'Backend', nsqfLevel: 5, industryDemandScore: 88 },
      { name: 'SQL & Database Design', category: 'Database', nsqfLevel: 5, industryDemandScore: 85 },
      { name: 'Docker & Microservices', category: 'DevOps', nsqfLevel: 6, industryDemandScore: 86 },
      { name: 'System Design & Distributed Systems', category: 'Architecture', nsqfLevel: 6, industryDemandScore: 89 },
    ],
    assessmentTopics: [
      {
        id: 'JavaScript',
        name: 'JavaScript & TypeScript',
        desc: 'Async event loop, closures, generics, promises, prototype chain',
        nsqfLevel: 5,
        badge: 'Core Frontend',
        questions: [
          {
            question: 'What is the output of the following microtask vs macrotask execution order?',
            codeSnippet: `console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');`,
            options: ['A) 1, 2, 3, 4', 'B) 1, 4, 3, 2', 'C) 1, 4, 2, 3', 'D) 1, 3, 4, 2'],
            correct: 'B',
            explanation: 'Synchronous code runs first (1, 4), then microtasks in Promise.then() (3), and finally macrotasks in setTimeout (2).',
          },
          {
            question: 'How does the JavaScript prototype chain resolve property lookups?',
            options: [
              'A) Searches only the immediate object instance and throws ReferenceError',
              'B) Traverses up the __proto__ chain until Object.prototype or null is reached',
              'C) Queries global window object first before local scope',
              'D) Compiles prototype properties directly into bytecode at runtime',
            ],
            correct: 'B',
            explanation: 'Property lookup ascends the prototype chain via [[Prototype]] until found or null is encountered.',
          },
        ],
      },
      {
        id: 'React',
        name: 'React 19 & Next.js App Router',
        desc: 'Server Actions, hooks, component lifecycle, hydration, SSR',
        nsqfLevel: 5,
        badge: 'Modern UI',
        questions: [
          {
            question: 'What problem does the React 19 "useActionState" hook primarily address?',
            options: [
              'A) Replacing Redux completely for client caching',
              'B) Handling pending state, return values, and form action errors asynchronously',
              'C) Compiling JSX directly into WebAssembly',
              'D) Managing WebSocket persistent connections automatically',
            ],
            correct: 'B',
            explanation: 'useActionState manages async form action states, pending transitions, and error returns cleanly.',
          },
        ],
      },
      {
        id: 'Backend-APIs',
        name: 'Node.js & Backend Architecture',
        desc: 'Express REST, streams, buffers, clustering, JWT authentication',
        nsqfLevel: 5,
        badge: 'Backend',
        questions: [
          {
            question: 'In Node.js Express, why must error-handling middleware declare exactly 4 parameters (err, req, res, next)?',
            options: [
              'A) Express inspects fn.length at registration time to identify error handlers',
              'B) It is an arbitrary convention required by V8 garbage collection',
              'C) Without 4 parameters, Express converts middleware into a child process',
              'D) JavaScript syntax requires all 4 parameters to execute try-catch',
            ],
            correct: 'A',
            explanation: 'Express explicitly checks the arity (fn.length === 4) of middleware functions to identify them as error handlers.',
          },
        ],
      },
      {
        id: 'SQL-Databases',
        name: 'SQL & Database Architecture',
        desc: 'Complex joins, indexing, transactions, ACID properties, normal forms',
        nsqfLevel: 5,
        badge: 'Databases',
        questions: [
          {
            question: 'What is a "Covering Index" in SQL relational database systems?',
            options: [
              'A) An index containing all columns requested by the query, eliminating the need to read table heap pages',
              'B) An index that encrypts table columns on physical disk',
              'C) An index automatically created on every primary foreign key pair',
              'D) An index that covers and locks the entire database table during transactions',
            ],
            correct: 'A',
            explanation: 'A covering index includes all referenced columns, enabling index-only query resolution.',
          },
        ],
      },
    ],
    tests: [
      {
        id: 'CSE001',
        title: 'React.js & Modern Web Architecture',
        subject: 'Frontend Engineering',
        duration: 30,
        questions: 20,
        difficulty: 'Medium',
        description: 'Test your knowledge of React hooks, server components, JSX, and component lifecycle.',
        skills: ['React.js', 'Next.js', 'State Management'],
      },
      {
        id: 'CSE002',
        title: 'Data Structures & Algorithmic Thinking',
        subject: 'Computer Science',
        duration: 45,
        questions: 25,
        difficulty: 'Hard',
        description: 'Problem solving on trees, graphs, dynamic programming, and complexity optimization.',
        skills: ['Algorithms', 'Data Structures', 'Problem Solving'],
      },
      {
        id: 'CSE003',
        title: 'Node.js, Express & Microservices',
        subject: 'Backend Engineering',
        duration: 35,
        questions: 20,
        difficulty: 'Medium',
        description: 'REST API design, auth middleware, Redis caching, and error resilience in Express.',
        skills: ['Node.js', 'Express', 'JWT', 'Redis'],
      },
      {
        id: 'CSE004',
        title: 'SQL & Relational Database Design',
        subject: 'Data Architecture',
        duration: 40,
        questions: 22,
        difficulty: 'Medium',
        description: 'Schema indexing, ACID transactions, aggregation queries, and schema normalization.',
        skills: ['SQL', 'MongoDB', 'Indexing'],
      },
    ],
    careerPaths: [
      {
        title: 'Senior Full-Stack Software Engineer',
        organization: 'Swiggy / Razorpay / TCS Digital',
        match: 94,
        salaryRange: '₹8.50 LPA – ₹16.00 LPA',
        growth: '+38% 3-Yr CAGR',
        timeToReady: 'Immediate Match',
        requiredSkills: ['React.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'System Design'],
        missingSkills: ['Distributed Caching (Redis)', 'Kubernetes Deployment'],
        roadmap: [
          'Solidify modern async architecture with Node.js & TypeScript',
          'Implement database schema indexing and query optimization',
          'Deploy containerized microservices to cloud with automated CI/CD',
        ],
        reasoning: 'Strong foundation in web platforms, distributed databases, and modern API standards.',
      },
      {
        title: 'Cloud Platform & DevOps Engineer',
        organization: 'Infosys / Wipro Digital / PhonePe',
        match: 88,
        salaryRange: '₹9.00 LPA – ₹17.50 LPA',
        growth: '+42% 3-Yr CAGR',
        timeToReady: '2–3 Months Targeted Upskilling',
        requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux'],
        missingSkills: ['Terraform IaC', 'Prometheus & Grafana Monitoring'],
        roadmap: [
          'Containerize multi-tier applications with Docker Compose',
          'Configure Kubernetes Cluster Ingress and Load Balancing',
          'Earn AWS / CKA Cloud Verified Credentials',
        ],
        reasoning: 'Growing demand across Indian tech hubs for automated cloud delivery pipelines.',
      },
    ],
    presets: [
      {
        name: 'Full-Stack & Next.js Systems',
        skills: 'TypeScript, React 19, Next.js, Node.js, Express, PostgreSQL, Prisma, TailwindCSS, REST APIs',
        interests: 'Full-Stack Web Development, SaaS Platforms, Cloud Architecture',
        education: 'B.Tech / Diploma in Computer Science (NSQF Level 5)',
        badge: 'High Demand',
      },
      {
        name: 'Cloud & DevOps Infrastructure',
        skills: 'Docker, Kubernetes, AWS ECS/S3, CI/CD GitHub Actions, Linux Administration, Prometheus',
        interests: 'Cloud Platform Engineering, Site Reliability, Kubernetes Orchestration',
        education: 'Cloud Computing & System Administration (NSQF Level 5)',
        badge: 'Infrastructure',
      },
    ],
    analyzerPresets: [
      {
        title: 'Full-Stack Web Engineer (Next.js / TypeScript)',
        mode: 'text',
        text: `Full-Stack Software Engineer with 2+ years of hands-on experience building scalable web applications. Proficient in React 19, Next.js App Router, TypeScript, Node.js, Express, and PostgreSQL. Experienced with Prisma ORM, Redis caching, Tailwind CSS, Docker containerization, and automated CI/CD pipelines via GitHub Actions. Designed RESTful and GraphQL APIs handling 5,000+ daily requests. Implemented OAuth2 / JWT authentication, role-based access control (RBAC), and unit testing with Jest and React Testing Library.`,
        targetLevel: 5,
        keywords: ['react', 'node', 'typescript', 'next.js', 'postgres', 'docker', 'api', 'express'],
      },
    ],
    radarDimensions: [
      { subject: 'Full-Stack Dev', baseScoreOffset: 8 },
      { subject: 'System Design', baseScoreOffset: 4 },
      { subject: 'Cloud & DevOps', baseScoreOffset: 6 },
      { subject: 'Database & SQL', baseScoreOffset: 5 },
      { subject: 'Security & QA', baseScoreOffset: 3 },
      { subject: 'Problem Solving', baseScoreOffset: 5 },
    ],
    competencyCategories: [
      { category: 'Frontend & User Experience', description: 'Component lifecycle, responsive state management, and modern UI tooling' },
      { category: 'Backend Architecture & APIs', description: 'RESTful API protocols, schema validation, and database querying' },
      { category: 'Cloud, Infrastructure & CI/CD', description: 'Automated build pipelines, containerized environments, and cloud deployment' },
      { category: 'Code Quality & Security Hygiene', description: 'Defensive programming patterns, authorization standards, and unit test coverage' },
    ],
  },

  // ── 2. Information Technology ──────────────────────────────────────────────
  it: {
    id: 'it',
    code: 'IT',
    name: 'Information Technology',
    aliases: ['it', 'information technology', 'info tech'],
    domain: 'Enterprise IT, Cloud & Cybersecurity',
    defaultRole: 'Enterprise IT & Cloud Engineer',
    topEmployers: ['TCS', 'Infosys', 'Cognizant', 'Capgemini', 'HCLTech', 'Tech Mahindra'],
    trendingTopics: ['Enterprise Cloud Migrations', 'DevOps Toolchains', 'Zero-Trust Architecture', 'API Gateways'],
    coreSubjects: ['Web Technologies & Services', 'Database Administration', 'Network Administration & Security', 'Cloud Computing Infrastructure', 'Enterprise Software Architecture', 'Information Security & Cyber Laws'],
    skills: [
      { name: 'Cloud Infrastructure (AWS/Azure)', category: 'Cloud', nsqfLevel: 5, industryDemandScore: 91 },
      { name: 'Web Applications & APIs', category: 'Software', nsqfLevel: 5, industryDemandScore: 88 },
      { name: 'Network & System Administration', category: 'Infrastructure', nsqfLevel: 5, industryDemandScore: 84 },
      { name: 'Database Management & Tuning', category: 'Database', nsqfLevel: 5, industryDemandScore: 86 },
      { name: 'DevOps & CI/CD Pipelines', category: 'DevOps', nsqfLevel: 6, industryDemandScore: 89 },
      { name: 'Information Security & Compliance', category: 'Security', nsqfLevel: 6, industryDemandScore: 87 },
    ],
    assessmentTopics: [
      {
        id: 'Cloud-Infrastructure',
        name: 'Enterprise Cloud Infrastructure',
        desc: 'AWS EC2, VPC, IAM policies, Azure Resource Manager, storage classes',
        nsqfLevel: 5,
        badge: 'Cloud Tech',
        questions: [
          {
            question: 'In AWS VPC design, what distinguishes a public subnet from a private subnet?',
            options: [
              'A) A public subnet has a route table directing 0.0.0.0/0 to an Internet Gateway (IGW)',
              'B) A public subnet uses 10.0.0.0/8 addressing while private uses 192.168.0.0/16',
              'C) Public subnets do not require Security Groups or Network ACLs',
              'D) Private subnets cannot be assigned CIDR blocks',
            ],
            correct: 'A',
            explanation: 'A public subnet has an explicit route in its route table forwarding traffic to an attached Internet Gateway.',
          },
        ],
      },
      {
        id: 'Enterprise-Security',
        name: 'Enterprise Network & Cyber Defense',
        desc: 'Firewall rules, VPN tunneling, zero-trust policies, access control lists',
        nsqfLevel: 5,
        badge: 'Security',
        questions: [
          {
            question: 'What is the core principle of Zero Trust Network Architecture (ZTNA)?',
            options: [
              'A) Never trust, always verify: continuous authentication for every user and workload regardless of perimeter location',
              'B) Trusting all internal corporate network IP addresses automatically',
              'C) Disabling all cryptographic certificates on internal intranets',
              'D) Storing credentials in plain text inside local browser cookies',
            ],
            correct: 'A',
            explanation: 'Zero Trust eliminates implicit trust based on network perimeter, requiring continuous dynamic authentication.',
          },
        ],
      },
    ],
    tests: [
      {
        id: 'IT001',
        title: 'Cloud Infrastructure & AWS Administration',
        subject: 'Cloud Engineering',
        duration: 35,
        questions: 25,
        difficulty: 'Medium',
        description: 'Enterprise VPC networking, compute sizing, IAM role delegation, and S3 security policies.',
        skills: ['AWS Services', 'Cloud Architecture', 'Networking'],
      },
    ],
    careerPaths: [
      {
        title: 'Enterprise Cloud Solutions Architect',
        organization: 'Wipro / Capgemini / Cognizant',
        match: 92,
        salaryRange: '₹8.00 LPA – ₹15.00 LPA',
        growth: '+35% 3-Yr CAGR',
        timeToReady: 'Immediate Match',
        requiredSkills: ['AWS / Azure Cloud', 'Terraform', 'Networking & VPC', 'Docker', 'Linux'],
        missingSkills: ['Kubernetes Helm', 'Enterprise FinOps'],
        roadmap: [
          'Design highly available multi-region VPC architectures',
          'Automate cloud infrastructure provisioning using Terraform',
          'Implement enterprise disaster recovery and data redundancy policies',
        ],
        reasoning: 'Direct alignment with Indian enterprise digital transformation contracts.',
      },
    ],
    presets: [
      {
        name: 'Enterprise Cloud & DevOps',
        skills: 'AWS, Azure, Terraform, Docker, Linux, Bash, CI/CD, Python Scripting',
        interests: 'Cloud Migrations, Infrastructure Automation, Enterprise Networks',
        education: 'B.Tech in Information Technology (NSQF Level 5)',
        badge: 'High Demand',
      },
    ],
    analyzerPresets: [
      {
        title: 'Enterprise Cloud & Infrastructure Engineer',
        mode: 'text',
        text: `Cloud Infrastructure Engineer specializing in AWS (VPC, EC2, S3, RDS), Terraform infrastructure-as-code, and Docker container orchestration. Managed automated zero-downtime blue/green deployment workflows via GitLab CI. Strong Linux system administration, bash scripting, and network security fundamentals.`,
        targetLevel: 5,
        keywords: ['aws', 'cloud', 'terraform', 'docker', 'linux', 'vpc', 'devops'],
      },
    ],
    radarDimensions: [
      { subject: 'Cloud Arch', baseScoreOffset: 8 },
      { subject: 'SysAdmin', baseScoreOffset: 6 },
      { subject: 'Security', baseScoreOffset: 7 },
      { subject: 'Database', baseScoreOffset: 5 },
      { subject: 'DevOps', baseScoreOffset: 6 },
      { subject: 'Problem Solving', baseScoreOffset: 5 },
    ],
    competencyCategories: [
      { category: 'Cloud & Infrastructure Services', description: 'VPC design, compute sizing, and resilient cloud storage management' },
      { category: 'System Administration & Networking', description: 'Linux administration, protocol diagnostics, and secure bastion configuration' },
      { category: 'Enterprise Security & Compliance', description: 'Zero-trust policies, firewall rule sets, and access control hygiene' },
    ],
  },

  // ── 3. Mechanical Engineering ──────────────────────────────────────────────
  mechanical: {
    id: 'mechanical',
    code: 'ME',
    name: 'Mechanical Engineering',
    aliases: ['mechanical', 'mechanical engineering', 'me', 'mech', 'mechanical and automation'],
    domain: 'Mechanical Design, Manufacturing & Thermal Systems',
    defaultRole: 'Mechanical Design & Simulation Engineer',
    topEmployers: ['Tata Motors', 'Larsen & Toubro (L&T)', 'Mahindra & Mahindra', 'Bharat Forge', 'Godrej & Boyce', 'Bajaj Auto', 'Thermax India'],
    trendingTopics: ['Electric Vehicle Powertrain Cooling', 'Generative Design & Additive Manufacturing', 'FEA Structural & Thermal Simulation', 'Industry 4.0 & Smart Factories', 'Computational Fluid Dynamics (CFD)'],
    coreSubjects: ['Thermodynamics & Heat Transfer', 'Fluid Mechanics & Hydraulic Machinery', 'Design of Machine Elements', 'Manufacturing Processes & CNC Machining', 'Engineering Mechanics & Strength of Materials', 'Computer-Aided Design & Simulation (CAD/CAM/FEA)'],
    skills: [
      { name: 'CAD 3D Modeling (SolidWorks / CATIA)', category: 'Design', nsqfLevel: 5, industryDemandScore: 92 },
      { name: 'Finite Element Analysis (ANSYS / FEA)', category: 'Simulation', nsqfLevel: 6, industryDemandScore: 89 },
      { name: 'Applied Thermodynamics & Heat Transfer', category: 'Thermal', nsqfLevel: 5, industryDemandScore: 84 },
      { name: 'Geometric Dimensioning & Tolerancing (GD&T)', category: 'Manufacturing', nsqfLevel: 5, industryDemandScore: 88 },
      { name: 'CNC Programming & Manufacturing Tech', category: 'Production', nsqfLevel: 4, industryDemandScore: 82 },
      { name: 'Computational Fluid Dynamics (CFD)', category: 'Thermal', nsqfLevel: 6, industryDemandScore: 86 },
    ],
    assessmentTopics: [
      {
        id: 'CAD-Design',
        name: 'CAD Modeling & GD&T Standards',
        desc: 'Parametric 3D features, assembly constraints, ASME Y14.5 tolerances',
        nsqfLevel: 5,
        badge: 'Mechanical Design',
        questions: [
          {
            question: 'Under ASME Y14.5 GD&T standards, what does the Maximum Material Condition (MMC) symbol (circle M) signify on a tolerance callout?',
            options: [
              'A) It permits bonus tolerance as the feature size departs from its maximum material limit toward least material',
              'B) It specifies the absolute minimum allowable thickness of the raw casting',
              'C) It mandates that machining must only occur at maximum ambient operating temperatures',
              'D) It overrides primary datum plane references',
            ],
            correct: 'A',
            explanation: 'MMC allows bonus geometric tolerance equal to the difference between actual produced feature size and the MMC limit.',
          },
          {
            question: 'When designing a shaft-hole assembly for a heavy torque-transmission interference fit (FN class), what physical condition occurs?',
            options: [
              'A) The hole diameter is deliberately smaller than the shaft diameter, requiring thermal shrink fitting or hydraulic pressing',
              'B) The shaft is lubricated with PTFE to ensure free rotation without friction',
              'C) A mechanical clearance gap always exists between the components under all tolerance conditions',
              'D) The shaft requires no keyway or splines because adhesive sealant alone handles the torque',
            ],
            correct: 'A',
            explanation: 'Interference fits have a negative allowance where the minimum shaft size exceeds the maximum hole size.',
          },
        ],
      },
      {
        id: 'Thermodynamics-Heat-Transfer',
        name: 'Thermodynamics & Thermal Systems',
        desc: 'Rankine & Brayton cycles, conduction/convection heat exchangers, enthalpy balances',
        nsqfLevel: 5,
        badge: 'Thermal Energy',
        questions: [
          {
            question: 'In an ideal vapor compression refrigeration cycle, what is the thermodynamic state change of refrigerant as it passes across the expansion valve?',
            options: [
              'A) Isenthalpic expansion with a rapid drop in pressure and partial vaporization (flashing)',
              'B) Reversible isentropic work generation',
              'C) Isothermal heat addition at constant ambient temperature',
              'D) Isobaric superheating in the compressor suction line',
            ],
            correct: 'A',
            explanation: 'Throttling valves operate isenthalpically (h1 = h2); the pressure drop induces flashing into a low-temperature two-phase liquid-vapor mix.',
          },
          {
            question: 'What is the physical interpretation of the dimensionless Nusselt number (Nu) in convective heat transfer?',
            options: [
              'A) Ratio of convective heat transfer to pure conductive heat transfer across the fluid boundary layer',
              'B) Ratio of momentum diffusivity to thermal diffusivity in laminar flow',
              'C) Ratio of inertial forces to viscous forces in turbulent pipe flow',
              'D) Ratio of buoyant forces to viscous drag forces',
            ],
            correct: 'A',
            explanation: 'Nusselt number Nu = (h * L) / k represents the enhancement of heat transfer across boundary layers compared to pure conduction.',
          },
        ],
      },
      {
        id: 'Manufacturing-CNC',
        name: 'Manufacturing Processes & CNC Machining',
        desc: 'CNC toolpaths, G-code, casting metallurgy, cutting tool mechanics',
        nsqfLevel: 4,
        badge: 'Production',
        questions: [
          {
            question: 'In standard Fanuc/ISO CNC milling G-code, what does command G02 specify?',
            options: [
              'A) Circular interpolation in the clockwise direction at programmed feed rate',
              'B) Circular interpolation in the counter-clockwise direction',
              'C) Rapid positioning traverse without cutting metal',
              'D) Linear cutting interpolation in the Z-axis',
            ],
            correct: 'A',
            explanation: 'G02 executes clockwise circular arc interpolation; G03 executes counter-clockwise interpolation.',
          },
        ],
      },
    ],
    tests: [
      {
        id: 'ME001',
        title: 'Applied Thermodynamics & Heat Exchangers',
        subject: 'Thermal Engineering',
        duration: 40,
        questions: 25,
        difficulty: 'Medium',
        description: 'Evaluation of thermodynamic power cycles, LMTD/NTU heat exchanger design, and psychrometry.',
        skills: ['Thermodynamics', 'Heat Transfer', 'Fluid Mechanics'],
      },
      {
        id: 'ME002',
        title: 'Machine Design & Failure Analysis',
        subject: 'Mechanical Design',
        duration: 45,
        questions: 25,
        difficulty: 'Hard',
        description: 'Stress concentrations, Soderberg/Goodman fatigue criteria, gear trains, and bearing selection.',
        skills: ['Machine Design', 'FEA', 'Strength of Materials'],
      },
      {
        id: 'ME003',
        title: 'Advanced CAD/CAM & GD&T Tolerancing',
        subject: 'Manufacturing Technology',
        duration: 35,
        questions: 20,
        difficulty: 'Medium',
        description: 'ASME Y14.5 standards, datum reference frames, CNC toolpath optimization, and DFM guidelines.',
        skills: ['SolidWorks', 'GD&T', 'CNC Machining'],
      },
    ],
    careerPaths: [
      {
        title: 'Mechanical Design & R&D Engineer',
        organization: 'Tata Motors / Mahindra / Bharat Forge',
        match: 93,
        salaryRange: '₹6.50 LPA – ₹13.00 LPA',
        growth: '+28% 3-Yr CAGR',
        timeToReady: 'Immediate Match',
        requiredSkills: ['SolidWorks / CATIA', 'GD&T', 'FEA Simulation', 'Design for Manufacturing (DFM)'],
        missingSkills: ['ANSYS Mechanical Fatigue Modeling', 'Electric Vehicle Battery Pack Packaging'],
        roadmap: [
          'Master complex surface modeling and assembly kinematics in CATIA / SolidWorks',
          'Conduct linear static and modal vibration simulations using ANSYS Workbench',
          'Participate in industrial prototyping and tooling release with manufacturing teams',
        ],
        reasoning: 'Strong alignment with automotive and heavy engineering manufacturing hubs in Pune, Chennai, and Gujarat.',
      },
      {
        title: 'Thermal Systems & HVAC Analyst',
        organization: 'Thermax / Voltas / L&T Energy',
        match: 87,
        salaryRange: '₹6.00 LPA – ₹12.50 LPA',
        growth: '+24% 3-Yr CAGR',
        timeToReady: '2–3 Months Targeted Upskilling',
        requiredSkills: ['Heat Exchanger Design', 'Psychrometry', 'Fluid Piping Networks', 'Thermal CFD'],
        missingSkills: ['ANSYS Fluent Meshing', 'ASHRAE 90.1 Energy Standards'],
        roadmap: [
          'Model industrial shell-and-tube and plate heat exchangers using HTRI / Aspen',
          'Simulate conjugate heat transfer in electronic cooling systems with CFD',
          'Earn certified HVAC & Energy Auditor credentials',
        ],
        reasoning: 'Accelerating industrial green transition and data center liquid cooling infrastructure in India.',
      },
      {
        title: 'Robotics & Production Automation Lead',
        organization: 'Bajaj Auto / KUKA India / ABB India',
        match: 85,
        salaryRange: '₹7.00 LPA – ₹14.00 LPA',
        growth: '+32% 3-Yr CAGR',
        timeToReady: '2–4 Months Upskilling',
        requiredSkills: ['Industrial Robotics', 'PLC Programming', 'Pneumatics & Hydraulics', 'Lean Manufacturing'],
        missingSkills: ['ROS2 Robot Operating System', 'Computer Vision Quality Inspection'],
        roadmap: [
          'Program 6-axis robotic arms for spot welding and pick-and-place trajectories',
          'Integrate Siemens/Allen-Bradley PLCs with automated conveyor systems',
          'Implement Overall Equipment Effectiveness (OEE) telemetry across factory floors',
        ],
        reasoning: 'Surging demand across India smart manufacturing initiatives and PLI scheme assembly lines.',
      },
    ],
    presets: [
      {
        name: 'Automotive & Mechanical Design',
        skills: 'SolidWorks, CATIA, GD&T, ANSYS FEA, DFM, Material Selection, Strength of Materials',
        interests: 'Automotive Engineering, Powertrain Components, Chassis Design, Structural Optimization',
        education: 'B.Tech / Diploma in Mechanical Engineering (NSQF Level 5)',
        badge: 'High Demand',
      },
      {
        name: 'Thermal & Energy Systems Engineering',
        skills: 'Thermodynamics, Heat Transfer, ANSYS Fluent, HVAC, Piping Design, Refrigeration Cycles',
        interests: 'Renewable Power Plants, Heat Exchangers, EV Thermal Management, Fluid Dynamics',
        education: 'B.Tech in Mechanical Engineering (NSQF Level 6)',
        badge: 'Energy Sector',
      },
      {
        name: 'Manufacturing & Smart Automation',
        skills: 'CNC Machining, G-Code, PLC Automation, Metrology, Lean Six Sigma, Industrial Hydraulics',
        interests: 'Smart Factory Integration, Robotics Assembly, Production Engineering, Quality Control',
        education: 'B.Tech in Mechanical Engineering (NSQF Level 5)',
        badge: 'Industry 4.0',
      },
    ],
    analyzerPresets: [
      {
        title: 'Mechanical Design & Simulation Engineer',
        mode: 'text',
        text: `Mechanical Design Engineer with expertise in parametric 3D modeling using SolidWorks and CATIA V5. Experienced in conducting structural static, thermal, and modal simulations in ANSYS Workbench. Proficient in ASME Y14.5 Geometric Dimensioning & Tolerancing (GD&T), design for injection molding and sheet metal fabrication, and preparing production release engineering drawings.`,
        targetLevel: 5,
        keywords: ['solidworks', 'catia', 'ansys', 'fea', 'gd&t', 'cad', 'thermodynamics', 'machining', 'dfm'],
      },
      {
        title: 'Thermal & HVAC Systems Analyst',
        mode: 'text',
        text: `Thermal Systems Engineer specialized in thermodynamics, conjugate heat transfer, and CFD modeling using ANSYS Fluent. Designed compact fin-and-tube heat exchangers, calculated pressure drops across industrial ductwork, and modeled liquid cooling cold-plates for high-power electronics.`,
        targetLevel: 6,
        keywords: ['thermodynamics', 'heat transfer', 'hvac', 'cfd', 'fluent', 'chiller', 'heat exchanger'],
      },
    ],
    radarDimensions: [
      { subject: 'CAD Design', baseScoreOffset: 9 },
      { subject: 'FEA / ANSYS', baseScoreOffset: 7 },
      { subject: 'Thermal / CFD', baseScoreOffset: 6 },
      { subject: 'GD&T / DFM', baseScoreOffset: 8 },
      { subject: 'Manufacturing', baseScoreOffset: 5 },
      { subject: 'Problem Solving', baseScoreOffset: 6 },
    ],
    competencyCategories: [
      { category: 'Mechanical Design & CAD Detailing', description: 'Parametric 3D solid modeling, complex surface creation, and ASME Y14.5 blueprint production' },
      { category: 'Structural Simulation & FEA', description: 'Finite element meshing, stress concentration analysis, and modal fatigue evaluation' },
      { category: 'Thermal Engineering & Fluid Flow', description: 'Thermodynamic cycle analysis, heat exchanger sizing, and computational fluid dynamics' },
      { category: 'Manufacturing & CNC Technology', description: 'Design for manufacturability, CNC toolpath creation, and quality inspection protocols' },
    ],
  },

  // ── 4. Civil Engineering ───────────────────────────────────────────────────
  civil: {
    id: 'civil',
    code: 'CE',
    name: 'Civil Engineering',
    aliases: ['civil', 'civil engineering', 'ce', 'structural engineering', 'construction technology'],
    domain: 'Structural Analysis, Infrastructure & Construction Management',
    defaultRole: 'Structural Design & BIM Engineer',
    topEmployers: ['Larsen & Toubro (L&T Construction)', 'Shapoorji Pallonji', 'Tata Projects', 'Afcons Infrastructure', 'DLF India', 'Gammon India', 'NHAI & Metro Rail Corporations'],
    trendingTopics: ['Building Information Modeling (BIM - Revit / Navisworks)', 'Earthquake Resistant High-Rise Structures (IS 1893)', 'Geotechnical Deep Foundation Piling', 'Sustainable Green Building & LEED Ratings', 'Precast & Modular Concrete Construction'],
    coreSubjects: ['Structural Analysis & Design of RCC / Steel Structures (IS 456 & IS 800)', 'Geotechnical Engineering & Soil Mechanics', 'Surveying & Geomatics (Total Station / GIS / GPS)', 'Construction Project Management & Estimation', 'Transportation & Highway Engineering (IRC Guidelines)', 'Hydraulics & Water Resources Engineering'],
    skills: [
      { name: 'Structural Design (STAAD.Pro / ETABS)', category: 'Structural', nsqfLevel: 5, industryDemandScore: 93 },
      { name: 'BIM Modeling (Autodesk Revit)', category: 'Modeling', nsqfLevel: 5, industryDemandScore: 91 },
      { name: 'RCC & Steel Detailing (IS Codes)', category: 'Design', nsqfLevel: 5, industryDemandScore: 89 },
      { name: 'Geotechnical Soil Investigation & Piling', category: 'Geotech', nsqfLevel: 6, industryDemandScore: 85 },
      { name: 'Construction Planning (Primavera P6 / MSP)', category: 'Management', nsqfLevel: 5, industryDemandScore: 86 },
      { name: 'Quantity Surveying & Estimation', category: 'Execution', nsqfLevel: 4, industryDemandScore: 84 },
    ],
    assessmentTopics: [
      {
        id: 'Structural-Design',
        name: 'Structural Analysis & RCC Design (IS 456)',
        desc: 'Limit state design, bending moments, shear reinforcement, seismic codes',
        nsqfLevel: 5,
        badge: 'Structural',
        questions: [
          {
            question: 'Under Indian Standard IS 456:2000 limit state design, what is the maximum strain in concrete at the outermost compression fiber under pure flexure?',
            options: ['A) 0.0035', 'B) 0.0020', 'C) 0.0050', 'D) 0.0015'],
            correct: 'A',
            explanation: 'IS 456 Clause 38.1 specifies the maximum compressive strain in concrete under flexure as 0.0035.',
          },
          {
            question: 'What is the primary technical rationale for providing vertical stirrups in a reinforced concrete beam?',
            options: [
              'A) Resisting diagonal tensile stresses resulting from combined shear and bending forces',
              'B) Preventing concrete curing shrinkage at the outer surface',
              'C) Reducing the overall self-weight of the cured concrete beam',
              'D) Permitting electrical conduits to be routed longitudinally',
            ],
            correct: 'A',
            explanation: 'Shear in beams causes diagonal tension cracks; vertical stirrups and bent-up bars intercept and bridge these cracks.',
          },
        ],
      },
      {
        id: 'Geotechnical-Soil',
        name: 'Geotechnical Engineering & Soil Mechanics',
        desc: 'Mohr-Coulomb shear strength, bearing capacity equations, consolidation settlement',
        nsqfLevel: 5,
        badge: 'Geotechnical',
        questions: [
          {
            question: 'According to Terzaghi bearing capacity theory, which soil failure mode typically governs in dense sand under a shallow footing?',
            options: [
              'A) General shear failure with well-defined continuous slip surfaces extending to ground level',
              'B) Local shear failure with only minor surface bulging',
              'C) Punching shear failure with purely vertical compression without heave',
              'D) Liquefaction failure regardless of water table depth',
            ],
            correct: 'A',
            explanation: 'Dense, incompressible sands and stiff clays undergo catastrophic general shear failure with visible heave around the footing.',
          },
        ],
      },
    ],
    tests: [
      {
        id: 'CE001',
        title: 'RCC & Steel Structural Design (IS 456 / IS 800)',
        subject: 'Structural Engineering',
        duration: 45,
        questions: 25,
        difficulty: 'Hard',
        description: 'Limit state analysis of multi-story frames, column interaction diagrams, and welded connections.',
        skills: ['ETABS', 'STAAD.Pro', 'IS 456', 'IS 800'],
      },
      {
        id: 'CE002',
        title: 'BIM Coordination & Construction Scheduling',
        subject: 'Construction Technology',
        duration: 40,
        questions: 22,
        difficulty: 'Medium',
        description: 'Autodesk Revit family modeling, Navisworks clash detection, and Primavera P6 scheduling.',
        skills: ['Revit BIM', 'Navisworks', 'Primavera P6', 'Estimation'],
      },
    ],
    careerPaths: [
      {
        title: 'Structural Design & Analysis Engineer',
        organization: 'L&T Construction / Tata Projects / WSP India',
        match: 94,
        salaryRange: '₹6.00 LPA – ₹12.50 LPA',
        growth: '+26% 3-Yr CAGR',
        timeToReady: 'Immediate Match',
        requiredSkills: ['ETABS', 'STAAD.Pro', 'IS 456 / IS 800 Codes', 'RCC Detailing'],
        missingSkills: ['Seismic Dynamic Response Spectrum Analysis', 'Post-Tensioned Concrete Design'],
        roadmap: [
          'Model multi-story commercial building frames in ETABS subjected to wind & earthquake loads',
          'Prepare structural fabrication and bar bending schedules (BBS) to Indian standards',
          'Complete peer-reviewed structural compliance audits for municipal clearance',
        ],
        reasoning: 'Extensive mega-infrastructure projects, bullet train corridors, and high-rise developments across India.',
      },
      {
        title: 'BIM Project Coordinator & Model Manager',
        organization: 'Afcons Infrastructure / Shapoorji Pallonji / Atkins',
        match: 89,
        salaryRange: '₹6.50 LPA – ₹13.50 LPA',
        growth: '+36% 3-Yr CAGR',
        timeToReady: '1–2 Months Upskilling',
        requiredSkills: ['Autodesk Revit', 'Navisworks Manage', 'BIM LOD 300/400', 'Clash Resolution'],
        missingSkills: ['Dynamo Visual Scripting for Revit', 'Civil 3D Corridor Modeling'],
        roadmap: [
          'Coordinate architectural, structural, and MEP model federation in Navisworks',
          'Run automated soft and hard clash detection audits between rebar and conduit runs',
          'Generate construction-ready 4D time-sequenced site staging animations',
        ],
        reasoning: 'Mandatory BIM adoption guidelines in government infrastructure and metro rail tenders.',
      },
    ],
    presets: [
      {
        name: 'Structural Analysis & RCC Design',
        skills: 'STAAD.Pro, ETABS, IS 456, IS 800, AutoCAD Civil, Concrete Technology, Foundation Design',
        interests: 'High-Rise Buildings, Bridge Engineering, Seismic Resilience, Structural Optimization',
        education: 'B.Tech in Civil Engineering (NSQF Level 5)',
        badge: 'High Demand',
      },
    ],
    analyzerPresets: [
      {
        title: 'Structural Design Engineer (RCC / Steel)',
        mode: 'text',
        text: `Civil Structural Engineer experienced in 3D frame modeling and seismic analysis in ETABS and STAAD.Pro to IS 456, IS 800, and IS 1893 codes. Prepared reinforced concrete bar bending schedules, foundation raft designs, and geotechnical settlement calculations.`,
        targetLevel: 5,
        keywords: ['etabs', 'staad.pro', 'is 456', 'rcc', 'structural', 'revit', 'civil', 'concrete'],
      },
    ],
    radarDimensions: [
      { subject: 'Structural', baseScoreOffset: 9 },
      { subject: 'BIM Revit', baseScoreOffset: 7 },
      { subject: 'Geotech', baseScoreOffset: 6 },
      { subject: 'Estimation', baseScoreOffset: 8 },
      { subject: 'Codes (IS)', baseScoreOffset: 7 },
      { subject: 'Problem Solving', baseScoreOffset: 5 },
    ],
    competencyCategories: [
      { category: 'Structural Modeling & Code Compliance', description: 'Seismic frame modeling in ETABS, limit state RCC design, and steel connection sizing' },
      { category: 'Building Information Modeling (BIM)', description: '3D structural model generation in Revit, family creation, and Navisworks clash audit' },
      { category: 'Geotechnical & Foundation Engineering', description: 'Soil bearing capacity calculation, deep pile group sizing, and settlement analysis' },
    ],
  },

  // ── 5. Electronics & Communication Engineering ─────────────────────────────
  ece: {
    id: 'ece',
    code: 'ECE',
    name: 'Electronics & Communication Engineering',
    aliases: ['ece', 'electronics & communication engineering', 'electronics and communication', 'electronics', 'etc', 'electronics & telecommunication'],
    domain: 'VLSI, Embedded Systems, IoT & Communications',
    defaultRole: 'Embedded Systems & Firmware Engineer',
    topEmployers: ['Texas Instruments', 'Qualcomm India', 'Intel India', 'Bharat Electronics Limited (BEL)', 'Bosch India', 'NXP Semiconductors', 'MediaTek India'],
    trendingTopics: ['RISC-V Architecture & RTL Synthesis', 'Automotive Embedded Firmware (AUTOSAR)', '5G NR Baseband & RF Communication', 'Edge AI Inference on Microcontrollers (TinyML)', 'FPGA Hardware Acceleration'],
    coreSubjects: ['Digital Electronics & Verilog HDL', 'Microcontrollers & Embedded Systems (ARM Cortex / 8051)', 'VLSI Design & CMOS Technology', 'Signals and Systems & DSP', 'Analog Electronics & Op-Amp Circuits', 'Wireless & Satellite Communication Systems'],
    skills: [
      { name: 'Embedded C & RTOS (FreeRTOS)', category: 'Embedded', nsqfLevel: 5, industryDemandScore: 94 },
      { name: 'Verilog HDL & FPGA Synthesis', category: 'VLSI', nsqfLevel: 6, industryDemandScore: 92 },
      { name: 'Microcontroller Interfacing (ARM / ESP32 / STM32)', category: 'Hardware', nsqfLevel: 5, industryDemandScore: 90 },
      { name: 'PCB Schematic & Layout Design (KiCad / Altium)', category: 'Hardware', nsqfLevel: 4, industryDemandScore: 86 },
      { name: 'Digital Signal Processing (DSP / MATLAB)', category: 'Signals', nsqfLevel: 5, industryDemandScore: 84 },
      { name: 'Communication Protocols (I2C / SPI / CAN / UART)', category: 'Embedded', nsqfLevel: 5, industryDemandScore: 91 },
    ],
    assessmentTopics: [
      {
        id: 'Embedded-Systems',
        name: 'Embedded C & Microcontroller Firmware',
        desc: 'Interrupt service routines, timers, DMA, bare-metal registers, FreeRTOS',
        nsqfLevel: 5,
        badge: 'Embedded',
        questions: [
          {
            question: 'Why is the "volatile" keyword critical when declaring a variable accessed by both an Interrupt Service Routine (ISR) and the main loop in embedded C?',
            options: [
              'A) It instructs the C compiler optimizer not to cache the variable in CPU registers, ensuring every read fetches the true hardware memory address',
              'B) It moves the variable automatically into microcontroller EEPROM storage',
              'C) It disables hardware interrupts whenever the variable is being modified',
              'D) It allocates dynamic heap memory via malloc under the hood',
            ],
            correct: 'A',
            explanation: 'volatile prevents compiler optimizations that assume variable values cannot change outside immediate sequential code flow.',
          },
        ],
      },
    ],
    tests: [
      {
        id: 'ECE001',
        title: 'Embedded Firmware & RTOS Architecture',
        subject: 'Embedded Systems',
        duration: 40,
        questions: 25,
        difficulty: 'Hard',
        description: 'Bare-metal C registers, NVIC priority groups, FreeRTOS task synchronization, and CAN bus protocols.',
        skills: ['Embedded C', 'ARM Cortex', 'FreeRTOS', 'CAN Bus'],
      },
    ],
    careerPaths: [
      {
        title: 'Embedded Firmware Engineer',
        organization: 'Bosch India / Texas Instruments / Continental',
        match: 94,
        salaryRange: '₹7.50 LPA – ₹15.00 LPA',
        growth: '+34% 3-Yr CAGR',
        timeToReady: 'Immediate Match',
        requiredSkills: ['Embedded C', 'ARM Cortex-M', 'Device Drivers', 'CAN / SPI / I2C Protocols', 'RTOS'],
        missingSkills: ['AUTOSAR Classic Platform Architecture', 'MISRA-C Compliance Auditing'],
        roadmap: [
          'Develop bare-metal peripheral drivers (UART, SPI, ADC) on STM32 microcontrollers',
          'Implement preemptive multithreading and queue semaphores using FreeRTOS',
          'Conduct hardware-in-the-loop (HIL) automated test validation using logic analyzers',
        ],
        reasoning: 'Vibrant ecosystem of automotive R&D tech centers across Bengaluru, Hyderabad, and Pune.',
      },
      {
        title: 'VLSI RTL Design & Verification Engineer',
        organization: 'Qualcomm / Intel India / MediaTek / NXP',
        match: 90,
        salaryRange: '₹9.50 LPA – ₹19.00 LPA',
        growth: '+40% 3-Yr CAGR',
        timeToReady: '2–3 Months Upskilling',
        requiredSkills: ['Verilog HDL', 'SystemVerilog', 'UVM Methodology', 'Static Timing Analysis', 'FPGA'],
        missingSkills: ['Formal Verification Techniques', 'Low Power UPF Flow'],
        roadmap: [
          'Code synthesizable RTL modules for high-speed protocol interfaces (PCIe / AXI)',
          'Write SystemVerilog constrained random testbenches with functional coverage metrics',
          'Resolve setup and hold timing violations across process-voltage-temperature (PVT) corners',
        ],
        reasoning: 'Unprecedented semiconductor design expansion under the India Semiconductor Mission (ISM).',
      },
    ],
    presets: [
      {
        name: 'Embedded Systems & IoT Hardware',
        skills: 'Embedded C, ARM Cortex, FreeRTOS, PCB Design, I2C/SPI/CAN, Hardware Debugging, Microcontrollers',
        interests: 'Automotive Electronics, Connected IoT Devices, Edge Firmware, Smart Sensors',
        education: 'B.Tech in Electronics & Communication Engineering (NSQF Level 5)',
        badge: 'High Demand',
      },
    ],
    analyzerPresets: [
      {
        title: 'Embedded Firmware & Microcontroller Engineer',
        mode: 'text',
        text: `Embedded Systems Engineer proficient in bare-metal C and FreeRTOS programming on ARM Cortex-M microcontrollers (STM32/ESP32). Developed peripheral drivers for I2C, SPI, UART, and CAN bus protocols. Designed hardware schematics and 4-layer PCB layouts using KiCad.`,
        targetLevel: 5,
        keywords: ['embedded c', 'freertos', 'arm', 'stm32', 'i2c', 'spi', 'can', 'kicad', 'verilog'],
      },
    ],
    radarDimensions: [
      { subject: 'Embedded C', baseScoreOffset: 9 },
      { subject: 'RTOS / Drivers', baseScoreOffset: 7 },
      { subject: 'VLSI / Verilog', baseScoreOffset: 6 },
      { subject: 'PCB Design', baseScoreOffset: 7 },
      { subject: 'Protocols', baseScoreOffset: 8 },
      { subject: 'Problem Solving', baseScoreOffset: 6 },
    ],
    competencyCategories: [
      { category: 'Embedded Firmware & RTOS', description: 'Interrupt management, FreeRTOS task scheduling, and peripheral register configuration' },
      { category: 'Hardware Protocols & Interfacing', description: 'CAN, I2C, SPI serial bus communication and hardware-in-the-loop debugging' },
      { category: 'Digital Hardware & Circuit Layout', description: 'Multilayer PCB design, signal integrity analysis, and digital logic synthesis' },
    ],
  },

  // ── 6. Electrical Engineering ──────────────────────────────────────────────
  electrical: {
    id: 'electrical',
    code: 'EE',
    name: 'Electrical Engineering',
    aliases: ['electrical', 'electrical engineering', 'ee', 'eee', 'electrical & electronics', 'electrical and electronics'],
    domain: 'Power Systems, Drives, Power Electronics & Smart Grids',
    defaultRole: 'Power Systems & Electrical Design Engineer',
    topEmployers: ['Power Grid Corporation of India (PGCIL)', 'BHEL', 'Schneider Electric India', 'ABB India', 'Siemens Energy', 'Tata Power', 'L&T Electrical & Automation'],
    trendingTopics: ['Renewable Microgrid Integration & BESS', 'Electric Vehicle Traction Inverters (SiC / GaN)', 'Substation Automation (IEC 61850)', 'Industrial Variable Frequency Drives (VFD)', 'HVDC Power Transmission Systems'],
    coreSubjects: ['Electrical Machines (Transformers, Induction & Synchronous)', 'Power System Analysis & Protection (Switchgear & Relays)', 'Power Electronics & Converter Topologies', 'Control Systems Engineering', 'Electrical Circuit Theory & Network Synthesis', 'Renewable Energy Technology & Energy Storage'],
    skills: [
      { name: 'Power System Simulation (ETAP / MATLAB)', category: 'Power', nsqfLevel: 5, industryDemandScore: 92 },
      { name: 'Power Electronics Converter Design (MATLAB / Simulink)', category: 'Electronics', nsqfLevel: 6, industryDemandScore: 90 },
      { name: 'Substation & Switchgear Protection', category: 'Protection', nsqfLevel: 5, industryDemandScore: 88 },
      { name: 'PLC & SCADA Automation', category: 'Automation', nsqfLevel: 4, industryDemandScore: 86 },
      { name: 'Motor Drives & Inverter Control (VFD)', category: 'Drives', nsqfLevel: 5, industryDemandScore: 89 },
      { name: 'Solar PV & Energy Storage System (BESS) Design', category: 'Renewables', nsqfLevel: 5, industryDemandScore: 87 },
    ],
    assessmentTopics: [
      {
        id: 'Power-Systems',
        name: 'Power System Protection & Switchgear',
        desc: 'Fault calculations, symmetrical components, numerical relay settings, transformers',
        nsqfLevel: 5,
        badge: 'Power Systems',
        questions: [
          {
            question: 'Why are numerical distance relays preferred over overcurrent relays for high-voltage transmission line protection?',
            options: [
              'A) Distance relays measure impedance (V/I), making their trip boundary virtually independent of source generation impedance variations',
              'B) Distance relays do not require current transformers (CTs) or potential transformers (PTs)',
              'C) Overcurrent relays cannot handle alternating currents above 50 Hz',
              'D) Distance relays operate only after a short circuit fault has cleared naturally',
            ],
            correct: 'A',
            explanation: 'Distance protection relies on line impedance proportional to physical fault distance, unaffected by changing grid generation dispatch.',
          },
        ],
      },
    ],
    tests: [
      {
        id: 'EE001',
        title: 'Power System Analysis & ETAP Fault Modeling',
        subject: 'Power Systems',
        duration: 40,
        questions: 25,
        difficulty: 'Hard',
        description: 'Short circuit MVA calculations, load flow convergence (Newton-Raphson), and protection coordination.',
        skills: ['ETAP', 'Power Systems', 'Switchgear', 'MATLAB'],
      },
    ],
    careerPaths: [
      {
        title: 'Electrical Design & Power Systems Engineer',
        organization: 'Schneider Electric / Siemens / ABB / Tata Power',
        match: 93,
        salaryRange: '₹6.50 LPA – ₹13.00 LPA',
        growth: '+30% 3-Yr CAGR',
        timeToReady: 'Immediate Match',
        requiredSkills: ['ETAP', 'Substation Design', 'Single Line Diagrams (SLD)', 'Protection Relays', 'Switchgear'],
        missingSkills: ['IEC 61850 Protocol Engineering', 'Harmonic Filter Tuning'],
        roadmap: [
          'Design medium-voltage switchgear layouts and protection relay coordination charts in ETAP',
          'Perform arc flash hazard calculations and grounding grid resistance modeling',
          'Commission automated electrical distribution scada telecontrol stations',
        ],
        reasoning: 'Critical national grid modernisation, green hydrogen plants, and massive data center power infrastructure across India.',
      },
    ],
    presets: [
      {
        name: 'Power Systems & Substation Engineering',
        skills: 'ETAP, Load Flow, Short Circuit Analysis, Relay Coordination, Switchgear, Substation SLD, MATLAB',
        interests: 'Grid Infrastructure, Transmission Lines, High Voltage Equipment, Energy Utilities',
        education: 'B.Tech in Electrical Engineering (NSQF Level 5)',
        badge: 'High Demand',
      },
    ],
    analyzerPresets: [
      {
        title: 'Power Systems & Electrical Design Engineer',
        mode: 'text',
        text: `Electrical Engineer experienced in load flow and short-circuit fault studies using ETAP and MATLAB Simulink. Designed medium-voltage single-line diagrams (SLD), configured numerical protection relays, and sized transformer and battery energy storage systems (BESS).`,
        targetLevel: 5,
        keywords: ['etap', 'power systems', 'substation', 'switchgear', 'simulink', 'relay', 'transformer'],
      },
    ],
    radarDimensions: [
      { subject: 'Power Grid', baseScoreOffset: 9 },
      { subject: 'ETAP Study', baseScoreOffset: 8 },
      { subject: 'Drives / VFD', baseScoreOffset: 6 },
      { subject: 'Protection', baseScoreOffset: 8 },
      { subject: 'Renewables', baseScoreOffset: 7 },
      { subject: 'Problem Solving', baseScoreOffset: 5 },
    ],
    competencyCategories: [
      { category: 'Grid Analysis & ETAP Modeling', description: 'Load flow analysis, symmetrical short-circuit current calculation, and single-line diagram generation' },
      { category: 'Protection & Switchgear Engineering', description: 'Numerical relay setting coordination, arc flash safety studies, and breaker sizing' },
      { category: 'Power Electronics & Motor Control', description: 'Variable frequency drive configuration, inverter harmonic filtration, and renewable integration' },
    ],
  },

  // ── 7. AI & Data Science ───────────────────────────────────────────────────
  aids: {
    id: 'aids',
    code: 'AIDS',
    name: 'AI & Data Science',
    aliases: ['aids', 'ai & data science', 'artificial intelligence and data science', 'ai & ds', 'data science', 'data science & analytics'],
    domain: 'Data Science, Applied AI, Analytics & Big Data',
    defaultRole: 'Data Scientist & Machine Learning Analyst',
    topEmployers: ['Google India', 'Microsoft IDC', 'Amazon', 'Fractal Analytics', 'Mu Sigma', 'Flipkart', 'Tiger Analytics'],
    trendingTopics: ['Retrieval-Augmented Generation (RAG)', 'MLOps Pipelines (Kubeflow / MLflow)', 'Vector Databases & Semantic Search', 'Large Scale Feature Engineering with Polars/Spark', 'Model Explainability (SHAP / LIME)'],
    coreSubjects: ['Probability & Mathematical Statistics for Data Science', 'Machine Learning Algorithms & Optimization', 'Deep Learning & Neural Architectures', 'Big Data Engineering & Apache Spark', 'Data Wrangling, Pandas & Visualization', 'Business Intelligence & Predictive Analytics'],
    skills: [
      { name: 'Python & Data Analysis (Pandas/NumPy)', category: 'Core', nsqfLevel: 5, industryDemandScore: 94 },
      { name: 'Machine Learning (Scikit-Learn/XGBoost)', category: 'ML', nsqfLevel: 5, industryDemandScore: 92 },
      { name: 'Deep Learning (PyTorch/TensorFlow)', category: 'AI', nsqfLevel: 6, industryDemandScore: 90 },
      { name: 'SQL & Data Warehousing (BigQuery/Snowflake)', category: 'Data', nsqfLevel: 5, industryDemandScore: 89 },
      { name: 'MLOps & Model Deployment (FastAPI/Docker)', category: 'Deployment', nsqfLevel: 6, industryDemandScore: 88 },
      { name: 'Data Visualization & Storytelling (PowerBI/Seaborn)', category: 'Analytics', nsqfLevel: 4, industryDemandScore: 85 },
    ],
    assessmentTopics: [
      {
        id: 'Machine-Learning',
        name: 'Machine Learning Algorithms & Validation',
        desc: 'Bias-variance tradeoff, cross-validation, regularization, ensemble trees',
        nsqfLevel: 5,
        badge: 'Core ML',
        questions: [
          {
            question: 'In imbalanced classification problems (e.g. 99% negative class), why is accuracy a misleading performance metric?',
            options: [
              'A) A trivial model predicting only the majority class achieves 99% accuracy while having zero recall on the minority target class',
              'B) Accuracy cannot be calculated when datasets contain continuous features',
              'C) The ROC-AUC curve is mathematically identical to accuracy in binary classifiers',
              'D) Imbalanced datasets automatically cause gradient descent divergence',
            ],
            correct: 'A',
            explanation: 'High class imbalance renders raw accuracy useless; precision, recall, F1-score, and PR-AUC reflect real predictive utility.',
          },
        ],
      },
    ],
    tests: [
      {
        id: 'AIDS001',
        title: 'Statistical Inference & Predictive Machine Learning',
        subject: 'Data Science',
        duration: 40,
        questions: 25,
        difficulty: 'Medium',
        description: 'Hypothesis testing, feature importance metrics, gradient boosted trees, and hyperparameter tuning.',
        skills: ['Python', 'Scikit-Learn', 'Statistics', 'Pandas'],
      },
    ],
    careerPaths: [
      {
        title: 'Data Scientist & Predictive Analytics Lead',
        organization: 'Fractal / Tiger Analytics / Flipkart / Swiggy',
        match: 94,
        salaryRange: '₹9.00 LPA – ₹17.50 LPA',
        growth: '+44% 3-Yr CAGR',
        timeToReady: 'Immediate Match',
        requiredSkills: ['Python', 'SQL', 'Machine Learning', 'Statistical Modeling', 'FastAPI'],
        missingSkills: ['MLflow Lifecycle Management', 'Causal Inference Modeling'],
        roadmap: [
          'Build end-to-end churn and recommendation pipelines on production databases',
          'Deploy real-time inference endpoints using FastAPI and Docker containers',
          'Conduct A/B experimentation analysis and model drift monitoring',
        ],
        reasoning: 'Exploding demand for data-driven customer personalization across Indian tech product companies.',
      },
    ],
    presets: [
      {
        name: 'Data Science & Predictive Modeling',
        skills: 'Python, Pandas, NumPy, Scikit-Learn, XGBoost, SQL, Statistical Testing, Data Visualization',
        interests: 'Customer Analytics, Business Intelligence, Recommender Systems, Predictive Forecasting',
        education: 'B.Tech in AI & Data Science (NSQF Level 5)',
        badge: 'High Demand',
      },
    ],
    analyzerPresets: [
      {
        title: 'Data Scientist & Predictive Modeler',
        mode: 'text',
        text: `Data Scientist with extensive experience building predictive machine learning pipelines in Python (Pandas, Scikit-Learn, XGBoost). Proficient in exploratory data analysis, statistical hypothesis testing, SQL database querying, and packaging models with FastAPI and Docker.`,
        targetLevel: 5,
        keywords: ['python', 'pandas', 'scikit-learn', 'machine learning', 'xgboost', 'sql', 'statistics'],
      },
    ],
    radarDimensions: [
      { subject: 'Data Analysis', baseScoreOffset: 9 },
      { subject: 'ML Modeling', baseScoreOffset: 8 },
      { subject: 'Statistics', baseScoreOffset: 7 },
      { subject: 'SQL / ETL', baseScoreOffset: 8 },
      { subject: 'MLOps Deploy', baseScoreOffset: 6 },
      { subject: 'Problem Solving', baseScoreOffset: 7 },
    ],
    competencyCategories: [
      { category: 'Data Analysis & Feature Engineering', description: 'Data wrangling in Pandas, missing value imputation, and correlation diagnostics' },
      { category: 'Predictive Modeling & Validation', description: 'Ensemble model training, cross-validation tuning, and classification metrics' },
      { category: 'Database Querying & Infrastructure', description: 'SQL window functions, analytical aggregation, and data pipeline structuring' },
    ],
  },

  // ── 8. AI & Machine Learning ───────────────────────────────────────────────
  aiml: {
    id: 'aiml',
    code: 'AIML',
    name: 'AI & Machine Learning',
    aliases: ['aiml', 'ai & ml', 'artificial intelligence and machine learning', 'ai & machine learning', 'ai/ml', 'artificial intelligence'],
    domain: 'Deep Learning, NLP, Computer Vision & Generative AI',
    defaultRole: 'Machine Learning & Deep Learning Engineer',
    topEmployers: ['Google DeepMind India', 'Amazon Web Services', 'NVIDIA India', 'Microsoft AI', 'Sarvam AI', 'Krutrim AI'],
    trendingTopics: ['Large Language Model Fine-Tuning (LoRA / QLoRA)', 'Vision Transformers (ViT) & Diffusion Models', 'PyTorch Distributed Data Parallel (DDP)', 'TensorRT / ONNX Hardware Acceleration', 'Agentic AI Workflows (LangGraph / AutoGen)'],
    coreSubjects: ['Deep Learning & Neural Network Architectures', 'Natural Language Processing & Transformers', 'Computer Vision & Convolutional Networks', 'Reinforcement Learning & Decision Systems', 'Linear Algebra & Numerical Optimization', 'MLOps & Distributed AI Infrastructure'],
    skills: [
      { name: 'PyTorch Deep Learning & Tensor Ops', category: 'Deep Learning', nsqfLevel: 6, industryDemandScore: 95 },
      { name: 'Transformers & LLM Architectures', category: 'NLP', nsqfLevel: 6, industryDemandScore: 94 },
      { name: 'Computer Vision (OpenCV / PyTorch)', category: 'Vision', nsqfLevel: 5, industryDemandScore: 90 },
      { name: 'MLOps & GPU Model Serving (Triton/vLLM)', category: 'MLOps', nsqfLevel: 6, industryDemandScore: 92 },
      { name: 'Vector Embeddings & Semantic Indexing', category: 'GenAI', nsqfLevel: 5, industryDemandScore: 91 },
      { name: 'Python Algorithms & GPU Optimization (CUDA Basics)', category: 'Core', nsqfLevel: 6, industryDemandScore: 89 },
    ],
    assessmentTopics: [
      {
        id: 'Deep-Learning',
        name: 'Neural Networks & Deep Learning Foundations',
        desc: 'Backpropagation calculus, vanishing gradients, Adam optimizer, residual connections',
        nsqfLevel: 6,
        badge: 'Deep Learning',
        questions: [
          {
            question: 'Why do Deep Residual Networks (ResNet) utilize identity skip connections (y = F(x) + x)?',
            options: [
              'A) They enable gradients to flow directly through skip connections to early layers, preventing vanishing gradients in deep networks',
              'B) They halve the number of trainable floating point parameters in convolutional kernels',
              'C) They convert all activation functions from ReLU to hyperbolic tangent automatically',
              'D) They allow convolution operations to execute without matrix multiplication',
            ],
            correct: 'A',
            explanation: 'Skip connections allow the gradient to propagate backward unchanged (d(F+x)/dx = dF/dx + 1), mitigating vanishing gradients.',
          },
        ],
      },
    ],
    tests: [
      {
        id: 'AIML001',
        title: 'Deep Learning & Transformer Architectures',
        subject: 'Artificial Intelligence',
        duration: 45,
        questions: 25,
        difficulty: 'Hard',
        description: 'Multi-head self attention mechanics, loss surfaces, learning rate warmup, and quantization techniques.',
        skills: ['PyTorch', 'Transformers', 'Deep Learning', 'Computer Vision'],
      },
    ],
    careerPaths: [
      {
        title: 'Machine Learning & Generative AI Engineer',
        organization: 'NVIDIA India / Amazon AI / Sarvam AI / Microsoft',
        match: 95,
        salaryRange: '₹10.00 LPA – ₹22.00 LPA',
        growth: '+52% 3-Yr CAGR',
        timeToReady: 'Immediate Match',
        requiredSkills: ['PyTorch', 'HuggingFace', 'Transformers', 'Vector Databases', 'vLLM'],
        missingSkills: ['Distributed Model Sharding (DeepSpeed / FSDP)', 'Custom CUDA Kernels'],
        roadmap: [
          'Implement multi-modal transformer pipelines with PyTorch and HuggingFace',
          'Deploy high-throughput quantized LLM inference servers using vLLM and TensorRT-LLM',
          'Fine-tune domain-specific foundation models on Indian languages using LoRA/PEFT',
        ],
        reasoning: 'Massive surge in domestic Indian AI startups and sovereign AI initiatives.',
      },
    ],
    presets: [
      {
        name: 'Generative AI & LLM Systems',
        skills: 'PyTorch, Hugging Face, Transformers, LoRA, LangChain, ChromaDB, FastAPI, Python',
        interests: 'Foundation Models, RAG Architectures, Autonomous Agents, Neural Processing',
        education: 'B.Tech in AI & Machine Learning (NSQF Level 6)',
        badge: 'Top Salary',
      },
    ],
    analyzerPresets: [
      {
        title: 'Deep Learning & LLM Specialist',
        mode: 'text',
        text: `Applied Machine Learning Engineer with deep foundations in Python, PyTorch, and Transformers. Experience fine-tuning open-source LLMs using LoRA/QLoRA and deploying Retrieval-Augmented Generation (RAG) systems with LangChain and vector databases. Built computer vision object detection and classification models in PyTorch.`,
        targetLevel: 6,
        keywords: ['pytorch', 'deep learning', 'transformers', 'llm', 'nlp', 'computer vision', 'rag'],
      },
    ],
    radarDimensions: [
      { subject: 'Deep Learning', baseScoreOffset: 9 },
      { subject: 'NLP / LLMs', baseScoreOffset: 8 },
      { subject: 'Computer Vision', baseScoreOffset: 7 },
      { subject: 'Model Serving', baseScoreOffset: 6 },
      { subject: 'PyTorch Ops', baseScoreOffset: 8 },
      { subject: 'Problem Solving', baseScoreOffset: 6 },
    ],
    competencyCategories: [
      { category: 'Deep Learning Architecture & PyTorch', description: 'Residual networks, attention mechanisms, loss function formulation, and backpropagation' },
      { category: 'Natural Language Processing & LLMs', description: 'Transformer tokenization, self-attention, parameter-efficient fine-tuning (LoRA), and RAG' },
      { category: 'Model Optimization & GPU Serving', description: 'Model quantization (AWQ/GGUF), TensorRT acceleration, and vLLM inference orchestration' },
    ],
  },

  // ── 9. Chemical Engineering ────────────────────────────────────────────────
  chemical: {
    id: 'chemical',
    code: 'CHE',
    name: 'Chemical Engineering',
    aliases: ['chemical', 'chemical engineering', 'che', 'chem'],
    domain: 'Process Engineering, Thermodynamics & Chemical Technology',
    defaultRole: 'Process & Plant Operations Engineer',
    topEmployers: ['Reliance Industries', 'Indian Oil (IOCL)', 'Bharat Petroleum (BPCL)', 'Tata Chemicals', 'BASF India', 'UPL'],
    trendingTopics: ['Green Hydrogen & Electrolyzer Plants', 'Carbon Capture & Sequestration (CCUS)', 'Aspen Plus Process Optimization', 'Advanced Process Control (APC / DCS)', 'Sustainable Bio-refineries'],
    coreSubjects: ['Chemical Engineering Thermodynamics', 'Mass Transfer Operations (Distillation & Absorption)', 'Heat Transfer Equipment Design', 'Chemical Reaction Engineering (Kinetics & Reactors)', 'Process Dynamics, Instrumentation & Control', 'Plant Design & Process Economics'],
    skills: [
      { name: 'Process Simulation (Aspen Plus / HYSYS)', category: 'Simulation', nsqfLevel: 6, industryDemandScore: 92 },
      { name: 'Mass Transfer & Distillation Column Design', category: 'Operations', nsqfLevel: 5, industryDemandScore: 88 },
      { name: 'Chemical Reaction Engineering & Kinetics', category: 'Kinetics', nsqfLevel: 5, industryDemandScore: 86 },
      { name: 'Process Instrumentation & Control (DCS)', category: 'Control', nsqfLevel: 5, industryDemandScore: 89 },
      { name: 'Industrial Safety & HAZOP Studies', category: 'Safety', nsqfLevel: 5, industryDemandScore: 91 },
      { name: 'Heat Exchanger Sizing (HTRI)', category: 'Thermal', nsqfLevel: 4, industryDemandScore: 85 },
    ],
    assessmentTopics: [
      {
        id: 'Mass-Transfer',
        name: 'Mass Transfer & Separation Operations',
        desc: 'McCabe-Thiele method, reflux ratios, absorption packing, liquid-liquid extraction',
        nsqfLevel: 5,
        badge: 'Mass Transfer',
        questions: [
          {
            question: 'In binary fractional distillation modeled by the McCabe-Thiele method, what is the consequence of operating at total reflux (R = infinity)?',
            options: [
              'A) The required number of theoretical equilibrium stages reaches its absolute minimum, but product distillate yield is zero',
              'B) The column requires infinitely many equilibrium stages',
              'C) The reboiler heat duty drops to zero',
              'D) The operating lines become horizontal across all feed conditions',
            ],
            correct: 'A',
            explanation: 'At total reflux, the operating lines coincide with the 45-degree diagonal (y = x), giving minimum theoretical stages with zero net product takeoff.',
          },
        ],
      },
    ],
    tests: [
      {
        id: 'CHE001',
        title: 'Chemical Reaction Engineering & Kinetics',
        subject: 'Reaction Engineering',
        duration: 40,
        questions: 25,
        difficulty: 'Hard',
        description: 'Design equations for PFR, CSTR, residence time distributions, and non-isothermal runaway protection.',
        skills: ['Reaction Kinetics', 'CSTR Design', 'Aspen Plus'],
      },
    ],
    careerPaths: [
      {
        title: 'Process Design & Simulation Engineer',
        organization: 'Reliance Industries / Petrofac / Technip Energies / IOCL',
        match: 92,
        salaryRange: '₹6.50 LPA – ₹13.50 LPA',
        growth: '+26% 3-Yr CAGR',
        timeToReady: 'Immediate Match',
        requiredSkills: ['Aspen Plus / HYSYS', 'P&ID Development', 'Mass & Energy Balances', 'HAZOP'],
        missingSkills: ['Dynamic Process Simulation', 'Flare Network Modeling'],
        roadmap: [
          'Develop rigorous steady-state heat and mass balances in Aspen HYSYS',
          'Participate in Process Hazard Analysis (HAZOP) and Layer of Protection Analysis (LOPA)',
          'Size control valves, safety relief valves (PSVs), and piping networks to API standards',
        ],
        reasoning: 'Expansive refining, petrochemical, and green ammonia investments across Gujarat, Maharashtra, and Odisha.',
      },
    ],
    presets: [
      {
        name: 'Petrochemical & Process Engineering',
        skills: 'Aspen Plus, HYSYS, Mass Transfer, Distillation, P&ID, HAZOP, Thermodynamics, Heat Exchangers',
        interests: 'Refinery Operations, Chemical Manufacturing, Green Ammonia, Process Simulation',
        education: 'B.Tech in Chemical Engineering (NSQF Level 5)',
        badge: 'Process Sector',
      },
    ],
    analyzerPresets: [
      {
        title: 'Chemical Process & Simulation Engineer',
        mode: 'text',
        text: `Chemical Engineer skilled in steady-state process flowsheet simulation using Aspen Plus and HYSYS. Developed heat and mass balance flow diagrams (PFD/P&ID), sized distillation columns and shell-and-tube heat exchangers, and conducted HAZOP safety studies.`,
        targetLevel: 5,
        keywords: ['aspen', 'hysys', 'mass transfer', 'distillation', 'p&id', 'hazop', 'thermodynamics'],
      },
    ],
    radarDimensions: [
      { subject: 'Process Sim', baseScoreOffset: 9 },
      { subject: 'Mass Transfer', baseScoreOffset: 8 },
      { subject: 'Reactions', baseScoreOffset: 7 },
      { subject: 'P&ID / Safety', baseScoreOffset: 8 },
      { subject: 'Thermal Equip', baseScoreOffset: 6 },
      { subject: 'Problem Solving', baseScoreOffset: 5 },
    ],
    competencyCategories: [
      { category: 'Process Flowsheet Simulation', description: 'Aspen HYSYS modeling, fluid property package selection, and convergence diagnostics' },
      { category: 'Separation & Mass Transfer', description: 'Fractional distillation column sizing, packing hydraulics, and absorption efficiency' },
      { category: 'Industrial Safety & Plant Design', description: 'Piping & Instrumentation Diagram development, relief valve sizing, and HAZOP reviews' },
    ],
  },

  // ── 10. Automobile Engineering ─────────────────────────────────────────────
  automobile: {
    id: 'automobile',
    code: 'AUTO',
    name: 'Automobile Engineering',
    aliases: ['automobile', 'automobile engineering', 'auto', 'automotive', 'automotive engineering'],
    domain: 'Vehicle Dynamics, Powertrain, EV Systems & Automotive Design',
    defaultRole: 'Automotive Design & Powertrain Engineer',
    topEmployers: ['Tata Motors', 'Mahindra Automotive', 'Maruti Suzuki', 'Bajaj Auto', 'Hero MotoCorp', 'TVS Motor Company', 'Hyundai India'],
    trendingTopics: ['EV Battery Pack Mechanical Integration', 'Vehicle Dynamics & Active Suspension Control', 'Crashworthiness & Structural Crash FEA', 'ADAS Sensor Fusion & Drive-by-Wire', 'Hybrid IC & Alternative Fuel Powertrains'],
    coreSubjects: ['Automotive Chassis, Suspension & Steering Systems', 'Internal Combustion Engines & Hybrid Powertrains', 'Electric Vehicle Technology & Battery Pack Thermal Design', 'Vehicle Dynamics & Aerodynamics', 'Automotive Electricals & CAN Bus Diagnostics', 'Automotive Crash Safety & Biomechanics'],
    skills: [
      { name: 'Vehicle Dynamics Modeling (CarSim / MATLAB)', category: 'Dynamics', nsqfLevel: 6, industryDemandScore: 90 },
      { name: 'Automotive CAD (CATIA / NX Automotive)', category: 'Design', nsqfLevel: 5, industryDemandScore: 92 },
      { name: 'EV Powertrain & BMS Integration', category: 'EV Tech', nsqfLevel: 6, industryDemandScore: 94 },
      { name: 'CAN Bus Protocols & OBD-II Diagnostics', category: 'Electronics', nsqfLevel: 5, industryDemandScore: 89 },
      { name: 'Crash & Impact FEA Simulation (LS-DYNA)', category: 'Safety', nsqfLevel: 6, industryDemandScore: 88 },
      { name: 'Automotive Suspension & Steering Design', category: 'Chassis', nsqfLevel: 4, industryDemandScore: 85 },
    ],
    assessmentTopics: [
      {
        id: 'Vehicle-Dynamics',
        name: 'Vehicle Dynamics & Handling Mechanics',
        desc: 'Bicycle model, understeer gradient, tire slip angles, roll centers, braking stability',
        nsqfLevel: 5,
        badge: 'Dynamics',
        questions: [
          {
            question: 'What dynamic vehicle behavior occurs when a passenger car exhibits a positive Understeer Gradient (K > 0)?',
            options: [
              'A) Front tire slip angle increases faster than rear tire slip angle with lateral acceleration, requiring greater steering wheel angle at higher speeds',
              'B) Rear slip angle exceeds front slip angle, causing the vehicle to spin out spontaneously above critical speeds',
              'C) The vehicle requires zero steering input to negotiate high-speed banked turns',
              'D) The roll center moves vertically above the vehicle center of gravity',
            ],
            correct: 'A',
            explanation: 'A positive understeer gradient ensures inherent directional stability: front tires slip more, preventing sudden oversteer spin-out.',
          },
        ],
      },
    ],
    tests: [
      {
        id: 'AUTO001',
        title: 'Vehicle Dynamics & Chassis Systems',
        subject: 'Automotive Engineering',
        duration: 40,
        questions: 25,
        difficulty: 'Medium',
        description: 'Tire cornering stiffness, suspension geometry (McPherson vs Double Wishbone), and anti-lock braking (ABS).',
        skills: ['Vehicle Dynamics', 'Suspension Design', 'Chassis Engineering'],
      },
    ],
    careerPaths: [
      {
        title: 'Vehicle Dynamics & Chassis Development Engineer',
        organization: 'Tata Motors R&D / Mahindra / TVS Motor',
        match: 93,
        salaryRange: '₹6.50 LPA – ₹13.50 LPA',
        growth: '+32% 3-Yr CAGR',
        timeToReady: 'Immediate Match',
        requiredSkills: ['Vehicle Dynamics', 'CATIA / SolidWorks', 'ADAMS Car / MATLAB', 'Chassis Kinematics'],
        missingSkills: ['Multi-Body Dynamics (MBD) Co-simulation', 'Active Roll Stabilization Control'],
        roadmap: [
          'Model suspension kinematics and compliance (K&C) test parameters',
          'Tune damping and spring rates on proving ground track tests for ride comfort and handling',
          'Deploy regenerative braking torque blending algorithms with ABS controllers',
        ],
        reasoning: 'Major domestic automotive vehicle launches across SUV, commercial, and electric 2-wheeler platforms.',
      },
    ],
    presets: [
      {
        name: 'EV Powertrain & Automotive Systems',
        skills: 'CATIA, Vehicle Dynamics, MATLAB, EV Battery Design, CAN Bus, Suspension, Powertrain Sizing',
        interests: 'Electric Vehicles, Chassis Tuning, Automotive R&D, Racecar Aerodynamics',
        education: 'B.Tech in Automobile Engineering (NSQF Level 5)',
        badge: 'EV Sector',
      },
    ],
    analyzerPresets: [
      {
        title: 'Automotive Design & Powertrain Engineer',
        mode: 'text',
        text: `Automotive Systems Engineer experienced in vehicle suspension kinematics, chassis packaging in CATIA, and EV battery thermal management. Performed vehicle dynamics simulations in MATLAB/Simulink and calibrated CAN bus diagnostic messages via OBD-II logging.`,
        targetLevel: 5,
        keywords: ['vehicle dynamics', 'catia', 'powertrain', 'can bus', 'suspension', 'chassis', 'ev battery'],
      },
    ],
    radarDimensions: [
      { subject: 'Vehicle Dynamics', baseScoreOffset: 9 },
      { subject: 'CATIA CAD', baseScoreOffset: 8 },
      { subject: 'EV Powertrain', baseScoreOffset: 8 },
      { subject: 'CAN Diagnostics', baseScoreOffset: 7 },
      { subject: 'Chassis Design', baseScoreOffset: 6 },
      { subject: 'Problem Solving', baseScoreOffset: 5 },
    ],
    competencyCategories: [
      { category: 'Vehicle Dynamics & Suspension Tuning', description: 'Kinematics & compliance analysis, understeer gradient tuning, and ride comfort modeling' },
      { category: 'Automotive CAD & Packaging', description: 'Chassis clearance envelope modeling in CATIA and powertrain component integration' },
      { category: 'EV Systems & Electronic Diagnostics', description: 'Battery pack packaging, CAN bus protocol tracing, and regenerative brake control' },
    ],
  },

  // ── 11. Biotechnology ──────────────────────────────────────────────────────
  biotechnology: {
    id: 'biotechnology',
    code: 'BT',
    name: 'Biotechnology',
    aliases: ['biotechnology', 'biotech', 'bt', 'biological engineering', 'biochemical engineering'],
    domain: 'Bioprocessing, Genetic Engineering & Bioinformatics',
    defaultRole: 'Bioprocess & Molecular Research Scientist',
    topEmployers: ['Biocon', 'Serum Institute of India', 'Dr. Reddy’s Laboratories', 'Bharat Biotech', 'Syngene International', 'Novozymes India'],
    trendingTopics: ['CRISPR-Cas9 Gene Editing Applications', 'Monoclonal Antibody (mAb) Fermentation', 'Continuous Bioprocessing & Single-Use Bioreactors', 'Next-Generation Sequencing (NGS) Bioinformatics', 'Synthetic Biology & Enzyme Engineering'],
    coreSubjects: ['Bioprocess Engineering & Fermentation Technology', 'Molecular Biology & Recombinant DNA Technology', 'Bioinformatics & Computational Structural Biology', 'Immunology & Cell Culture Techniques', 'Biochemical Downstream Processing & Chromatography', 'Microbiology & Microbial Genetics'],
    skills: [
      { name: 'Bioreactor Operation & Fermentation Scaling', category: 'Bioprocess', nsqfLevel: 5, industryDemandScore: 92 },
      { name: 'Downstream Chromatography (FPLC / HPLC)', category: 'Purification', nsqfLevel: 5, industryDemandScore: 90 },
      { name: 'Molecular Biology Techniques (PCR / Western Blot)', category: 'Lab', nsqfLevel: 4, industryDemandScore: 88 },
      { name: 'Bioinformatics Tools (BLAST / Biopython / PyMOL)', category: 'Computational', nsqfLevel: 5, industryDemandScore: 89 },
      { name: 'Mammalian Cell Culture & Aseptic Techniques', category: 'Cell Biology', nsqfLevel: 5, industryDemandScore: 91 },
      { name: 'Regulatory Affairs & Good Manufacturing Practices (cGMP)', category: 'Quality', nsqfLevel: 5, industryDemandScore: 86 },
    ],
    assessmentTopics: [
      {
        id: 'Bioprocess-Technology',
        name: 'Bioprocess Engineering & Fermentation',
        desc: 'Monod growth kinetics, oxygen transfer rate (OTR/kLa), scale-up criteria, fed-batch regimes',
        nsqfLevel: 5,
        badge: 'Bioprocess',
        questions: [
          {
            question: 'In aerobic microbial fermentation, what is the significance of the volumetric oxygen mass transfer coefficient (kLa)?',
            options: [
              'A) It quantifies the rate at which gaseous oxygen dissolves across the liquid gas-liquid interface into culture broth',
              'B) It measures the rate of lactic acid byproduct excretion by anaerobic bacteria',
              'C) It defines the optical density wavelength for spectrophotometric cell counting',
              'D) It specifies the sterile autoclave holding time for nutrient media',
            ],
            correct: 'A',
            explanation: 'kLa governs oxygen transfer capacity (OTR = kLa * (C* - CL)); maintaining sufficient kLa is the central challenge in bioreactor scale-up.',
          },
        ],
      },
    ],
    tests: [
      {
        id: 'BT001',
        title: 'Bioprocess Kinetics & Downstream Purification',
        subject: 'Biotechnology',
        duration: 40,
        questions: 25,
        difficulty: 'Medium',
        description: 'Monod growth equations, protein A affinity chromatography, tangential flow filtration, and cGMP validation.',
        skills: ['Bioreactor', 'HPLC', 'Downstream Processing', 'cGMP'],
      },
    ],
    careerPaths: [
      {
        title: 'Upstream Bioprocess Development Scientist',
        organization: 'Biocon / Serum Institute of India / Syngene',
        match: 92,
        salaryRange: '₹5.50 LPA – ₹11.50 LPA',
        growth: '+30% 3-Yr CAGR',
        timeToReady: 'Immediate Match',
        requiredSkills: ['Bioreactor Operation', 'Fermentation Kinetics', 'Aseptic Sampling', 'Scale-up Modeling'],
        missingSkills: ['Process Analytical Technology (PAT - Raman Spectroscopy)', 'Design of Experiments (DoE)'],
        roadmap: [
          'Optimize fed-batch feeding strategies to boost recombinant titer yields',
          'Perform dissolved oxygen (DO) cascade tuning and sparger hydrodynamic characterizations',
          'Author cGMP-compliant standard operating procedures (SOPs) for cleanroom manufacturing',
        ],
        reasoning: 'India is the global vaccine and biosimilar manufacturing hub with huge capacity additions in Pune and Bengaluru.',
      },
    ],
    presets: [
      {
        name: 'Bioprocessing & Biopharmaceutical Manufacturing',
        skills: 'Fermentation, Bioreactors, HPLC, Cell Culture, PCR, cGMP, Downstream Chromatography, Molecular Biology',
        interests: 'Vaccine Production, Biosimilars, Industrial Enzymes, Molecular Diagnostics',
        education: 'B.Tech in Biotechnology (NSQF Level 5)',
        badge: 'Biopharma',
      },
    ],
    analyzerPresets: [
      {
        title: 'Bioprocess & Molecular Research Scientist',
        mode: 'text',
        text: `Biotechnology Researcher with hands-on expertise in fed-batch microbial fermentation and pilot-scale bioreactor operation. Experienced in downstream purification using protein A affinity chromatography, HPLC analytical characterization, and molecular cloning techniques.`,
        targetLevel: 5,
        keywords: ['bioreactor', 'fermentation', 'hplc', 'purification', 'cgmp', 'pcr', 'cell culture'],
      },
    ],
    radarDimensions: [
      { subject: 'Bioprocess Ops', baseScoreOffset: 9 },
      { subject: 'HPLC Purify', baseScoreOffset: 8 },
      { subject: 'MolBio / PCR', baseScoreOffset: 7 },
      { subject: 'Bioinformatics', baseScoreOffset: 6 },
      { subject: 'cGMP Standards', baseScoreOffset: 8 },
      { subject: 'Problem Solving', baseScoreOffset: 5 },
    ],
    competencyCategories: [
      { category: 'Upstream Fermentation & Scaling', description: 'Bioreactor dissolved oxygen tuning, Monod kinetics modeling, and aseptic nutrient feed protocols' },
      { category: 'Downstream Separation & HPLC', description: 'Affinity chromatography purification, ultrafiltration yield quantification, and analytical validation' },
      { category: 'Molecular Biology & cGMP Compliance', description: 'PCR amplification, Western blotting, and pharmaceutical cleanroom documentation' },
    ],
  },

  // ── 12. General Engineering (Neutral fallback - NO CSE bias) ───────────────
  general: {
    id: 'general',
    code: 'ENG',
    name: 'General Engineering & Applied Sciences',
    aliases: ['general', 'engineering', 'applied sciences', 'vocational technology'],
    domain: 'Interdisciplinary Engineering & Applied Technology',
    defaultRole: 'Technical Systems & Operations Engineer',
    topEmployers: ['L&T Group', 'Tata Advanced Systems', 'Honeywell India', 'Siemens', 'Godrej', 'General Electric India'],
    trendingTopics: ['Digital Transformation in Engineering', 'Industrial IoT & Telemetry', 'Sustainable Technology', 'Quality & Six Sigma'],
    coreSubjects: ['Engineering Mathematics & Statistical Methods', 'Applied Mechanics & Materials Science', 'Electrical & Electronic Systems', 'Thermodynamics & Energy Engineering', 'Technical Computing & Data Analytics', 'Industrial Quality, Safety & Environmental Standards'],
    skills: [
      { name: 'Technical Problem Solving & Analytics', category: 'Core', nsqfLevel: 5, industryDemandScore: 88 },
      { name: 'Engineering Documentation & Standards (ISO/BIS)', category: 'Quality', nsqfLevel: 5, industryDemandScore: 85 },
      { name: 'Data Analysis & Technical Computing (Python/MATLAB)', category: 'Tools', nsqfLevel: 5, industryDemandScore: 86 },
      { name: 'Project Planning & Resource Management', category: 'Management', nsqfLevel: 4, industryDemandScore: 83 },
      { name: 'Applied Sensor & Instrumentation Systems', category: 'Hardware', nsqfLevel: 5, industryDemandScore: 84 },
    ],
    assessmentTopics: [
      {
        id: 'Technical-Problem-Solving',
        name: 'Technical Systems & Problem Solving',
        desc: 'Core engineering logic, mathematical modeling, system balances, dimensional analysis',
        nsqfLevel: 5,
        badge: 'Applied Sciences',
        questions: [
          {
            question: 'In dimensional analysis using Buckingham Pi theorem, what is the number of dimensionless Pi groups formed from n physical variables with m fundamental dimensions?',
            options: [
              'A) n - m independent dimensionless groups',
              'B) n + m independent dimensionless groups',
              'C) n * m independent dimensionless groups',
              'D) n / m independent dimensionless groups',
            ],
            correct: 'A',
            explanation: 'Buckingham Pi theorem states that a dimensionally homogeneous equation with n variables and m fundamental dimensions can be expressed as (n - m) dimensionless Pi terms.',
          },
        ],
      },
    ],
    tests: [
      {
        id: 'ENG001',
        title: 'Interdisciplinary Technical Systems Assessment',
        subject: 'Engineering Principles',
        duration: 35,
        questions: 20,
        difficulty: 'Medium',
        description: 'Physical balances, instrumentation circuits, engineering economics, and quality control principles.',
        skills: ['Problem Solving', 'Data Analysis', 'Engineering Fundamentals'],
      },
    ],
    careerPaths: [
      {
        title: 'Technical Systems & Operations Specialist',
        organization: 'L&T Technology Services / Honeywell / Siemens',
        match: 90,
        salaryRange: '₹5.50 LPA – ₹11.00 LPA',
        growth: '+25% 3-Yr CAGR',
        timeToReady: 'Immediate Match',
        requiredSkills: ['Technical Computing', 'Project Engineering', 'System Diagnostics', 'ISO Quality Standards'],
        missingSkills: ['Six Sigma Green Belt Methodology', 'Advanced Simulation Tools'],
        roadmap: [
          'Apply cross-disciplinary modeling to industrial operations',
          'Implement automated telemetry data acquisition and reporting',
          'Lead multidisciplinary engineering execution workflows',
        ],
        reasoning: 'High requirement for multidisciplinary techno-commercial and operations leads across Indian industry.',
      },
    ],
    presets: [
      {
        name: 'Interdisciplinary Technical Engineering',
        skills: 'Technical Computing, Python, Data Analysis, CAD Fundamentals, Quality Control, Project Management',
        interests: 'Systems Engineering, Industrial Operations, Cross-Disciplinary R&D',
        education: 'B.Tech / Diploma in Engineering (NSQF Level 5)',
        badge: 'Interdisciplinary',
      },
    ],
    analyzerPresets: [
      {
        title: 'Technical Systems & Operations Engineer',
        mode: 'text',
        text: `Multidisciplinary Engineering Practitioner with experience in scientific data analysis, sensor instrumentation, technical drawing documentation (ISO/BIS standards), and root-cause fault diagnosis in industrial setups.`,
        targetLevel: 5,
        keywords: ['engineering', 'data analysis', 'instrumentation', 'quality', 'iso', 'project management'],
      },
    ],
    radarDimensions: [
      { subject: 'Problem Solving', baseScoreOffset: 8 },
      { subject: 'Technical Data', baseScoreOffset: 7 },
      { subject: 'Quality / ISO', baseScoreOffset: 7 },
      { subject: 'Hardware / Sensor', baseScoreOffset: 6 },
      { subject: 'Project Eng', baseScoreOffset: 6 },
      { subject: 'Engineering Core', baseScoreOffset: 8 },
    ],
    competencyCategories: [
      { category: 'Interdisciplinary Systems Analysis', description: 'Core dimensional verification, physical mass/energy balances, and mathematical modeling' },
      { category: 'Quality Standards & Technical Governance', description: 'ISO compliance protocols, standard operating procedure documentation, and quality control' },
      { category: 'Instrumentation & Data Analytics', description: 'Sensor telemetry acquisition, statistical data processing, and operational reporting' },
    ],
  },
};

export function getSavedBranchId(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('skillsense_active_branch');
  }
  return null;
}

export function saveBranchId(branchId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('skillsense_active_branch', branchId);
  }
}

/**
 * Normalizes any freeform branch, program, or department string into the matching BranchData.
 * If input is missing or unmapped, checks localStorage saved branch or returns 'general', NEVER CSE.
 */
export function resolveBranch(input?: string | null): BranchData {
  const effectiveInput = input || getSavedBranchId();
  if (!effectiveInput || typeof effectiveInput !== 'string') {
    return BRANCH_REGISTRY.general;
  }

  const clean = effectiveInput.toLowerCase().trim();

  // 1. Direct key match
  if (BRANCH_REGISTRY[clean]) {
    return BRANCH_REGISTRY[clean];
  }

  // 2. Check aliases across all registered branches
  for (const branch of Object.values(BRANCH_REGISTRY)) {
    if (branch.aliases.some((alias) => clean === alias || clean.includes(alias))) {
      return branch;
    }
  }

  // 3. Keyword heuristic checks
  if (clean.includes('mech') || clean.includes('thermal') || clean.includes('cad') || clean.includes('manufacturing')) {
    return BRANCH_REGISTRY.mechanical;
  }
  if (clean.includes('civil') || clean.includes('structur') || clean.includes('construct') || clean.includes('geotech') || clean.includes('bim')) {
    return BRANCH_REGISTRY.civil;
  }
  if (clean.includes('electr') && (clean.includes('comm') || clean.includes('tele') || clean.includes('vlsi') || clean.includes('embed') || clean.includes('ece'))) {
    return BRANCH_REGISTRY.ece;
  }
  if (clean.includes('electr') && (clean.includes('power') || clean.includes('grid') || clean.includes('machine') || clean.includes('ee'))) {
    return BRANCH_REGISTRY.electrical;
  }
  if (clean.includes('auto') || clean.includes('vehicle') || clean.includes('powertrain') || clean.includes('car')) {
    return BRANCH_REGISTRY.automobile;
  }
  if (clean.includes('chem') || clean.includes('petro') || clean.includes('refin') || clean.includes('process')) {
    return BRANCH_REGISTRY.chemical;
  }
  if (clean.includes('bio') || clean.includes('genetic') || clean.includes('ferment') || clean.includes('pharma')) {
    return BRANCH_REGISTRY.biotechnology;
  }
  if ((clean.includes('ai') || clean.includes('intelligence')) && (clean.includes('data') || clean.includes('science') || clean.includes('analytics'))) {
    return BRANCH_REGISTRY.aids;
  }
  if (clean.includes('ml') || clean.includes('machine learning') || clean.includes('deep learning') || clean.includes('neural')) {
    return BRANCH_REGISTRY.aiml;
  }
  if (clean.includes('information') || clean.includes('infotech') || (clean.includes('it') && !clean.includes('suit'))) {
    return BRANCH_REGISTRY.it;
  }
  if (clean.includes('computer') || clean.includes('software') || clean.includes('web dev') || clean.includes('coding') || clean.includes('cse')) {
    return BRANCH_REGISTRY.cse;
  }

  // 4. Safe neutral fallback — NEVER CSE!
  return BRANCH_REGISTRY.general;
}

/**
 * Returns a list of all official academic branches for dropdowns & selection UIs.
 */
export function getAllBranchesSummary(): { id: string; code: string; name: string; domain: string }[] {
  return Object.values(BRANCH_REGISTRY).map((b) => ({
    id: b.id,
    code: b.code,
    name: b.name,
    domain: b.domain,
  }));
}

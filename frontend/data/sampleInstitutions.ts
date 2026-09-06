export interface ProgramROI {
    program: string;
    roi: number;
}

export interface SampleInstitution {
    id: string;
    name: string;
    state: string;
    type: 'ITI' | 'Polytechnic' | 'Vocational';
    students: number;
    placementRate: number;
    programROI: ProgramROI[];
    topPrograms: string[];
    nsqfLevel: number;
}

export const sampleInstitutions: SampleInstitution[] = [
    {
        id: 'INST001',
        name: 'NIIT University Neemrana',
        state: 'Rajasthan',
        type: 'Polytechnic',
        students: 1240,
        placementRate: 78.4,
        programROI: [
            { program: 'Full-Stack Development', roi: 412 },
            { program: 'Data Science', roi: 385 },
            { program: 'Cloud & DevOps', roi: 375 },
            { program: 'Cybersecurity', roi: 390 },
        ],
        topPrograms: ['Full-Stack Development', 'Data Science', 'Cloud & DevOps'],
        nsqfLevel: 5,
    },
    {
        id: 'INST002',
        name: 'Aptech Computer Education Delhi',
        state: 'Delhi',
        type: 'Vocational',
        students: 2180,
        placementRate: 83.7,
        programROI: [
            { program: 'Software Engineering', roi: 445 },
            { program: 'Web Development', roi: 380 },
            { program: 'Mobile App Development', roi: 365 },
            { program: 'UI/UX Design', roi: 340 },
        ],
        topPrograms: ['Software Engineering', 'Web Development', 'Mobile App Development'],
        nsqfLevel: 5,
    },
    {
        id: 'INST003',
        name: 'NSDC Digital Skills Centre Chennai',
        state: 'Tamil Nadu',
        type: 'Vocational',
        students: 890,
        placementRate: 72.1,
        programROI: [
            { program: 'Python Development', roi: 298 },
            { program: 'Software Testing', roi: 275 },
            { program: 'Database Administration', roi: 252 },
            { program: 'IT Support & Networking', roi: 228 },
        ],
        topPrograms: ['Python Development', 'Software Testing'],
        nsqfLevel: 4,
    },
    {
        id: 'INST004',
        name: 'Gujarat Tech University – Vadodara',
        state: 'Gujarat',
        type: 'Polytechnic',
        students: 3200,
        placementRate: 86.2,
        programROI: [
            { program: 'AI & Machine Learning', roi: 520 },
            { program: 'Full-Stack Development', roi: 455 },
            { program: 'Cloud Engineering', roi: 510 },
            { program: 'Blockchain Development', roi: 478 },
        ],
        topPrograms: ['AI & Machine Learning', 'Cloud Engineering', 'Full-Stack Development'],
        nsqfLevel: 5,
    },
    {
        id: 'INST005',
        name: 'IIIT Lucknow Training Centre',
        state: 'Uttar Pradesh',
        type: 'ITI',
        students: 1560,
        placementRate: 66.8,
        programROI: [
            { program: 'Java Development', roi: 302 },
            { program: 'Frontend Development', roi: 278 },
            { program: 'Database Management', roi: 258 },
            { program: 'IT Fundamentals', roi: 235 },
        ],
        topPrograms: ['Java Development', 'Frontend Development', 'Database Management'],
        nsqfLevel: 4,
    },
    {
        id: 'INST006',
        name: 'Techno India – Kolkata',
        state: 'West Bengal',
        type: 'Polytechnic',
        students: 1890,
        placementRate: 74.5,
        programROI: [
            { program: 'React & Angular', roi: 345 },
            { program: 'DevOps & Automation', roi: 365 },
            { program: 'Data Analytics', roi: 332 },
            { program: 'Software Testing', roi: 285 },
        ],
        topPrograms: ['DevOps & Automation', 'React & Angular', 'Data Analytics'],
        nsqfLevel: 5,
    },
    {
        id: 'INST007',
        name: 'Jaipur Engineering College CS Wing',
        state: 'Rajasthan',
        type: 'Vocational',
        students: 740,
        placementRate: 61.3,
        programROI: [
            { program: 'Web Development', roi: 275 },
            { program: 'Python & Django', roi: 295 },
            { program: 'Mobile App Dev', roi: 262 },
        ],
        topPrograms: ['Python & Django', 'Web Development'],
        nsqfLevel: 4,
    },
    {
        id: 'INST008',
        name: 'Nitte Meenakshi IT Academy Bengaluru',
        state: 'Karnataka',
        type: 'Vocational',
        students: 1120,
        placementRate: 81.6,
        programROI: [
            { program: 'Generative AI & LLMs', roi: 620 },
            { program: 'Cloud Architecture', roi: 540 },
            { program: 'Cybersecurity', roi: 560 },
            { program: 'Data Engineering', roi: 480 },
        ],
        topPrograms: ['Generative AI & LLMs', 'Cloud Architecture', 'Cybersecurity'],
        nsqfLevel: 5,
    },
];

import api from '../api';

export interface StudentProfile {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    isVerified: boolean;
  };
  enrollmentNumber: string;
  program: string;
  nsqfLevel: number;
  state: string;
  phone?: string;
  gender: string;
  placementStatus: 'studying' | 'placed' | 'seeking' | 'higher_education';
  overallScore: number;
  skills: {
    skillId?: {
      _id: string;
      name: string;
      domain?: string;
      nsqfLevel?: number;
    } | string;
    score: number;
    lastAssessed: string;
    history?: { score: number; date: string }[];
  }[];
  careerPathways?: string[];
  passportHash?: string;
  interventions?: {
    type: string;
    message: string;
    createdAt: string;
    isRead: boolean;
  }[];
}

export interface SkillAnalysisPayload {
  text?: string;
  githubUrl?: string;
  projects?: string[];
  skills?: string[];
}

export interface ConsentData {
  _id?: string;
  status: 'GRANTED' | 'PENDING' | 'WITHDRAWN';
  purposes: string[];
  grantedAt?: string;
  withdrawnAt?: string;
  consentHistory?: {
    action: string;
    timestamp: string;
    purposes: string[];
  }[];
}

export interface TimelineEvent {
  _id: string;
  eventType: string;
  title: string;
  description: string;
  date: string;
  source: string;
  verificationStatus: string;
  confidence: number;
  metadata?: Record<string, any>;
}

export interface PendingFollowUp {
  _id: string;
  scheduleDays: number;
  dueDate: string;
  status: string;
  title?: string;
  channel?: string;
}

export const studentApi = {
  getMyProfile: async () => {
    const response = await api.get<{ success: boolean; data: StudentProfile }>('/students/me');
    return response.data.data;
  },

  getCareerPaths: async (studentId: string) => {
    const response = await api.get(`/students/${studentId}/career-paths`);
    return response.data.data;
  },

  getPassport: async (studentId: string) => {
    const response = await api.get(`/students/${studentId}/passport`);
    return response.data.data;
  },

  analyzeSkills: async (payload: SkillAnalysisPayload) => {
    const response = await api.post('/students/analyze-skills', payload);
    return response.data.data;
  },

  submitAssessment: async (studentId: string, payload: { skillId?: string; category?: string; responses: any[]; score?: number }) => {
    const response = await api.post(`/students/${studentId}/assessments`, payload);
    return response.data.data;
  },

  submitAssessmentDirect: async (payload: { category: string; score: number; totalQuestions: number; aiAnalysis?: any }) => {
    const response = await api.post('/assessments/submit', payload);
    return response.data.data;
  },

  getAssessmentHistory: async () => {
    const response = await api.get('/assessments/history');
    return response.data.data;
  },

  updateProfile: async (studentId: string, updates: Partial<StudentProfile>) => {
    const response = await api.put(`/students/${studentId}`, updates);
    return response.data.data;
  },

  getMyTimeline: async (): Promise<TimelineEvent[]> => {
    const response = await api.get('/outcomes/my-timeline');
    return response.data.data;
  },

  submitSelfReport: async (payload: {
    status?: string;
    employerName?: string;
    jobRole?: string;
    monthlySalary?: number;
    trainingRelevance?: string;
    district?: string;
    program?: string;
  }) => {
    const response = await api.post('/outcomes/self-report', payload);
    return response.data.data;
  },

  getMyPendingFollowUps: async (): Promise<PendingFollowUp[]> => {
    const response = await api.get('/followups/my-pending');
    return response.data.data;
  },

  submitFollowUp: async (followUpId: string, responses: {
    isEmployed: boolean;
    employmentType?: string;
    employerName?: string;
    jobRole?: string;
    currentSalary?: number;
    trainingRelevance?: string;
    feedback?: string;
  }) => {
    const response = await api.post('/followups/submit', { followUpId, responses });
    return response.data.data;
  },

  getConsent: async (): Promise<ConsentData> => {
    const response = await api.get('/consent/status');
    return response.data.data;
  },

  updateConsent: async (payload: { status: string; purposes: string[] }): Promise<ConsentData> => {
    const response = await api.post('/consent/update', payload);
    return response.data.data;
  },

  getInstituteDashboard: async (institutionId: string) => {
    const response = await api.get(`/institutes/${institutionId}/dashboard`);
    return response.data.data;
  },

  getInstituteStudents: async (institutionId: string) => {
    const response = await api.get(`/institutes/${institutionId}/students`);
    return response.data.data;
  },

  getInstituteROI: async (institutionId: string) => {
    const response = await api.get(`/institutes/${institutionId}/roi`);
    return response.data.data;
  },

  getInstituteReport: async (institutionId: string) => {
    const response = await api.get(`/institutes/${institutionId}/report`);
    return response.data.data;
  },
};

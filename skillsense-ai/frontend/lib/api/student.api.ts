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
};

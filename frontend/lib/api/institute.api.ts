import api from '../api';

export interface InstituteDashboard {
  institution: {
    _id: string;
    name: string;
    type: string;
    state: string;
    district: string;
    nsqfAffiliation: string;
    studentCount?: number;
    placementRate?: number;
    programs?: string[];
  };
  stats: {
    studentCount: number;
    placedCount: number;
    placementRate: number;
    avgScore: number;
    topPrograms: { program: string; count: number }[];
  };
}

export interface InstituteStudent {
  _id: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  enrollmentNumber: string;
  program: string;
  nsqfLevel: number;
  state?: string;
  gender?: string;
  placementStatus: string;
  overallScore: number;
  skills?: { skillId?: { name: string } | string; score: number }[];
  passportHash?: string;
  salary?: number;
}

export interface PlacementTrendPoint {
  month: string;
  placed: number;
  avgSalary: number;
}

export interface InstituteROIScore {
  program: string;
  roi: number;
}

export interface CreateStudentPayload {
  name: string;
  email: string;
  program: string;
  nsqfLevel?: number;
  gender?: string;
  batch?: string;
  phone?: string;
}

export interface EvaluationPayload {
  studentId: string;
  category: string;
  score: number;
  feedback?: string;
  rubricScores?: {
    domainKnowledge?: number;
    practicalSkills?: number;
    codeQuality?: number;
    presentation?: number;
  };
}

export interface InstituteEvaluation {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    email: string;
  } | string;
  category: string;
  score: number;
  totalQuestions: number;
  aiAnalysis: string;
  completedAt: string;
}

export interface DynamicROIProgram {
  program: string;
  roi: number | null;
  status: 'SUFFICIENT_DATA' | 'INSUFFICIENT_DATA';
  isSufficientData: boolean;
  sampleSize: number;
  placedCount?: number;
  avgSalaryMonthly?: number;
  annualWageUplift?: number;
  threeYearReturn?: number;
  costPerTrainee?: number;
  message?: string;
}

export interface DynamicROIResponse {
  status: string;
  isSufficientData: boolean;
  totalStudents?: number;
  totalPlaced?: number;
  message?: string;
  programs: DynamicROIProgram[];
}

export const instituteApi = {
  getInstitutionId: (user: { _id?: string; id?: string; institutionId?: string } | null): string | null => {
    if (!user) return null;
    return (user as any).institutionId || user._id || user.id || null;
  },

  getDashboard: async (institutionId: string): Promise<InstituteDashboard> => {
    const response = await api.get(`/institutes/${institutionId}/dashboard`);
    return response.data.data;
  },

  getStudents: async (institutionId: string, params: { page?: number; limit?: number } = {}): Promise<InstituteStudent[]> => {
    const response = await api.get(`/institutes/${institutionId}/students`, { params });
    if (Array.isArray(response.data?.data)) return response.data.data;
    return response.data?.data?.items || [];
  },

  createStudent: async (institutionId: string, payload: CreateStudentPayload): Promise<any> => {
    const response = await api.post(`/institutes/${institutionId}/students`, payload);
    return response.data.data;
  },

  getEvaluations: async (institutionId: string): Promise<{ evaluations: InstituteEvaluation[]; students: any[] }> => {
    const response = await api.get(`/institutes/${institutionId}/evaluations`);
    return response.data.data || { evaluations: [], students: [] };
  },

  createEvaluation: async (institutionId: string, payload: EvaluationPayload): Promise<any> => {
    const response = await api.post(`/institutes/${institutionId}/evaluations`, payload);
    return response.data.data;
  },

  getPlacementTrend: async (institutionId: string): Promise<PlacementTrendPoint[]> => {
    const response = await api.get(`/institutes/${institutionId}/placement`);
    return response.data.data;
  },

  getROI: async (institutionId: string): Promise<any> => {
    const response = await api.get(`/institutes/${institutionId}/roi`);
    return response.data.data || [];
  },
};

export default instituteApi;

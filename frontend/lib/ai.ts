// frontend/lib/ai.ts
// Frontend helpers for AI-powered analytics API calls.

import api from './api';

/** Analyse skill gaps for a given student */
export const analyzeSkillGaps = async (studentId: string) => {
  const { data } = await api.post('/analytics/skill-gaps', { studentId });
  return data;
};

/** Get AI-matched career paths for a student */
export const getCareerPaths = async (studentId: string) => {
  const { data } = await api.get(`/students/${studentId}/career-paths`);
  return data;
};

/** Get real-time industry demand for a skill domain (Perplexity-powered) */
export const getIndustryDemand = async (domain: string) => {
  const { data } = await api.get(`/industry/demand?domain=${encodeURIComponent(domain)}`);
  return data;
};

/** Get skill gap analytics summary */
export const getSkillGaps = async () => {
  const { data } = await api.get('/analytics/skill-gaps');
  return data;
};

/** Get placement trend analytics */
export const getPlacementTrends = async () => {
  const { data } = await api.get('/analytics/placement-trends');
  return data;
};

/** Get national heatmap data */
export const getNationalHeatmap = async () => {
  const { data } = await api.get('/analytics/heatmap');
  return data;
};

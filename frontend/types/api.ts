export interface AssessmentHistory {
  _id: string;
  category: string;
  score: number;
  totalQuestions: number;
  aiAnalysis: string;
  completedAt: string;
}

export interface CareerPrediction {
  _id: string;
  userId: string;
  recommendedRole: string;
  confidence: number;
  marketDemand: 'High' | 'Medium' | 'Low';
  skillGaps: string[];
  roadmap: string;
  predictedSalary: number;
  createdAt: string;
}

export interface ChatSession {
  _id: string;
  userId: string;
  topic: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  createdAt: string;
}

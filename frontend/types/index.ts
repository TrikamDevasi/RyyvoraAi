// frontend/types/index.ts
// Shared TypeScript types and interfaces for Ryyvora AI frontend.

export type UserRole = 'student' | 'employer' | 'institute' | 'industry' | 'government' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  isActive?: boolean;
}

export interface SkillEntry {
  skillId?: string;
  name?: string;
  score: number;
  lastAssessed?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: { field: string; message: string }[];
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

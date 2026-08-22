import { IUser } from '../models/User.model';

export type UserRole = 'student' | 'employer' | 'institute' | 'industry' | 'government' | 'admin';

export interface AuthenticatedRequest extends Request {
  user: IUser;
}

export interface JWTPayload {
  userId: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

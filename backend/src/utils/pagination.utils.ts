import { PaginatedResponse, ApiResponse } from '../types';

export const parsePagination = (query: { page?: unknown; limit?: unknown }): { skip: number; limit: number; page: number } => {
  const page = Math.max(1, parseInt(String(query.page ?? 1), 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit ?? 20), 10) || 20));
  const skip = (page - 1) * limit;
  return { skip, limit, page };
};

export const buildPaginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  message = 'Data retrieved successfully'
): PaginatedResponse<T> => {
  return {
    success: true,
    data,
    message,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

export const buildApiResponse = <T>(
  data: T | null,
  message: string,
  success = true
): ApiResponse<T> => ({
  success,
  data,
  message,
});

import { useState, useCallback, useEffect } from 'react';
import api from '@/lib/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(url?: string) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: !!url,
    error: null,
  });

  const request = useCallback(async (
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    body?: unknown
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const res = await api({
        method,
        url: endpoint,
        data: body,
      });
      setState({ data: res.data.data || res.data, loading: false, error: null });
      return res.data;
    } catch (err: unknown) {
      const message = (err as any)?.response?.data?.message || (err as any)?.message || 'Something went wrong';
      setState({ data: null, loading: false, error: message });
      throw err;
    }
  }, []);

  const refetch = useCallback(async () => {
    if (!url) return;
    return request('GET', url);
  }, [url, request]);

  useEffect(() => {
    if (url) {
      refetch();
    }
  }, [url, refetch]);

  return { ...state, request, refetch };
}

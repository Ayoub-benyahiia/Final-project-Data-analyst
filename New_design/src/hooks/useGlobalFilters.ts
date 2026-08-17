import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import type { GlobalFilters } from '../types';

const FILTER_KEYS: (keyof GlobalFilters)[] = ['cities', 'contracts', 'education', 'experience', 'technologies'];

export function useGlobalFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<GlobalFilters>(() => {
    const result: GlobalFilters = { cities: [], contracts: [], education: [], experience: [], technologies: [] };
    for (const key of FILTER_KEYS) {
      const raw = searchParams.get(key);
      if (raw) {
        result[key] = raw.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    return result;
  }, [searchParams]);

  const setFilter = useCallback((key: keyof GlobalFilters, value: string[]) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (value.length > 0) {
        next.set(key, value.join(','));
      } else {
        next.delete(key);
      }
      return next;
    });
  }, [setSearchParams]);

  const clearFilters = useCallback(() => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      for (const key of FILTER_KEYS) {
        next.delete(key);
      }
      return next;
    });
  }, [setSearchParams]);

  const activeCount = FILTER_KEYS.reduce((sum, key) => sum + filters[key].length, 0);
  const isActive = activeCount > 0;

  return { filters, setFilter, clearFilters, isActive, activeCount };
}

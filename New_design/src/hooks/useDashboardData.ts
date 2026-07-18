import { useQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query-client';
import type { FilterParams, ApiResponse, DashboardKpis, GrowthDataPoint } from '@/types';

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Fetch growth data with filter-aware caching
 * QueryKey: ['growthData', filters] - ensures cache invalidation on filter change
 */
export function useGrowthData(filters: FilterParams = {}) {
  const { city = 'All', tech = 'All', experience = 'All' } = filters;
  
  return useQuery<ApiResponse<GrowthDataPoint[]>>({
    queryKey: ['growthData', { city, tech, experience }],
    queryFn: async () => {
      const params = new URLSearchParams({
        city: city.toString(),
        tech: tech.toString(),
        experience: experience.toString(),
      });
      const response = await fetch(`${API_BASE_URL}/growth-data?${params}`);
      if (!response.ok) throw new Error('Failed to fetch growth data');
      return response.json() as Promise<ApiResponse<GrowthDataPoint[]>>;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Fetch tech radar data with filter-aware caching
 * QueryKey: ['techRadar', filters] - different tech/city combos have different cache entries
 */
export function useTechRadar(filters: FilterParams = {}) {
  const { city = 'All', tech = 'All', experience = 'All' } = filters;
  
  return useQuery({
    queryKey: ['techRadar', { city, tech, experience }],
    queryFn: async () => {
      const params = new URLSearchParams({
        city: city.toString(),
        tech: tech.toString(),
        experience: experience.toString(),
      });
      const response = await fetch(`${API_BASE_URL}/tech-radar?${params}`);
      if (!response.ok) throw new Error('Failed to fetch tech radar data');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Fetch companies data with filter-aware caching
 * QueryKey: ['companies', filters] - city/tech/remote/search combinations cached separately
 */
export function useCompanies(filters: FilterParams = {}) {
  const { city = 'All', tech = 'All', remote_only = false, search = '' } = filters;
  
  return useQuery({
    queryKey: ['companies', { city, tech, remote_only, search }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (city !== 'All') params.append('city', city.toString());
      if (tech !== 'All') params.append('tech', tech.toString());
      if (remote_only) params.append('remote_only', 'true');
      if (search) params.append('search', search);
      
      const response = await fetch(`${API_BASE_URL}/analytics/companies?${params}`);
      if (!response.ok) throw new Error('Failed to fetch companies data');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Fetch market metrics with filter-aware caching
 * QueryKey: ['marketMetrics', filters] - heavy aggregation endpoint benefits from caching
 */
export function useMarketMetrics(filters: FilterParams = {}) {
  const { city = 'All', tech = 'All', experience = 'All' } = filters;
  
  return useQuery({
    queryKey: ['marketMetrics', { city, tech, experience }],
    queryFn: async () => {
      const params = new URLSearchParams({
        city: city.toString(),
        tech: tech.toString(),
        experience: experience.toString(),
      });
      const response = await fetch(`${API_BASE_URL}/market-metrics?${params}`);
      if (!response.ok) throw new Error('Failed to fetch market metrics');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Fetch top skills with filter-aware caching
 * QueryKey: ['topSkills', filters] - city/experience combinations cached separately
 */
export function useTopSkills(filters: FilterParams = {}) {
  const { city = 'All', experience = 'All' } = filters;
  
  return useQuery({
    queryKey: ['topSkills', { city, experience }],
    queryFn: async () => {
      const params = new URLSearchParams({
        city: city.toString(),
        experience: experience.toString(),
      });
      const response = await fetch(`${API_BASE_URL}/top-skills?${params}`);
      if (!response.ok) throw new Error('Failed to fetch top skills');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Fetch dashboard KPIs with filter-aware caching
 * QueryKey: ['dashboardKpis', filters] - most complex endpoint with multiple filter parameters
 */
export function useDashboardKpis(filters: FilterParams = {}) {
  const { city = 'All', tech = 'All', experience = 'All', contract = 'All' } = filters;
  
  return useQuery<ApiResponse<DashboardKpis>>({
    queryKey: ['dashboardKpis', { city, tech, experience, contract }],
    queryFn: async () => {
      const params = new URLSearchParams({
        city: city.toString(),
        tech: tech.toString(),
        experience: experience.toString(),
        contract: contract.toString(),
      });
      const response = await fetch(`${API_BASE_URL}/dashboard-kpis?${params}`);
      if (!response.ok) throw new Error('Failed to fetch dashboard KPIs');
      return response.json() as Promise<ApiResponse<DashboardKpis>>;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Utility to invalidate all dashboard queries when needed
 * Useful for manual refresh or after data updates
 */
export function invalidateDashboardQueries() {
  queryClient.invalidateQueries({ queryKey: ['growthData'] });
  queryClient.invalidateQueries({ queryKey: ['techRadar'] });
  queryClient.invalidateQueries({ queryKey: ['companies'] });
  queryClient.invalidateQueries({ queryKey: ['marketMetrics'] });
  queryClient.invalidateQueries({ queryKey: ['topSkills'] });
  queryClient.invalidateQueries({ queryKey: ['dashboardKpis'] });
}

/**
 * Utility to invalidate specific query based on filter changes
 * This ensures precise cache invalidation when specific filters change
 */
export function invalidateQueryByFilter(queryName: string, filters: FilterParams) {
  queryClient.invalidateQueries({ 
    queryKey: [queryName, filters] 
  });
}

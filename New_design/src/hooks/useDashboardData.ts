import { useQuery, useMutation } from '@tanstack/react-query';
import type { GlobalFilters, MarketPulse, MarketOverviewData, MarketAnalysisData, StackMatcherRequest, StackMatcherResult, SkillPairingsResult, SkillListItem } from '../types';

const API_BASE = '/api/v1';

function qs(filters: GlobalFilters): string {
  const params = new URLSearchParams();
  if (filters.cities.length) params.set('cities', filters.cities.join(','));
  if (filters.contracts.length) params.set('contracts', filters.contracts.join(','));
  if (filters.education.length) params.set('education', filters.education.join(','));
  if (filters.experience.length) params.set('experience', filters.experience.join(','));
  if (filters.technologies.length) params.set('technologies', filters.technologies.join(','));
  return params.toString();
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const useMarketPulse = () => useQuery<MarketPulse>({
  queryKey: ['market-pulse'],
  queryFn: () => fetchJson<MarketPulse>(`${API_BASE}/market-pulse`),
  staleTime: 5 * 60 * 1000,
});

export const useMarketPulsePreview = () => useQuery<{ top_skills: { name: string; count: number; category: string }[]; contract_distribution: { name: string; count: number; pct: number }[]; trending_jobs: { job_id: number; job_title: string; company_name: string; city: string; is_junior_friendly: number; allows_remote: number }[] }>({
  queryKey: ['market-pulse-preview'],
  queryFn: () => fetchJson(`${API_BASE}/market-pulse-preview`),
  staleTime: 5 * 60 * 1000,
});

export const useMarketOverview = (filters: GlobalFilters) => useQuery<MarketOverviewData>({
  queryKey: ['market-overview', filters],
  queryFn: () => fetchJson<MarketOverviewData>(`${API_BASE}/market-overview?${qs(filters)}`),
  staleTime: 5 * 60 * 1000,
});

export const useMarketAnalysis = (filters: GlobalFilters) => useQuery<MarketAnalysisData>({
  queryKey: ['market-analysis', filters],
  queryFn: () => fetchJson<MarketAnalysisData>(`${API_BASE}/market-analysis?${qs(filters)}`),
  staleTime: 5 * 60 * 1000,
});

export const useStackMatcher = () => useMutation<StackMatcherResult, Error, StackMatcherRequest>({
  mutationFn: (body) => fetch(`${API_BASE}/matcher/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(r => { if (!r.ok) throw new Error(`API error: ${r.status}`); return r.json(); }),
});

export const useSkillPairings = (skill: string, filters: GlobalFilters) => useQuery<SkillPairingsResult>({
  queryKey: ['skill-pairings', skill, filters],
  queryFn: () => fetchJson<SkillPairingsResult>(`${API_BASE}/skills/pairings?skill=${encodeURIComponent(skill)}&${qs(filters)}`),
  staleTime: 5 * 60 * 1000,
  enabled: !!skill,
});

export const useSkillsList = () => useQuery<SkillListItem[]>({
  queryKey: ['skills-list'],
  queryFn: () => fetchJson<SkillListItem[]>(`${API_BASE}/skills/list`),
  staleTime: 30 * 60 * 1000,
});

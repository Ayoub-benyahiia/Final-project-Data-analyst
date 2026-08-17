import { useQuery } from "@tanstack/react-query";
import {
  fetchFilterOptions,
  fetchMarketPulse,
  fetchMarketOverview,
  fetchDetailedAnalysis,
  fetchStackMatcher,
  fetchSkillPairings,
  fetchSkillsList,
  fetchSkillsCatalog,
} from "@/lib/api";
import { GlobalFilterParams, FilterState } from "@/types";

export function useFilterOptions() {
  return useQuery({
    queryKey: ["filter-options"],
    queryFn: () => fetchFilterOptions(),
    staleTime: 1000 * 60 * 30, // 30 mins
  });
}

export function useMarketPulse() {
  return useQuery({
    queryKey: ["market-pulse"],
    queryFn: () => fetchMarketPulse(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useMarketOverview(filters?: GlobalFilterParams | FilterState | null) {
  return useQuery({
    queryKey: ["market-overview", filters],
    queryFn: () => fetchMarketOverview(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useDetailedAnalysis(filters?: GlobalFilterParams | FilterState | null) {
  return useQuery({
    queryKey: ["detailed-analysis", filters],
    queryFn: () => fetchDetailedAnalysis(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useStackMatcher(
  skills: string[],
  filters?: GlobalFilterParams | FilterState | null
) {
  return useQuery({
    queryKey: ["stack-matcher", skills, filters],
    queryFn: () => fetchStackMatcher(skills, filters),
    enabled: skills.length > 0,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSkillPairings(
  skill: string = "React",
  filters?: GlobalFilterParams | FilterState | null
) {
  return useQuery({
    queryKey: ["skill-pairings", skill, filters],
    queryFn: () => fetchSkillPairings(skill, filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSkillsList() {
  return useQuery({
    queryKey: ["skills-list"],
    queryFn: () => fetchSkillsList(),
    staleTime: 1000 * 60 * 30, // 30 mins
  });
}

export function useSkillsCatalog() {
  return useQuery({
    queryKey: ["skills-catalog"],
    queryFn: () => fetchSkillsCatalog(),
    staleTime: 1000 * 60 * 15,
  });
}

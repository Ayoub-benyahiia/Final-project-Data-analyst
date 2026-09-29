import {
  GlobalFilterParams,
  FilterState,
  MarketPulseResponse,
  MarketOverviewResponse,
  MarketAnalysisResponse,
  StackMatcherResponse,
  SkillPairingsResponse,
  SkillListItem,
  SkillsCatalogResponse,
  FilterOptionsResponse,
} from "@/types";

/**
 * Builds backend-compatible URL query string from UI filter state or GlobalFilterParams.
 * Maps URL keys:
 *  - city -> cities
 *  - contract -> contracts
 *  - education -> education
 *  - expBucket / experience -> experience
 *  - technology / technologies / hard_skills -> technologies
 *  - soft_skills -> soft_skills
 */
export function buildFilterQuery(
  filters?: GlobalFilterParams | FilterState | null,
  additionalParams: Record<string, string> = {}
): string {
  const params = new URLSearchParams();

  // Attach any additional query parameters first (e.g. skill)
  Object.entries(additionalParams).forEach(([key, val]) => {
    if (val) params.set(key, val);
  });

  if (!filters) {
    const q = params.toString();
    return q ? `?${q}` : "";
  }

  // Handle cities
  const cities = "cities" in filters ? filters.cities : "city" in filters ? filters.city : undefined;
  if (cities && cities.length > 0) {
    params.set("cities", cities.join(","));
  }

  // Handle contracts
  const contracts = "contracts" in filters ? filters.contracts : "contract" in filters ? filters.contract : undefined;
  if (contracts && contracts.length > 0) {
    params.set("contracts", contracts.join(","));
  }

  // Handle education
  const education = filters.education;
  if (education && education.length > 0) {
    params.set("education", education.join(","));
  }

  // Handle experience
  const experience = "experience" in filters ? filters.experience : "expBucket" in filters ? filters.expBucket : undefined;
  if (experience && experience.length > 0) {
    params.set("experience", experience.join(","));
  }

  // Handle technologies / hard_skills
  const technologies = "technologies" in filters ? filters.technologies : "technology" in filters ? filters.technology : "hard_skills" in filters ? filters.hard_skills : undefined;
  if (technologies && technologies.length > 0) {
    params.set("technologies", technologies.join(","));
  }

  // Handle soft_skills
  const softSkills = "soft_skills" in filters ? filters.soft_skills : undefined;
  if (softSkills && softSkills.length > 0) {
    params.set("soft_skills", softSkills.join(","));
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

/**
 * Helper to handle fetch responses with JSON error parsing
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.detail || errorJson.message || errorMessage;
    } catch {
      // Use fallback error message
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

const API_BASE = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

// ── 0. FILTER OPTIONS (Dynamic Star Schema Options) ──
export async function fetchFilterOptions(): Promise<FilterOptionsResponse> {
  const res = await fetch(`${API_BASE}/api/v1/filters/options`);
  return handleResponse<FilterOptionsResponse>(res);
}

// ── 1. MARKET PULSE (Page 1 KPIs) ──
export async function fetchMarketPulse(): Promise<MarketPulseResponse> {
  const res = await fetch(`${API_BASE}/api/v1/market-pulse`);
  return handleResponse<MarketPulseResponse>(res);
}

// ── 2. MARKET OVERVIEW (Page 1 Charts) ──
export async function fetchMarketOverview(
  filters?: GlobalFilterParams | FilterState | null
): Promise<MarketOverviewResponse> {
  const query = buildFilterQuery(filters);
  const res = await fetch(`${API_BASE}/api/v1/market-overview${query}`);
  return handleResponse<MarketOverviewResponse>(res);
}

// ── 3. DETAILED MARKET ANALYSIS (Page 2 Charts) ──
export async function fetchDetailedAnalysis(
  filters?: GlobalFilterParams | FilterState | null
): Promise<MarketAnalysisResponse> {
  const query = buildFilterQuery(filters);
  const res = await fetch(`${API_BASE}/api/v1/market-analysis${query}`);
  return handleResponse<MarketAnalysisResponse>(res);
}

// ── 4. STACK MATCHER (Page 3 Analysis) ──
export async function fetchStackMatcher(
  skills: string[],
  filters?: GlobalFilterParams | FilterState | null
): Promise<StackMatcherResponse> {
  const query = buildFilterQuery(filters);
  const res = await fetch(`${API_BASE}/api/v1/matcher/analyze${query}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ skills }),
  });
  return handleResponse<StackMatcherResponse>(res);
}

// ── 5. SKILL PAIRINGS (Page 4 Pairings) ──
export async function fetchSkillPairings(
  skill: string = "React",
  filters?: GlobalFilterParams | FilterState | null
): Promise<SkillPairingsResponse> {
  const query = buildFilterQuery(filters, { skill: skill || "React" });
  const res = await fetch(`${API_BASE}/api/v1/skills/pairings${query}`);
  return handleResponse<SkillPairingsResponse>(res);
}

// ── 6. SKILLS LIST (Page 3 & 4 Autocomplete / Chips) ──
export async function fetchSkillsList(): Promise<SkillListItem[]> {
  const res = await fetch(`${API_BASE}/api/v1/skills/list`);
  return handleResponse<SkillListItem[]>(res);
}

// ── 7. SKILLS CATALOG (Page 5) ──
export async function fetchSkillsCatalog(): Promise<SkillsCatalogResponse> {
  const res = await fetch(`${API_BASE}/api/v1/skills/catalog`);
  return handleResponse<SkillsCatalogResponse>(res);
}

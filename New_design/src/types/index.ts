export interface GlobalFilters {
  cities: string[];
  contracts: string[];
  education: string[];
  experience: string[];
  technologies: string[];
}

// PAGE 1: Market Overview
export interface MarketPulse {
  total_jobs: number;
  total_companies: number;
  total_cities: number;
  remote_flexibility_pct: number;
  avg_experience_years: number;
  last_updated: string;
  top_city?: string;
  top_skill?: string;
  avg_salary_range?: string;
}

export interface MarketOverviewData {
  contract_distribution: { name: string; count: number; pct: number }[];
  yearly_trend: { year: number; count: number }[];
  regional_hubs: { city: string; count: number }[];
  education_levels: { level: string; count: number }[];
  top_technologies: { name: string; count: number; category: string }[];
}

// PAGE 2: Detailed Analysis
export interface MarketAnalysisData {
  workplace_model: { name: string; count: number; pct: number }[];
  industry_sectors: { sector: string; count: number }[];
  city_growth_yoy: { city: string; yoy_pct: number }[];
  top_companies: { name: string; count: number }[];
  top_roles: { title: string; count: number }[];
}

// PAGE 3: Stack Matcher
export interface StackMatcherRequest {
  skills: string[];
}

export interface StackMatcherResult {
  market_match_rate_pct: number;
  top_missing_booster_skill: { skill: string; boost_pct: number };
  top_hiring_city_for_stack: { city: string; count: number };
  compatibility_score: number;
  missing_skills_roi: { skill: string; category: string; boost_pct: number }[];
  match_by_seniority: { seniority: string; count: number }[];
  matching_companies: { name: string; count: number }[];
}

// PAGE 4: Skill Pairings
export interface SkillPairing {
  skill: string;
  cooccurrence_pct: number;
  category: string;
}

export interface SkillPairingsResult {
  selected_core_skill: string;
  top_companion_skill: string;
  avg_skills_per_job: number;
  pairings: SkillPairing[];
  pairings_by_category: { category: string; count: number }[];
  top_roles_for_stack: { title: string; count: number }[];
}

export interface SkillListItem {
  name: string;
  category: string;
}

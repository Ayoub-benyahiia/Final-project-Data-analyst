// ============================================================================
// TechJob Analytics — TypeScript Type Definitions
// ============================================================================

// ── Global Filter Schemas ──
export interface GlobalFilterParams {
  cities?: string[];
  contracts?: string[];
  education?: string[];
  experience?: string[];
  technologies?: string[];
  hard_skills?: string[];
  soft_skills?: string[];
}

export interface FilterState {
  city: string[];
  contract: string[];
  education: string[];
  expBucket: string[];
  technology: string[];
  soft_skills: string[];
}

export interface FilterOptionsResponse {
  cities: string[];
  contracts: string[];
  educations: string[];
  experiences: string[];
  hard_skills: string[];
  soft_skills: string[];
}

// ── Page 1: Market Pulse & Overview ──
export interface MarketPulseResponse {
  total_jobs: number;
  total_companies: number;
  total_cities: number;
  remote_flexibility_pct: number;
  avg_experience_years: number;
  last_updated: string;
  top_city?: string | null;
  top_skill?: string | null;
}

export interface ContractDistributionItem {
  name: string;
  count: number;
  pct: number;
}

export interface YearlyTrendItem {
  year: number;
  count: number;
}

export interface RegionalHubItem {
  city: string;
  count: number;
}

export interface EducationLevelItem {
  level: string;
  count: number;
}

export interface TopTechnologyItem {
  name: string;
  count: number;
  category: string;
}

export interface MarketOverviewResponse {
  contract_distribution: ContractDistributionItem[];
  yearly_trend: YearlyTrendItem[];
  regional_hubs: RegionalHubItem[];
  education_levels: EducationLevelItem[];
  top_technologies: TopTechnologyItem[];
}

// ── Page 2: Detailed Market Analysis ──
export interface WorkplaceModelItem {
  name: string;
  count: number;
  pct: number;
}

export interface IndustrySectorItem {
  sector: string;
  count: number;
}

export interface CityGrowthYoYItem {
  city: string;
  yoy_pct: number;
}

export interface TopCompanyItem {
  name: string;
  count: number;
}

export interface TopRoleItem {
  title: string;
  count: number;
}

export interface MarketAnalysisResponse {
  workplace_model: WorkplaceModelItem[];
  industry_sectors: IndustrySectorItem[];
  city_growth_yoy: CityGrowthYoYItem[];
  top_companies: TopCompanyItem[];
  top_roles: TopRoleItem[];
}

// ── Page 3: Stack Matcher ──
export interface StackMatcherRequest {
  skills: string[];
}

export interface TopMissingBoosterSkill {
  skill: string;
  boost_pct: number;
}

export interface TopHiringCityForStack {
  city: string;
  count: number;
}

export interface MissingSkillROIItem {
  skill: string;
  category: string;
  boost_pct: number;
}

export interface MatchBySeniorityItem {
  seniority: string;
  count: number;
}

export interface MatchingCompanyItem {
  name: string;
  count: number;
}

export interface StackMatcherResponse {
  market_match_rate_pct: number;
  top_missing_booster_skill: TopMissingBoosterSkill;
  top_hiring_city_for_stack: TopHiringCityForStack;
  compatibility_score: number;
  missing_skills_roi: MissingSkillROIItem[];
  match_by_seniority: MatchBySeniorityItem[];
  matching_companies: MatchingCompanyItem[];
}

// ── Page 4: Skill Pairings ──
export interface SkillPairingItem {
  skill: string;
  cooccurrence_pct: number;
  category: string;
}

export interface PairingsByCategoryItem {
  category: string;
  count: number;
}

export interface TopRoleForStackItem {
  title: string;
  count: number;
}

export interface SkillPairingsResponse {
  selected_core_skill: string;
  top_companion_skill: string;
  avg_skills_per_job: number;
  pairings: SkillPairingItem[];
  pairings_by_category: PairingsByCategoryItem[];
  top_roles_for_stack: TopRoleForStackItem[];
}

export interface SkillListItem {
  name: string;
  category: string;
}

// ── Page 5: Skills Catalog ──
export interface HardSkillCatalogItem {
  name: string;
  category: string;
  count: number;
  percentage: number;
}

export interface SoftSkillCatalogItem {
  name: string;
  count: number;
  percentage: number;
}

export interface SkillsCatalogResponse {
  total_hard_skills: number;
  total_soft_skills: number;
  hard_skills: HardSkillCatalogItem[];
  soft_skills: SoftSkillCatalogItem[];
}

// ── UI Helper Types ──
export interface KPIData {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: string;
  color: "indigo" | "cyan" | "emerald" | "rose" | "amber";
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface StackPreset {
  name: string;
  technologies: string[];
  icon: string;
}

export interface JobRecord {
  id: string;
  title: string;
  company: string;
  city: string;
  contract: string;
  education: string;
  expBucket: string;
  technology: string[];
  postedAt: string;
  workplaceModel: string;
  industry: string;
  seniority: string;
}

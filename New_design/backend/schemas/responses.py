from typing import List, Dict, Any, Optional
from pydantic import BaseModel

# ── PAGE 1: Market Overview ──
class MarketPulseResponse(BaseModel):
    total_jobs: int
    total_companies: int
    total_cities: int
    remote_flexibility_pct: float
    avg_experience_years: float
    last_updated: str
    top_city: Optional[str] = None
    top_skill: Optional[str] = None

class ContractDistributionItem(BaseModel):
    name: str
    count: int
    pct: float

class YearlyTrendItem(BaseModel):
    year: int
    count: int

class RegionalHubItem(BaseModel):
    city: str
    count: int

class EducationLevelItem(BaseModel):
    level: str
    count: int

class TopTechnologyItem(BaseModel):
    name: str
    count: int
    category: str

class MarketOverviewResponse(BaseModel):
    contract_distribution: List[ContractDistributionItem]
    yearly_trend: List[YearlyTrendItem]
    regional_hubs: List[RegionalHubItem]
    education_levels: List[EducationLevelItem]
    top_technologies: List[TopTechnologyItem]

# ── PAGE 2: Detailed Analysis ──
class WorkplaceModelItem(BaseModel):
    name: str
    count: int
    pct: float

class IndustrySectorItem(BaseModel):
    sector: str
    count: int

class CityGrowthYoYItem(BaseModel):
    city: str
    yoy_pct: float

class TopCompanyItem(BaseModel):
    name: str
    count: int

class TopRoleItem(BaseModel):
    title: str
    count: int

class MarketAnalysisResponse(BaseModel):
    workplace_model: List[WorkplaceModelItem]
    industry_sectors: List[IndustrySectorItem]
    city_growth_yoy: List[CityGrowthYoYItem]
    top_companies: List[TopCompanyItem]
    top_roles: List[TopRoleItem]

# ── PAGE 3: Stack Matcher ──
class TopMissingBoosterSkill(BaseModel):
    skill: str
    boost_pct: float

class TopHiringCityForStack(BaseModel):
    city: str
    count: int

class MissingSkillROIItem(BaseModel):
    skill: str
    category: str
    boost_pct: float

class MatchBySeniorityItem(BaseModel):
    seniority: str
    count: int

class MatchingCompanyItem(BaseModel):
    name: str
    count: int

class StackMatcherResponse(BaseModel):
    market_match_rate_pct: float
    top_missing_booster_skill: TopMissingBoosterSkill
    top_hiring_city_for_stack: TopHiringCityForStack
    compatibility_score: int
    missing_skills_roi: List[MissingSkillROIItem]
    match_by_seniority: List[MatchBySeniorityItem]
    matching_companies: List[MatchingCompanyItem]

# ── PAGE 4: Skill Pairings ──
class SkillPairingItem(BaseModel):
    skill: str
    cooccurrence_pct: float
    category: str

class PairingsByCategoryItem(BaseModel):
    category: str
    count: int

class TopRoleForStackItem(BaseModel):
    title: str
    count: int

class SkillPairingsResponse(BaseModel):
    selected_core_skill: str
    top_companion_skill: str
    avg_skills_per_job: float
    pairings: List[SkillPairingItem]
    pairings_by_category: List[PairingsByCategoryItem]
    top_roles_for_stack: List[TopRoleForStackItem]

class SkillListItem(BaseModel):
    name: str
    category: str

# ── PAGE 5: Skills Catalog ──
class HardSkillCatalogItem(BaseModel):
    name: str
    category: str
    count: int
    percentage: float

class SoftSkillCatalogItem(BaseModel):
    name: str
    count: int
    percentage: float

class SkillsCatalogResponse(BaseModel):
    total_hard_skills: int
    total_soft_skills: int
    hard_skills: List[HardSkillCatalogItem]
    soft_skills: List[SoftSkillCatalogItem]


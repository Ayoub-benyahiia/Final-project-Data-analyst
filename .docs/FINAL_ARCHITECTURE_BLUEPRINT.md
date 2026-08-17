# TechJob Analytics — Final Architecture Blueprint & Prototype Specification

> **Status:** Blueprint · **Target:** Production-ready monolithic-free decoupled SaaS  
> **Scope:** Frontend (React 19) · Backend (FastAPI) · Data Pipeline (Python Star Schema)  
> **Date:** July 2026

---

## Table of Contents

1. [Current Reality (State of the App)](#1-current-reality-state-of-the-app)
2. [Target Directory Architecture](#2-target-directory-architecture)
3. [Component Decoupling Map](#3-component-decoupling-map)
4. [Data Contracts (TypeScript & Pydantic)](#4-data-contracts-typescript--pydantic)
5. [Backend API Blueprint](#5-backend-api-blueprint)
6. [State Management & Data Flow](#6-state-management--data-flow)
7. [UI Theme System (Tailwind Configuration)](#7-ui-theme-system-tailwind-configuration)
8. [Dark Mode Architecture](#8-dark-mode-architecture)
9. [Phase-by-Phase Roadmap (Tabs 2–7)](#9-phase-by-phase-roadmap-tabs-2-7)
10. [Data Pipeline Integration Strategy](#10-data-pipeline-integration-strategy)
11. [Testing & Quality Gates](#11-testing--quality-gates)
12. [Glossary & Conventions](#12-glossary--conventions)

---

## 1. Current Reality (State of the App)

### 1.1 Workspace Layout

```
TechJob_SaaS_App/
├── .cursorrules                              # Project constitution
├── .gitignore                                # Root exclusions
├── .docs/
│   ├── dashboard-overview-spec.md            # Phase 2 extraction spec
│   └── FINAL_ARCHITECTURE_BLUEPRINT.md       ← THIS FILE
│
├── New_design/                               # Main application bundle
│   ├── backend/
│   │   ├── main.py                           # FastAPI (674 lines, all mock data)
│   │   └── requirements.txt                  # fastapi, uvicorn, cachetools, pydantic
│   ├── src/
│   │   ├── App.tsx                           # Landing page + view router (712 lines)
│   │   ├── main.tsx                          # Entry point + QueryClientProvider
│   │   ├── index.css                         # Tailwind v4 + theme tokens + dark mode (347 lines)
│   │   ├── types.ts                          # Shared interfaces (67 lines)
│   │   ├── data.ts                           # Static mock data (119 lines)
│   │   ├── lib/
│   │   │   └── react-query-client.ts         # QueryClient config (20 lines)
│   │   ├── hooks/
│   │   │   └── useDashboardData.ts           # 6 React Query hooks (173 lines)
│   │   └── components/
│   │       ├── TechJobDashboard.tsx          # MONOLITHIC: 1383 lines, 7 tabs
│   │       ├── DashboardOverview.tsx         # ✅ Extracted (Tab 1, 227 lines)
│   │       ├── FaqSection.tsx
│   │       ├── InteractiveSandbox.tsx
│   │       ├── Pricing.tsx
│   │       ├── ROIcalc.tsx
│   │       └── Testimonials.tsx
│   ├── package.json                          # React 19, Vite 6, TanStack Query 5
│   ├── vite.config.ts                        # Tailwind v4 plugin + @/ alias
│   └── tsconfig.json
│
└── projet-data-maroc-tech/                   # Data pipeline (Python)
    ├── notebooks/
    │   ├── build_star_schema_v2.py           # 13-table star schema generator
    │   ├── 01_eda.ipynb
    │   ├── 01_eda_annote.ipynb
    │   └── scrap.ipynb
    └── data/                                 # CSV files (gitignored)
```

### 1.2 Tab Status & Data Source Audit

| # | Tab | File | Lines | Data Source | Status |
|---|-----|------|-------|-------------|--------|
| 1 | **Dashboard Overview** | `DashboardOverview.tsx` | 227 | `useDashboardKpis` + `useGrowthData` (real API) | ✅ Extracted |
| 2 | **Technology Radar** | `TechJobDashboard.tsx:782-891` | ~110 | `computedTechnologies` (mock), `radarSkillProfileData` (mock), `techContractMatrix` (mock) | ❌ Inline |
| 3 | **Career & Education** | `TechJobDashboard.tsx:896-1050` | ~155 | `experienceRequirementsOverTimeData` (mock), `educationLevelByCityData` (mock), static cards (mock) | ❌ Inline |
| 4 | **Saved Reports** | `TechJobDashboard.tsx:1055-1083` | ~29 | Empty state placeholder | ❌ Placeholder |
| 5 | **Employers Directory** | `TechJobDashboard.tsx:1088-1162` | ~75 | `computedCompanies` from `companiesData` (mock + search filter) | ❌ Inline |
| 6 | **Geospatial Density** | `TechJobDashboard.tsx:1167-1276` | ~110 | `computedCities` from `baseCities` (mock + filter multiplier) | ❌ Inline |
| 7 | **Macro Trends** | `TechJobDashboard.tsx:1281-1374` | ~94 | `monthlyPostingTrendData` (mock), `yoyComparisonData` (mock) | ❌ Inline |

### 1.3 Backend Reality

- **22 endpoints** defined in `main.py`
- **100% mock data** — all endpoints return hardcoded JSON
- **TTLCache** (10-min TTL) wrapper on every endpoint, but cache is pointless since data never changes
- **6 of 22 endpoints** are actually consumed by frontend hooks (`/api/growth-data`, `/api/tech-radar`, `/api/companies`, `/api/market-metrics`, `/api/top-skills`, `/api/dashboard-kpis`)
- **Filter parameters accepted but ignored** — city/tech/experience filters are passed in query strings but no actual filtering occurs
- **Duplicate endpoints** exist (e.g., `/api/kpis` overlaps with `/api/dashboard-kpis`; `/api/analytics/companies` overlaps with `/api/companies`)
- **No real database connection** — per `.cursorrules`, this is intentional (CSV + Pandas layer)

### 1.4 Frontend Monolith Hotspots

| Issue | Location | Impact |
|-------|----------|--------|
| `filterMultiplier` engine | Lines 184–216 | Simulates filter effects client-side; replaced by real API filtering in target |
| 10 inline mock arrays | Lines 136–395 | ~500 lines of dead data that must be migrated to backend |
| 8 `useMemo` computed values | Lines 219–368 | All derived from `filterMultiplier`; eliminated when API serves filtered data |
| Conditional rendering of 7 tabs | Lines 773–1374 | Each tab's JSX is ~30–155 lines inside the parent component |
| All hooks destructured only for loading/error | Lines 91–96 | Hook data (growthData, techRadarData, etc.) declared but never rendered directly |
| Recharts imports for all charts | Lines 33–49 | 16 components imported; some only used in specific tabs |
| Search + notification state at dashboard level | Lines 58–71 | Shared across tabs; stays in parent but should be formalized as props interface |

### 1.5 Data Pipeline (projet-data-maroc-tech)

The star schema is **production-complete** (13 CSV tables):
- **Dimensions (9):** date, city, contract, education, experience, entreprise, tech, soft_skills, languages
- **Fact (1):** fact_offres (10,782 rows)
- **Bridges (3):** tech, soft_skills, languages
- **Integrity:** 0 orphans, 0 NaN in all keys (verified by `verify_integrity()`)

This is the **real data source** that the backend must read. Currently the backend bypasses it entirely with mock data.

---

## 2. Target Directory Architecture

The guiding principle: **every component is a file, every concern is a folder, no file > 400 lines**.

### 2.1 Frontend (`New_design/src/`)

```
src/
├── App.tsx                              # Landing page (keep, refactor to < 500 lines)
├── main.tsx                             # Entry point (keep)
├── index.css                            # Tailwind v4 + theme tokens (keep)
│
├── types/
│   ├── index.ts                         # All shared interfaces (current types.ts, grow)
│   ├── api.ts                           # API response wrappers (ApiResponse<T>, etc.)
│   ├── dashboard.ts                     # DashboardOverview types (DashboardKpis, KpiCard)
│   ├── radar.ts                         # TechRadar types (TechRadarItem, RadarSkillPoint)
│   ├── companies.ts                     # Employer types (Company, CompanyFilters)
│   ├── geography.ts                     # Geospatial types (CityDensity, GeoPoint)
│   ├── trends.ts                        # Macro trends types (TrendPoint, YoYComparison)
│   └── filters.ts                       # FilterParams + filter option types
│
├── hooks/
│   ├── useDashboardData.ts              # KEEP: all 6 React Query hooks
│   │   └── (Add endpoint hooks as each tab is extracted)
│   ├── useTopSkills.ts                  # Tab 2-7: extract from useDashboardData when needed
│   ├── useCompaniesData.ts              # Tab 5
│   ├── useGeoData.ts                    # Tab 6
│   └── useTrendsData.ts                 # Tab 7
│
├── lib/
│   ├── react-query-client.ts            # KEEP
│   └── api.ts                           # API_BASE_URL, fetch wrapper, error helpers
│
├── components/
│   ├── dashboard/
│   │   ├── TechJobDashboard.tsx         # REFACTOR: shell only (sidebar, filter bar, tab router)
│   │   ├── Sidebar.tsx                  # EXTRACT: navigation panel
│   │   ├── FilterBar.tsx                # EXTRACT: filter controls row
│   │   └── DashboardNotification.tsx    # EXTRACT: toast notification component
│   │
│   ├── overview/                        # Tab 1 — ✅ Done
│   │   └── DashboardOverview.tsx        # KEEP (227 lines)
│   │
│   ├── radar/                           # Tab 2 — CREATE
│   │   ├── TechRadar.tsx                # Orchestrator
│   │   ├── TechnologyVolumeChart.tsx    # Bar chart (extracted from current radar tab)
│   │   ├── SkillProfileRadar.tsx        # Recharts RadarChart
│   │   └── TechContractMatrix.tsx       # Table component
│   │
│   ├── career/                          # Tab 3 — CREATE
│   │   ├── CareerInsights.tsx           # Orchestrator
│   │   ├── SeniorityCards.tsx           # 5 seniority level cards
│   │   ├── ExperienceTrendChart.tsx     # Line chart: experience over time
│   │   ├── EducationBarChart.tsx        # Stacked bar chart: education by city
│   │   └── DegreeDistribution.tsx       # Stats grid
│   │
│   ├── reports/                         # Tab 4 — CREATE
│   │   └── SavedReports.tsx             # Placeholder → full export/archive UI
│   │
│   ├── employers/                       # Tab 5 — CREATE
│   │   ├── EmployersDirectory.tsx       # Orchestrator
│   │   ├── EmployerSearchBar.tsx        # Search + filter row
│   │   └── EmployerCard.tsx             # Individual company card
│   │
│   ├── geography/                       # Tab 6 — CREATE
│   │   ├── GeoDensity.tsx               # Orchestrator
│   │   ├── CityBarChart.tsx             # Horizontal bar chart
│   │   ├── CityRankingList.tsx          # Ranked list sidebar
│   │   └── GeoKpiCards.tsx              # Bottom KPI row
│   │
│   ├── trends/                          # Tab 7 — CREATE
│   │   ├── MacroTrends.tsx              # Orchestrator
│   │   ├── TrendMetricCards.tsx         # 4 KPI metric cards
│   │   ├── MonthlyVolumeChart.tsx       # AreaChart
│   │   └── YoYComparisonTable.tsx       # Year-over-year table
│   │
│   ├── shared/                          # Shared UI primitives
│   │   ├── ChartTooltip.tsx             # Neo-brutalist tooltip wrapper
│   │   ├── Skeleton.tsx                 # Reusable skeleton loader
│   │   ├── ErrorBanner.tsx              # Reusable error + retry
│   │   ├── EmptyState.tsx               # Reusable empty state
│   │   ├── GradientDefs.tsx             # Recharts gradient definitions
│   │   └── KpiCard.tsx                  # Generic KPI card (used by tabs 1, 3, 7)
│   │
│   └── landing/                         # Landing page sections (EXTRACT from App.tsx)
│       ├── HeroSection.tsx
│       ├── ValueProposition.tsx
│       ├── PipelineSection.tsx
│       └── FooterSection.tsx
│
├── constants/
│   ├── filters.ts                       # Filter option arrays (city list, tech list, etc.)
│   ├── theme.ts                         # Color palette constants
│   └── routes.ts                        # Tab definitions + icon mappings
│
└── utils/
    ├── format.ts                        # Number/currency formatters
    └── cn.ts                            # Class name utility (clsx + tailwind-merge)
```

### 2.2 Backend (`New_design/backend/`)

```
backend/
├── main.py                              # KEEP: app factory, CORS, router includes
├── requirements.txt                     # Add: pandas, numpy (for CSV reads)
├── config.py                            # Settings: CSV paths, cache TTL, CORS origins
├── models/
│   ├── __init__.py
│   ├── filters.py                       # FilterParams Pydantic model (shared)
│   ├── dashboard.py                     # DashboardKpis, GrowthDataPoint
│   ├── radar.py                         # TechRadarItem, RadarSkillProfile
│   ├── companies.py                     # Company, CompanyFilters
│   └── trends.py                        # TrendPoint, YoYComparison
├── routers/
│   ├── __init__.py
│   ├── dashboard.py                     # /api/dashboard-kpis, /api/growth-data
│   ├── radar.py                         # /api/tech-radar, /api/radar-skills
│   ├── companies.py                     # /api/companies
│   ├── geography.py                     # /api/cities, /api/geo-map
│   └── trends.py                        # /api/trends, /api/yoy-comparison
├── services/
│   ├── __init__.py
│   ├── csv_reader.py                    # Star schema CSV loader (cached)
│   ├── kpi_service.py                   # Dashboard KPI aggregations
│   ├── filter_service.py                # Filter application logic
│   └── cache_service.py                 # Cache key generation (from current main.py)
└── data/                                # Symlink or copy of star schema CSVs
    ├── dim_city.csv
    ├── dim_tech.csv
    ├── fact_offres.csv
    └── ...
```

### 2.3 Data Pipeline (`projet-data-maroc-tech/`)

```
projet-data-maroc-tech/
├── notebooks/                           # KEEP: ETL notebooks (gitignored outputs)
├── data/
│   ├── raw/                             # Raw scraped CSVs
│   ├── clean/                           # Cleaned intermediate CSVs
│   └── star_schema/                     # 13 production CSV tables ← Backend reads from here
└── scripts/                             # CREATE: automation scripts
    ├── run_pipeline.py                  # End-to-end: scrape → clean → star schema
    └── export_to_api.py                 # Copy star_schema/ → backend/data/
```

---

## 3. Component Decoupling Map

### 3.1 TechJobDashboard.tsx Refactoring Plan

**Current:** One monolithic file (1383 lines) managing sidebar, filters, 7 tab views, mock data, computed values, and notifications.

**Target:** A thin shell component that orchestrates:

```
TechJobDashboard.tsx (target: ~200 lines)
├── State: activeTab, filters, searchQuery, notification
├── Renders:
│   ├── <Sidebar activeTab onChangeTab onBackToHome />
│   ├── <FilterBar filters onFilterChange onReset />
│   ├── <DashboardNotification message />
│   └── {activeTab === 'dashboard' && <DashboardOverview filters={filters} />}
│   └── {activeTab === 'radar' && <TechRadar filters={filters} />}
│   └── {activeTab === 'insights' && <CareerInsights filters={filters} />}
│   └── {activeTab === 'reports' && <SavedReports filters={filters} />}
│   └── {activeTab === 'companies' && <EmployersDirectory filters={filters} />}
│   └── {activeTab === 'geo' && <GeoDensity filters={filters} />}
│   └── {activeTab === 'trends' && <MacroTrends filters={filters} />}
```

**Props interface for all tab components:**
```typescript
interface TabProps {
  filters: FilterParams;
}
```

Each tab component owns its data fetching, loading/error/empty states, and rendering.

### 3.2 Mock Data Migration Strategy

Every inline mock array in `TechJobDashboard.tsx` maps to a backend endpoint:

| Mock Array | Lines | Consumed By | Target Endpoint | Phase |
|-----------|-------|-------------|-----------------|-------|
| `companiesData` | 136–147 | Tab 5 | `GET /api/companies` | Phase 3 |
| `baseTechnologies` | 151–165 | Tab 2 | `GET /api/tech-radar` | Phase 2 |
| `baseCities` | 169–181 | Tab 6 | `GET /api/cities` | Phase 4 |
| `radarSkillProfileData` | 295–302 | Tab 2 | `GET /api/radar-skills` | Phase 2 |
| `techContractMatrix` | 305–316 | Tab 2 | `GET /api/tech-contract-matrix` | Phase 2 |
| `experienceRequirementsOverTimeData` | 319–331 | Tab 3 | `GET /api/experience-trends` | Phase 2 |
| `educationLevelByCityData` | 334–340 | Tab 3 | `GET /api/education-by-city` | Phase 2 |
| `yoyComparisonData` | 343–355 | Tab 7 | `GET /api/yoy-comparison` | Phase 4 |
| `monthlyPostingTrendData` | 281–292 | Tab 7 | `GET /api/monthly-trends` | Phase 4 |
| `filterMultiplier` engine | 184–216 | All tabs | Backend-native filtering | All phases |

### 3.3 Each Component's Contract

Every extracted tab component must handle **4 states** (matching `DashboardOverview`'s pattern):

| State | UI Rendering |
|-------|-------------|
| `isLoading` | Skeleton placeholders (shared `<Skeleton />` component) |
| `isError` | `<ErrorBanner message retryFn />` |
| Empty/null data | `<EmptyState message />` or muted fallback values |
| Success | Real data rendering |

---

## 4. Data Contracts (TypeScript & Pydantic)

### 4.1 TypeScript Interfaces (`src/types/`)

#### `api.ts` — Generic Wrappers

```typescript
// Every endpoint returns this shape
export interface ApiResponse<T> {
  data: T;
  filters: Record<string, string | boolean>;
}

// Filter-aware query parameters
export interface FilterParams {
  city?: string;          // 'All' | city name
  tech?: string;          // 'All' | tech name
  experience?: string;    // 'All' | 'Débutant' | 'Junior' | 'Intermédiaire' | 'Confirmé' | 'Expert'
  contract?: string;      // 'All' | 'CDI' | 'CDD' | 'Freelance' | 'Stage'
  education?: string;     // 'All' | 'Bac' | 'Bac+2' | 'Bac+3' | 'Bac+5' | 'Doctorat'
  remote_only?: boolean;
  search?: string;
}
```

#### `dashboard.ts` — Tab 1 (existing)

```typescript
export interface DashboardKpis {
  totalOffers: number;
  newThisWeek: number;
  avgSalary: number;
  remotePercentage: number;
  topCompanies: string[];
}

export interface GrowthDataPoint {
  year: string;
  Casablanca: number;
  Rabat: number;
  Tangier: number;
  Marrakech: number;
}

export interface KpiCard {
  label: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'stable';
  accentColor: 'rose' | 'zinc' | 'emerald' | 'blue';
}
```

#### `radar.ts` — Tab 2

```typescript
export interface TechRadarItem {
  name: string;
  growth: number;           // YoY growth percentage
  volume: number;           // Total job posting count
  avgSalary: number;        // MAD/month
  experienceLevel: 'Junior' | 'Mid' | 'Senior' | 'Lead';
}

export interface RadarSkillPoint {
  subject: string;          // Tech name
  Junior: number;           // 0–100 demand score
  Mid: number;
  Senior: number;
}

export interface TechContractRow {
  tech: string;
  cdi: number;
  cdd: number;
  freelance: number;
  stage: number;
}
```

#### `career.ts` — Tab 3

```typescript
export interface SenioritySegment {
  title: string;            // 'Intermédiaire', 'Confirmé', etc.
  offers: number;
  share: number;            // Percentage of total market
  topTechs: string[];
}

export interface ExperienceTrendPoint {
  year: string;
  CDI: number;              // Average years of experience
  CDD: number;
  Freelance: number;
  Stage: number;
}

export interface EducationByCity {
  city: string;
  Bac: number;
  'Bac+2': number;
  'Bac+3': number;
  'Bac+5': number;
  Doctorat: number;
}
```

#### `companies.ts` — Tab 5

```typescript
export interface Company {
  id: number;
  name: string;
  segment: string;
  openPositions: number;
  topTechs: string[];
  city: string;
  tags: string[];
}
```

#### `geography.ts` — Tab 6

```typescript
export interface CityDensity {
  name: string;
  count: number;            // Job posting count
  percentage: number;       // Market share %
  region?: string;          // Administrative region
}

export interface GeoMapPoint {
  city: string;
  lat: number;
  lng: number;
  count: number;
}
```

#### `trends.ts` — Tab 7

```typescript
export interface TrendMetric {
  title: string;
  value: string;
  note: string;
  color: string;
}

export interface MonthlyTrendPoint {
  month: string;            // 'Jan', 'Feb', etc.
  offers: number;
}

export interface YoYComparison {
  year: string;
  posts: number;
  growth: string;           // '+1.0%', '-19.4%', '—'
  tech: string;
  city: string;
}
```

### 4.2 Pydantic Models (`backend/models/`)

These mirror the TypeScript interfaces exactly:

```python
# models/filters.py
class FilterParams(BaseModel):
    city: Optional[str] = "All"
    tech: Optional[str] = "All"
    experience: Optional[str] = "All"
    contract: Optional[str] = "All"
    education: Optional[str] = "All"
    remote_only: Optional[bool] = False
    search: Optional[str] = None

# models/dashboard.py
class DashboardKpis(BaseModel):
    totalOffers: int
    newThisWeek: int
    avgSalary: float
    remotePercentage: float
    topCompanies: List[str]

class GrowthDataPoint(BaseModel):
    year: str
    Casablanca: int
    Rabat: int
    Tangier: int
    Marrakech: int

# models/radar.py
class TechRadarItem(BaseModel):
    name: str
    growth: float
    volume: int
    avgSalary: int
    experienceLevel: str

class RadarSkillPoint(BaseModel):
    subject: str
    Junior: float
    Mid: float
    Senior: float

# models/companies.py
class Company(BaseModel):
    id: int
    name: str
    segment: str
    openPositions: int
    topTechs: List[str]
    city: str
    tags: List[str]

# models/trends.py
class TrendPoint(BaseModel):
    month: str
    offers: int

class YoYComparison(BaseModel):
    year: str
    posts: int
    growth: str
    tech: str
    city: str
```

---

## 5. Backend API Blueprint

### 5.1 Target Endpoint Inventory

Consolidated from the current 22 endpoints to 16 distinct endpoints, each backed by real CSV data:

| Method | Endpoint | Response Type | Tab | Priority |
|--------|----------|---------------|-----|----------|
| GET | `/api/dashboard-kpis` | `ApiResponse<DashboardKpis>` | 1 | ✅ Existing |
| GET | `/api/growth-data` | `ApiResponse<GrowthDataPoint[]>` | 1 | ✅ Existing |
| GET | `/api/tech-radar` | `ApiResponse<TechRadarItem[]>` | 2 | Phase 2 |
| GET | `/api/radar-skills` | `ApiResponse<RadarSkillPoint[]>` | 2 | Phase 2 |
| GET | `/api/tech-contract-matrix` | `ApiResponse<TechContractRow[]>` | 2 | Phase 2 |
| GET | `/api/experience-trends` | `ApiResponse<ExperienceTrendPoint[]>` | 3 | Phase 2 |
| GET | `/api/education-by-city` | `ApiResponse<EducationByCity[]>` | 3 | Phase 2 |
| GET | `/api/seniority-segments` | `ApiResponse<SenioritySegment[]>` | 3 | Phase 2 |
| GET | `/api/reports/saved` | `ApiResponse<SavedReport[]>` | 4 | Phase 3 |
| GET | `/api/companies` | `ApiResponse<Company[]>` | 5 | ✅ Existing |
| GET | `/api/cities` | `ApiResponse<CityDensity[]>` | 6 | Phase 3 |
| GET | `/api/geo-map` | `ApiResponse<GeoMapPoint[]>` | 6 | Phase 3 |
| GET | `/api/monthly-trends` | `ApiResponse<MonthlyTrendPoint[]>` | 7 | Phase 4 |
| GET | `/api/yoy-comparison` | `ApiResponse<YoYComparison[]>` | 7 | Phase 4 |
| GET | `/api/trend-metrics` | `ApiResponse<TrendMetric[]>` | 7 | Phase 4 |
| GET | `/health` | `{ status, cache_size }` | — | ✅ Existing |

### 5.2 CSV-Backed Service Layer

Replace all mock data with actual aggregations from the star schema CSVs:

```python
# services/csv_reader.py
import pandas as pd
from cachetools import TTLCache
from pathlib import Path

STAR_SCHEMA_DIR = Path(__file__).parent.parent / "data"

class CsvDataStore:
    def __init__(self, cache_ttl=300):
        self.cache = TTLCache(maxsize=100, ttl=cache_ttl)
        self._tables = {}

    def load_table(self, name: str) -> pd.DataFrame:
        """Lazy-load a star schema CSV with caching."""
        if name not in self._tables:
            path = STAR_SCHEMA_DIR / f"{name}.csv"
            self._tables[name] = pd.read_csv(path)
        return self._tables[name]

    def get_fact_offres(self) -> pd.DataFrame:
        return self.load_table("fact_offres")

    def get_dim_city(self) -> pd.DataFrame:
        return self.load_table("dim_city")

    def get_dim_tech(self) -> pd.DataFrame:
        return self.load_table("dim_tech")
```

### 5.3 Filter Application Pattern

Every endpoint applies filters the same way:

```python
# services/filter_service.py
def apply_filters(fact: pd.DataFrame, filters: FilterParams) -> pd.DataFrame:
    """Generic filter application for the fact table."""
    df = fact.copy()
    if filters.city != "All":
        df = df[df["city_id"] == city_map[filters.city]]
    if filters.tech != "All":
        # Filter via bridge_tech
        ...
    if filters.experience != "All":
        df = df[df["exp_id"] == exp_map[filters.experience]]
    if filters.contract != "All":
        df = df[df["contract_id"] == contract_map[filters.contract]]
    return df
```

### 5.4 Cache Strategy (Preserved from current)

- **Layer 1 (Backend):** `TTLCache` with 10-min TTL, keyed by endpoint + sorted filter params
- **Layer 2 (Frontend):** TanStack Query `staleTime: 5min`, `gcTime: 10min`, keyed by `queryKey` with filter params
- **Cache invalidation:** `invalidateDashboardQueries()` on manual refresh or filter reset

---

## 6. State Management & Data Flow

### 6.1 Principle

**No global state store.** All state is managed through:
1. React built-in `useState` (filter values, active tab, UI toggles)
2. TanStack Query cache (server state — API responses)
3. Props drilling from `TechJobDashboard` → tab components (filters only)

### 6.2 Data Flow Diagram

```
User Interaction (filter change, tab switch)
        │
        ▼
TechJobDashboard.tsx (shell)
├── useState: activeTab, filters[]       ◄── local state
├── useMemo: filters (aggregated object) ◄── derived
│
├── Passes filters as props ▼
│
├── DashboardOverview (Tab 1)
│   └── useDashboardKpis(filters)       ◄── TanStack Query
│   └── useGrowthData(filters)          ◄── if stale, refetch; else cache
│
├── TechRadar (Tab 2)
│   └── useTechRadar(filters)           ◄── TanStack Query
│   └── useTopSkills(filters)           ◄── TanStack Query
│
├── CareerInsights (Tab 3)
│   └── useMarketMetrics(filters)       ◄── TanStack Query
│   └── useExperienceTrends(filters)    ◄── NEW hook
│
├── EmployersDirectory (Tab 5)
│   └── useCompanies(filters)           ◄── TanStack Query
│
└── ... (tabs 4, 6, 7 follow same pattern)
```

### 6.3 Hook Ownership Strategy

**Current:** All 6 hooks centralized in `useDashboardData.ts`.  
**Target:** One hook file per domain, but **shared query keys** to enable cross-tab cache hits:

```
useDashboardData.ts        # KEEP: useDashboardKpis, useGrowthData
  ├── queryKey: ['dashboardKpis', filters]
  └── queryKey: ['growthData', filters]

useTechRadar.ts            # NEW: useTechRadar, useRadarSkills, useTechContractMatrix
  ├── queryKey: ['techRadar', filters]
  ├── queryKey: ['radarSkills', filters]
  └── queryKey: ['techContractMatrix', filters]

useCareerData.ts           # NEW: useExperienceTrends, useEducationByCity, useSenioritySegments
  ├── queryKey: ['experienceTrends', filters]
  ├── queryKey: ['educationByCity', filters]
  └── queryKey: ['senioritySegments', filters]

useGeoData.ts              # NEW: useCityDensity, useGeoMap
  ├── queryKey: ['cityDensity', filters]
  └── queryKey: ['geoMap', filters]

useTrendsData.ts           # NEW: useMonthlyTrends, useYoYComparison, useTrendMetrics
  ├── queryKey: ['monthlyTrends', filters]
  ├── queryKey: ['yoyComparison', filters]
  └── queryKey: ['trendMetrics', filters]
```

The centralized `invalidateDashboardQueries()` utility expands to include all new query keys.

### 6.4 Error Handling Pattern (Consistent Across All Tabs)

```typescript
// Each tab component follows this pattern:
function SomeTab({ filters }: TabProps) {
  const { data, isLoading, isError, error, refetch } = useSomeQuery(filters);

  // Loading state
  if (isLoading) return <Skeleton variant="card" count={4} />;

  // Error state
  if (isError) return <ErrorBanner message={error.message} onRetry={refetch} />;

  // Empty state
  if (!data?.data || data.data.length === 0) return <EmptyState message="No data for selected filters" />;

  // Success state
  return <RealUI data={data.data} />;
}
```

---

## 7. UI Theme System (Tailwind Configuration)

### 7.1 Current System (To Preserve)

The current `index.css` uses CSS custom properties for theme switching (not Tailwind's `dark:` variant). This is a deliberate choice per `.cursorrules` and must be preserved.

**Current approach:**
- Light mode: cream/sand backgrounds, zinc-950/900/800 text, rose-600 accents
- Dark mode: black backgrounds, white text, canary yellow (#ffde43) accents
- All colors via CSS variables with `!important` overrides
- Neo-brutalist design tokens: `border-bold` (3px), `border-bold-thin` (1.5px), `shadow-hard` (4px offset), `shadow-hard-sm` (2px offset)

### 7.2 Design Token Reference

| Token | Light Value | Dark Value | Usage |
|-------|------------|-----------|-------|
| `--cream` | `#fcfbf7` | `#000000` | Page background |
| `--sand` | `#f3f0e6` | `#09090b` | Sidebar, section backgrounds |
| `--border-color` | `#09090b` | `#ffffff` | All borders |
| `--text-primary` | `#09090b` | `#ffffff` | Primary text |
| `--card-bg` | `#ffffff` | `#121212` | Card backgrounds |
| `--btn-bg` | `#09090b` | `#ffffff` | Primary button bg |
| `--btn-text` | `#ffffff` | `#000000` | Primary button text |
| `--shadow-color` | `#09090b` | `#ffffff` | Box shadow color |
| `--glass-bg` | `rgba(243,240,230,0.85)` | `rgba(0,0,0,0.9)` | Glassmorphism |

### 7.3 Shared Component Styling

Define reusable class groups in `index.css`:

```css
/* ── Card primitives ── */
.card {
  background-color: var(--card-bg) !important;
  border: 3px solid var(--border-color) !important;
  border-radius: 0.75rem;
  box-shadow: 4px 4px 0px 0px var(--border-color) !important;
}

.card-sm {
  border-width: 1.5px !important;
  box-shadow: 2px 2px 0px 0px var(--border-color) !important;
}

/* ── Skeleton loading ── */
.skeleton {
  background-color: var(--zinc-200) !important;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  border-radius: 0.75rem;
}

/* ── Accent bars ── */
.accent-bar-rose {
  background-color: #e11d48 !important;
}
.accent-bar-zinc {
  background-color: var(--border-color) !important;
}
.accent-bar-emerald {
  background-color: #059669 !important;
}
.accent-bar-blue {
  background-color: #2563eb !important;
}
```

---

## 8. Dark Mode Architecture

### 8.1 Current Implementation (Keep)

- CSS custom properties on `:root` (light) and `.dark` (dark)
- Toggle via `localStorage` with `'theme'` key
- `useState<boolean>` in `App.tsx`, propagated via props
- All colors use `var(--variable)` with `!important` overrides

### 8.2 Enhancement: Systematic Color Mapping

The current dark mode colors are inconsistent (mixes of canary yellow, stark white, and custom tints). Standardize to:

| Light Token | Dark Token | Purpose |
|------------|-----------|---------|
| `rose-600` (`#e11d48`) | Canary Yellow (`#ffde43`) | Primary accent: active tab, badges, chart lines |
| `emerald-600` (`#059669`) | White (`#ffffff`) | Positive indicators, growth metrics |
| `blue-600` (`#2563eb`) | White (`#ffffff`) | Secondary charts, information icons |
| `zinc-950` (`#09090b`) | White (`#ffffff`) | Text, borders |
| `zinc-600` (`#52525b`) | `#d4d4d8` | Secondary text |
| `amber-500` (`#f59e0b`) | Canary Yellow (`#ffde43`) | Warnings, ratings |

### 8.3 Chart Theme Adaptation

Recharts renders SVGs that don't inherit CSS variables. Handle via:

1. **Static colors** for chart elements (they render correctly in both modes since they're direct SVG attributes)
2. **Dark mode overrides** via CSS:
   ```css
   .dark .recharts-text {
     fill: #ffffff !important;
   }
   .dark .recharts-cartesian-grid-horizontal line,
   .dark .recharts-cartesian-grid-vertical line {
     stroke: #27272a !important;
   }
   ```
3. Keep existing `.dark .recharts-*` selectors from `index.css` lines 308–324

---

## 9. Phase-by-Phase Roadmap (Tabs 2–7)

### 9.1 Execution Rules

- **Each phase is atomic** — can be deployed independently
- **No phase exceeds 400 lines of new component code**
- **Every component handles 4 states** (loading, error, empty, success)
- **Backend endpoint must exist before frontend extraction**
- **No inline mock data survives the phase**

### 9.2 Phase 2 — Technology Radar (Tab 2) & Career & Education (Tab 3)

**Estimated effort:** 4–6 hours

**Backend work (2 hours):**
- [ ] 2.1 Create `backend/models/radar.py` with `TechRadarItem`, `RadarSkillPoint`, `TechContractRow`
- [ ] 2.2 Create `backend/routers/radar.py` with `/api/radar-skills` and `/api/tech-contract-matrix`
- [ ] 2.3 Create `backend/models/career.py` with `SenioritySegment`, `ExperienceTrendPoint`, `EducationByCity`
- [ ] 2.4 Create `backend/routers/career.py` with `/api/seniority-segments`, `/api/experience-trends`, `/api/education-by-city`
- [ ] 2.5 Wire each new endpoint to `CsvDataStore` aggregations (start with mock data if CSV not yet connected)
- [ ] 2.6 Add new endpoints to `main.py` app factory

**Frontend work (2–4 hours):**
- [ ] 2.7 Create `src/types/radar.ts` (copy from blueprint §4.1)
- [ ] 2.8 Create `src/hooks/useTechRadar.ts` with `useRadarSkills(filters)`, `useTechContractMatrix(filters)`
- [ ] 2.9 Create `src/components/radar/TechRadar.tsx` (orchestrator, ~80 lines)
- [ ] 2.10 Create `src/components/radar/SkillProfileRadar.tsx` (Recharts RadarChart, ~60 lines)
- [ ] 2.11 Create `src/components/radar/TechContractMatrix.tsx` (table, ~70 lines)
- [ ] 2.12 Create `src/types/career.ts`
- [ ] 2.13 Create `src/hooks/useCareerData.ts` with 3 hooks
- [ ] 2.14 Create `src/components/career/CareerInsights.tsx` (orchestrator, ~50 lines)
- [ ] 2.15 Create `src/components/career/SeniorityCards.tsx` (~50 lines)
- [ ] 2.16 Create `src/components/career/ExperienceTrendChart.tsx` (Recharts LineChart, ~60 lines)
- [ ] 2.17 Create `src/components/career/EducationBarChart.tsx` (Recharts BarChart, ~60 lines)
- [ ] 2.18 Create `src/components/career/DegreeDistribution.tsx` (~40 lines)

**Integration (30 min):**
- [ ] 2.19 In `TechJobDashboard.tsx`: replace Tab 2 JSX with `<TechRadar filters={filters} />`
- [ ] 2.20 In `TechJobDashboard.tsx`: replace Tab 3 JSX with `<CareerInsights filters={filters} />`
- [ ] 2.21 Delete mock data: `radarSkillProfileData`, `techContractMatrix`, `experienceRequirementsOverTimeData`, `educationLevelByCityData`, related static arrays
- [ ] 2.22 Remove unused Recharts imports (verify each)
- [ ] 2.23 Run `npm run lint && npm run build`

### 9.3 Phase 3 — Employers Directory (Tab 5) & Saved Reports (Tab 4) & Geospatial (Tab 6)

**Estimated effort:** 4–5 hours

**Backend work (2 hours):**
- [ ] 3.1 Enhance `/api/companies` with real CSV data + search + city filter
- [ ] 3.2 Create `/api/geo-map` with lat/lng + counts from star schema
- [ ] 3.3 Create `/api/reports/saved` (starts as empty array, storage comes later)

**Frontend work (2–3 hours):**
- [ ] 3.4 Create `src/types/companies.ts`, `src/types/geography.ts`
- [ ] 3.5 Create `src/hooks/useCompaniesData.ts` (extract `useCompanies` from `useDashboardData.ts`)
- [ ] 3.6 Create `src/hooks/useGeoData.ts`
- [ ] 3.7 Create `src/components/employers/EmployersDirectory.tsx` (orchestrator)
- [ ] 3.8 Create `src/components/employers/EmployerCard.tsx` (from current card JSX)
- [ ] 3.9 Create `src/components/employers/EmployerSearchBar.tsx`
- [ ] 3.10 Create `src/components/geography/GeoDensity.tsx` (orchestrator)
- [ ] 3.11 Create `src/components/geography/CityBarChart.tsx`
- [ ] 3.12 Create `src/components/geography/CityRankingList.tsx`
- [ ] 3.13 Create `src/components/geography/GeoKpiCards.tsx`
- [ ] 3.14 Create `src/components/reports/SavedReports.tsx` (enhance placeholder)

**Integration (30 min):**
- [ ] 3.15 Replace tabs 4, 5, 6 JSX with new components
- [ ] 3.16 Delete mock data: `companiesData`, `baseCities`, `computedCompanies`, `computedCities`
- [ ] 3.17 Delete `filterMultiplier` engine (no longer needed when all APIs filter natively)
- [ ] 3.18 Delete `computedTotalOffers`, `computedTechnologies` (moved to backend)
- [ ] 3.19 Clean up imports
- [ ] 3.20 Run `npm run lint && npm run build`

### 9.4 Phase 4 — Macro Trends (Tab 7) & TechJobDashboard Final Cleanup

**Estimated effort:** 2–3 hours

**Backend work (1 hour):**
- [ ] 4.1 Create `/api/monthly-trends` from fact_offres aggregation
- [ ] 4.2 Create `/api/yoy-comparison` from fact_offres yearly grouping
- [ ] 4.3 Create `/api/trend-metrics` from fact_offres summary

**Frontend work (1 hour):**
- [ ] 4.4 Create `src/types/trends.ts`
- [ ] 4.5 Create `src/hooks/useTrendsData.ts`
- [ ] 4.6 Create `src/components/trends/MacroTrends.tsx`
- [ ] 4.7 Create `src/components/trends/TrendMetricCards.tsx`
- [ ] 4.8 Create `src/components/trends/MonthlyVolumeChart.tsx`
- [ ] 4.9 Create `src/components/trends/YoYComparisonTable.tsx`

**Final cleanup (1 hour):**
- [ ] 4.10 Replace Tab 7 JSX in `TechJobDashboard.tsx`
- [ ] 4.11 Delete ALL remaining inline mock arrays:
  - `yoyComparisonData`, `monthlyPostingTrendData`
  - All `safe*` fallback variables
  - All remaining `useMemo` computations
- [ ] 4.12 Prune unused imports (Recharts, lucide-react, React hooks)
- [ ] 4.13 Remove unused hook destructures from lines 91–96
- [ ] 4.14 Extract Sidebar and FilterBar from `TechJobDashboard.tsx`
- [ ] 4.15 Run `npm run lint && npm run build`

### 9.5 Phase 5 — Backend Real Data Wiring (CSV → API)

**Estimated effort:** 3–4 hours

- [ ] 5.1 Create `backend/services/csv_reader.py` as specified in §5.2
- [ ] 5.2 Copy star schema CSVs from `projet-data-maroc-tech/data/star_schema/` to `backend/data/`
- [ ] 5.3 Replace all mock data in routers with `CsvDataStore` aggregations
- [ ] 5.4 Implement real filter logic in `services/filter_service.py`
- [ ] 5.5 Remove duplicate endpoints (`/api/kpis`, `/api/analytics/companies`, etc.)
- [ ] 5.6 Add `/api/analytics/contracts`, `/api/analytics/soft-skills` if needed
- [ ] 5.7 Verify `GET /api/dashboard-kpis?city=Casablanca` returns filtered results
- [ ] 5.8 Verify `GET /health` returns expected data
- [ ] 5.9 Run `uvicorn main:app --reload` and test every endpoint

### 9.6 Phase 6 — Landing Page Refactoring

**Estimated effort:** 1–2 hours

- [ ] 6.1 Extract HeroSection, ValueProposition, PipelineSection, FooterSection from `App.tsx`
- [ ] 6.2 Move `MICRO_STATS` to `constants/`
- [ ] 6.3 Verify landing page < 500 lines
- [ ] 6.4 Run `npm run lint && npm run build`

---

## 10. Data Pipeline Integration Strategy

### 10.1 Current Gap

The data pipeline produces a perfect star schema (13 tables, 10,782 rows, verified integrity). The backend serves hardcoded mock data. The gap is **zero lines of code** connecting the two.

### 10.2 Bridge Architecture

```
projet-data-maroc-tech/
  └── data/star_schema/
      ├── dim_date.csv
      ├── dim_city.csv       ←──┐
      ├── dim_tech.csv       ←──┤
      ├── fact_offres.csv    ←──┤  Copy or symlink
      └── ...                    │
                                │
New_design/backend/             │
  └── data/                   ←─┘
      ├── dim_date.csv
      ├── dim_city.csv
      ├── fact_offres.csv
      └── ...
```

**Option A: Symlink** (preferred for development)
```bash
cd New_design/backend
New-Item -ItemType SymbolicLink -Path "data" -Target "../../projet-data-maroc-tech/data/star_schema"
```

**Option B: Copy script** (preferred for production)
```bash
# Run after each pipeline execution
robocopy projet-data-maroc-tech/data/star_schema New_design/backend/data /E
```

### 10.3 ETL → API Refresh Cadence

| Step | Tool | Frequency | Responsibility |
|------|------|-----------|---------------|
| Scrape | Jupyter notebook | Daily | Data engineer |
| Clean & dedupe | Python script | Daily | Data engineer |
| Build star schema | `build_star_schema_v2.py` | Daily | Data engineer |
| Copy to backend | `export_to_api.py` | After schema build | CI/CD or manual |
| API serves | FastAPI + CSV loader | On each request | Backend |

### 10.4 Future Enhancement: Incremental Loads

- Add `last_updated` timestamp to `fact_offres.csv`
- Backend checks file modification time vs cache TTL
- Only reload CSV when file changes (detect via `os.path.getmtime`)

---

## 11. Testing & Quality Gates

### 11.1 Validation Commands

```bash
# Before every commit
cd New_design

# TypeScript type checking
npm run lint           # tsc --noEmit

# Production build
npm run build          # vite build

# Backend health check
cd backend
python -c "from main import app; print('API loads OK')"
uvicorn main:app --reload &   # Start server
curl http://localhost:8000/health  # Verify
```

### 11.2 Component Quality Checklist

Every extracted component must pass:

| Check | Criterion |
|-------|-----------|
| **File size** | < 300 lines |
| **States** | loading, error, empty, success all rendered |
| **Imports** | No unused imports (verify each) |
| **Types** | No `any`, no `@ts-ignore`, no `@ts-expect-error` |
| **Styling** | Tailwind utility classes only — no inline styles |
| **Data fetching** | Via TanStack Query hooks only — no `fetch()` directly in components |
| **Dependencies** | No new npm packages without verification |

### 11.3 Integration Test Plan

| Scenario | Action | Expected Result |
|----------|--------|----------------|
| Fresh load | Open dashboard | KPI cards show real data, chart renders |
| Filter change | Select "Casablanca" | API re-fetches, UI updates |
| Error state | Stop backend | Error banner with retry button appears |
| Empty data | Select non-existent filter | Empty state or muted values |
| Dark mode toggle | Click moon/sun icon | All cards, charts, sidebar adapt |
| Mobile viewport | Resize to 375px | Sidebar collapses, cards stack |
| Tab switch | Click "Technology Radar" | New tab renders with its data |

---

## 12. Glossary & Conventions

### 12.1 Naming Conventions

| Category | Convention | Examples |
|----------|-----------|---------|
| Components | PascalCase, default export | `TechRadar.tsx`, `EmployerCard.tsx` |
| Hooks | camelCase, named export | `useTechRadar(filters)`, `useCompaniesData(filters)` |
| Types | PascalCase in dedicated files | `TechRadarItem` in `types/radar.ts` |
| CSS classes | Tailwind utility only | No custom class names |
| Files | PascalCase components, camelCase everything else | `EmployerCard.tsx`, `useDashboardData.ts` |
| API endpoints | kebab-case | `/api/tech-radar`, `/api/yoy-comparison` |
| Query keys | camelCase | `['techRadar', filters]`, `['monthlyTrends', filters]` |

### 12.2 Project Constitution Reminders (from `.cursorrules`)

| Rule | Enforcement |
|------|------------|
| No inline styles | Static analysis / code review |
| No state management library | TanStack Query + useState only |
| No direct API URL construction outside hooks | All fetches in `hooks/*.ts` |
| No class components | Functional + hooks only |
| No CSS modules / styled-components | Tailwind v4 only |
| No raw SQL / no database connection | CSV + Pandas only |
| No `any` type | Use `unknown` + type narrowing |
| No committing large CSVs | `.gitignore` excludes `*.csv` |

### 12.3 Key Architectural Decisions (ADRs)

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-001 | CSS variables for theming (not Tailwind `dark:`) | Supports complex Neo-brutalist design system not achievable with Tailwind's limited dark mode variant |
| ADR-002 | CSV-backed API (no database) | Aligns with pipeline output; simplifies deployment; per `.cursorrules` constraint |
| ADR-003 | Per-tab hook files | Avoids single 500+ line hook file; enables tree-shaking; each domain independently testable |
| ADR-004 | Props-only filter propagation | No context/providers needed; filters are the only shared state; keeps data flow explicit |
| ADR-005 | 4-state rendering in every component | Eliminates "grey screen" bugs; consistent UX across all tabs; matches established `DashboardOverview` pattern |

---

*End of Blueprint — Proceed to Phase 1 execution.*

# TechJob Analytics — SaaS Modernization & Architecture Documentation

## 🚀 Overview

**TechJob Analytics** is a Moroccan IT Job Market Intelligence SaaS platform powered by a decoupled **FastAPI + Vectorized DuckDB OLAP Engine** backend and a **React 19 + TypeScript + Vite + Tailwind CSS** frontend.

The platform queries 13 normalized Parquet tables (10,782 Moroccan IT job postings) with sub-15ms query execution times, parametrized in-memory caching, and zero database schema migrations.

---

## 🏛️ Architectural Baseline

```
┌─────────────────────────────────────────────────────────────┐
│                   React 19 Frontend (Vite)                  │
│  - Neo-Tech Design Tokens (Dark / Light ThemeProvider)      │
│  - TanStack Query v5 (5-min TTL Caching & Query Keys)       │
│  - Recharts Visualizations & Custom Responsive Containers   │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP REST JSON (<15ms)
┌──────────────────────────────▼──────────────────────────────┐
│                    FastAPI Backend Engine                   │
│  - Parameterized TTL Cache (600s cache_key hashing)         │
│  - In-Process Vectorized DuckDB SQL Engine                  │
└──────────────────────────────┬──────────────────────────────┘
                               │ Zero-Copy Read
┌──────────────────────────────▼──────────────────────────────┐
│              13 Normalized Parquet Views (OLAP)             │
│  - fact_offres (10,782 records), dim_tech, dim_city,       │
│    dim_experience, dim_entreprise, dim_contract, etc.       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📡 Analytical Endpoints Specification

### 1. Market Pulse
- **`GET /api/v1/market-pulse`**
  - **Latency:** ~4ms
  - **Output:** Total job volume, top hiring city (Casablanca: 55.1%), leading tech (Java: 24.7%), benchmark salary range (`14,000 - 26,000 MAD`), and junior accessibility index (31.5%).

- **`GET /api/v1/market-pulse-preview`**
  - **Latency:** ~8ms
  - **Output:** Top 5 skills ranking, contract type breakdown (CDI, CDD, Freelance, Stage), and latest verified postings.

### 2. Market Demand & Skills Radar (Module 1)
- **`GET /api/v1/skills/radar`**
  - **Query Params:** `cities`, `categories`, `seniority`, `contracts`, `junior_only`, `search`, `limit`
  - **Latency:** ~12ms
  - **Output:** 
    - `hard_skills`: Technology name, category, market share %, and junior accessibility ratio %.
    - `soft_skills`: Behavioral competencies (Agile/Scrum, Communication, Problem Solving, Autonomie).
    - `languages`: Language requirements distribution (French, English, Arabic).

### 3. Skill Co-occurrence & Pairings Explorer (Module 2)
- **`GET /api/v1/skills/pairings`**
  - **Query Params:** `skill` (default: "React"), `limit` (default: 10)
  - **Latency:** ~11ms
  - **Output:** Self-joined co-occurrence analysis revealing companion tools, databases, and frameworks bundled together by Moroccan recruiters (e.g. React + Spring Boot @ 31.4%).

### 4. Candidate Stack Matcher & ROI Booster (Module 3)
- **`POST /api/v1/matcher/analyze`**
  - **Payload:** `{ "skills": ["React", "JavaScript", "SQL"], "city": "Casablanca", "junior_only": false }`
  - **Latency:** ~14ms
  - **Output:** 
    - `market_coverage_pct`: Exact slice percentage of matching Moroccan postings.
    - `total_matching_jobs`: Real-time offer count.
    - `top_missing_skills`: High-ROI companion skill recommendations with incremental market yield (`+job_boost_pct`).
    - `skill_strength_score`: 0–100 benchmark.

### 5. Career Transition Simulator (Module 4)
- **`POST /api/v1/career/simulate`**
  - **Payload:** `{ "current_skills": ["Java", "Spring Boot", "SQL"], "target_role": "Data Engineer" }`
  - **Latency:** ~5ms
  - **Output:** 
    - `difficulty_score`: 0–10 transition difficulty index.
    - `estimated_transition_months`: Estimated study timeline.
    - `market_increase_pct`: Market expansion percentage.
    - `skill_gap`: Matched vs. missing competencies tagged with importance (`critical`, `high`, `medium`).
    - `recommended_path`: Step-by-step ordered learning roadmap.

### 6. Company Hiring Intelligence (Module 5)
- **`GET /api/v1/companies/intelligence`**
  - **Query Params:** `cities`, `seniority`, `contracts`, `junior_only`, `limit`
  - **Latency:** ~18ms
  - **Output:** Top employers (Capgemini, SQLI, CGI, DXC, etc.) with core technology stacks, remote/hybrid flexibility split, and seniority hiring distribution.

### 7. Junior-Friendly Lens & Regional Heatmap (Module 6)
- **`GET /api/v1/juniors/heatmap`**
  - **Query Params:** `cities`, `categories`
  - **Latency:** ~9ms
  - **Output:** 5-tier seniority breakdown (Stage, Junior, Mid, Senior, Lead) and regional opportunity scores for the top 10 Moroccan IT cities.

---

## 🎨 Frontend Component Architecture

```
New_design/src/
├── components/
│   ├── filters/
│   │   └── GlobalFilterBar.tsx        # Sticky synchronized filter bar
│   ├── navigation/
│   │   └── Sidebar.tsx                # Collapsible 240px navigation shell
│   ├── ui/
│   │   └── GlassCard.tsx              # Reusable glassmorphism card component
│   └── ThemeProvider.tsx              # Dark/Light theme context with localStorage
├── modules/
│   ├── skills/
│   │   ├── SkillsRadarPage.tsx        # Module 1: Hard/Soft Skills & Language Radar
│   │   └── PairingsExplorer.tsx       # Module 2: Radial Co-occurrence Explorer
│   ├── matcher/
│   │   └── StackMatcherPage.tsx       # Module 3: Circular Gauge & ROI Booster
│   ├── career/
│   │   └── CareerSimulatorPage.tsx    # Module 4: Transition Difficulty & Roadmap
│   ├── companies/
│   │   └── CompanyIntelligencePage.tsx# Module 5: Recruiter Stack Cards & Modal
│   └── juniors/
│       └── JuniorLensPage.tsx         # Module 6: 5-Tier Donut & Regional Heatmap
├── layouts/
│   └── DashboardLayout.tsx            # Main application layout shell
├── pages/
│   └── LandingPage.tsx                # Neo-Tech hero, marquee ticker & preview
├── hooks/
│   ├── useDashboardData.ts            # Typed TanStack Query hooks for all endpoints
│   └── useGlobalFilters.ts            # Global filter state management
├── lib/
│   └── react-query-client.ts          # Centralized QueryClient instance
├── types.ts                           # Comprehensive TypeScript contracts
└── index.css                          # Neo-Tech color tokens & animations
```

---

## 🧪 Verification & Startup Instructions

### 1. Start Backend Engine
```bash
cd New_design/backend
uvicorn main:app --reload --port 8000
```

### 2. Start Frontend Dev Server
```bash
cd New_design
npm run dev
```

### 3. Production Build Validation
```bash
cd New_design
npm run build
```
*(Verified clean build with 0 TypeScript/lint errors).*

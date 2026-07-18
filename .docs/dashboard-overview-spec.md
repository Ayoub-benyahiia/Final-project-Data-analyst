# PHASE 2 — Dashboard Overview Extraction Spec

**File:** `src/components/DashboardOverview.tsx` (new)
**Dependencies:** `useDashboardKpis`, `useGrowthData`, `src/types.ts`
**Status:** Draft — implementation starts after sign-off

---

## 1. Goal

Extract Tab 1 ("Dashboard Overview", currently `TechJobDashboard.tsx:834–1154`) into an independent, single-responsibility component at `src/components/DashboardOverview.tsx`. The extraction has two hard requirements:

1. **Remove all mock/simulated data.** The current tab renders from 10 inline arrays and a client-side `filterMultiplier` engine (lines 137–343 of `TechJobDashboard.tsx`). Every hardcoded data source inside the tab's JSX boundary must be deleted.
2. **Wire 100% to real FastAPI data** via the two TanStack Query hooks that already exist:
   - `useDashboardKpis(filters)` → `GET /api/dashboard-kpis`
   - `useGrowthData(filters)` → `GET /api/growth-data`

All UI sections that cannot be served by these two hooks alone remain in `TechJobDashboard.tsx` for future extraction phases. This phase only extracts the four KPI cards and the trend AreaChart — the two sections with complete API coverage.

### What gets extracted

| Section | Hook | Backend endpoint |
|---|---|---|
| 4 KPI cards (Total Offers, Remote Rate, Top Tech, Avg Experience) | `useDashboardKpis` | `GET /api/dashboard-kpis?city&tech&experience&contract` |
| Trend AreaChart (monthly posting volume) | `useGrowthData` | `GET /api/growth-data?city&tech&experience` |

### What stays behind (future phases)

- Most Demanded Technologies bar list → `useTopSkills`
- Contract Types breakdown → new endpoint or `useDashboardKpis` extension
- Top Cities Location Density → new endpoint
- Top Tech Employers table → `useCompanies`
- Welcome ribbon, sync badge → shared layout component

---

## 2. Technical Approach & Type Mappings

### 2.1 Backend response shapes (from `backend/main.py`)

**`GET /api/dashboard-kpis`**
```json
{
  "data": {
    "totalOffers": 10782,
    "newThisWeek": 142,
    "avgSalary": 24500,
    "remotePercentage": 21.5,
    "topCompanies": ["Sofrecom Maroc", "Alten Maroc", "Atos"]
  },
  "filters": {
    "city": "All",
    "tech": "All",
    "experience": "All",
    "contract": "All"
  }
}
```

**`GET /api/growth-data`**
```json
{
  "data": [
    {
      "year": "2016",
      "Casablanca": 1520,
      "Rabat": 780,
      "Tangier": 120,
      "Marrakech": 90
    }
  ],
  "filters": {
    "city": "All",
    "tech": "All",
    "experience": "All"
  }
}
```

### 2.2 Required additions to `src/types.ts`

The file currently only has `GrowthDataPoint`, `TechRadarItem`, `FAQItem`, and `TestimonialItem`. The following types must be added:

```typescript
// API response wrapper (every endpoint returns { data, filters })
export interface ApiResponse<T> {
  data: T;
  filters: Record<string, string | boolean>;
}

// ── Dashboard KPI types ──
export interface DashboardKpis {
  totalOffers: number;
  newThisWeek: number;
  avgSalary: number;
  remotePercentage: number;
  topCompanies: string[];
}

// ── Growth data (exists as GrowthDataPoint, needs ApiResponse wrapper) ──
// GrowthDataPoint already exists: { year: string; Casablanca: number; Rabat: number; Tangier: number; Marrakech: number; }

// ── Derived KPI card model (computed from DashboardKpis) ──
export interface KpiCard {
  label: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'stable';
  accentColor: 'rose' | 'zinc' | 'emerald' | 'blue';
}
```

### 2.3 Hook-to-UI mapping

| Hook property | Signal | UI action |
|---|---|---|
| `data` | Response payload arrived | Render KPI cards / chart |
| `isLoading` | True while fetching | Show skeleton loader overlay |
| `isError` | True on fetch failure | Show error banner + retry button |
| `refetch` | User clicks retry | Re-run the query |

**Component interface:**
```typescript
interface DashboardOverviewProps {
  filters: FilterParams;
}
```

Note: `FilterParams` is currently defined as a local interface inside `useDashboardData.ts:13-21`. Per `.cursorrules` ("Types: PascalCase interfaces in `src/types.ts`"), this interface must be **extracted and exported** from `src/types.ts`:

```typescript
export interface FilterParams {
  city?: string;
  tech?: string;
  experience?: string;
  contract?: string;
  education?: string;
  remote_only?: boolean;
  search?: string;
}
```

### 2.4 Data derivation for KPI cards

The backend's `DashboardKpis` shape does not perfectly match the four existing cards. The mapping is:

| Rendered card | Backend field | Derivation |
|---|---|---|
| Total Offers | `totalOffers` | Direct |
| Remote/Hybrid Rate | `remotePercentage` | Direct, append `%` suffix |
| Top Required Tech | `topCompanies` | **Not a direct match.** Current card shows "Most demanded tech" (e.g., "Java"). `topCompanies` is a string array of company names. **Decision:** Until the backend adds a `topTech` field, render `topCompanies[0]` as a placeholder and add a `@TODO` comment to replace with a real `topTech` field once the backend is updated. |
| Avg. Experience | _(none)_ | **No backend field exists.** Current card shows "Intermédiaire (3 à 5 ans)". **Decision:** Hardcode a static fallback string `"Intermédiaire (3 à 5 ans)"` and add a `@TODO` to wire when the `/api/dashboard-kpis` response includes an `avgExperience` field. |

### 2.5 Data derivation for Trend Chart

The growth data is yearly (2016–2026), but the current chart is monthly (Jan–Jun). **Decision:** Use the yearly growth data directly and change the X-axis label to `year`. This aligns with the backend and removes the simulated monthly data. Update the chart title to "Yearly Job Posting Volume (2016–2026)".

---

## 3. Component Breakdown

### `DashboardOverview.tsx` (orchestrator)

```
src/components/DashboardOverview.tsx
```

Responsibilities:
- Accepts `filters: FilterParams` as props
- Calls `useDashboardKpis(filters)` and `useGrowthData(filters)`
- Manages the combined loading/error state for both hooks
- Renders sub-components conditionally based on state

```typescript
export default function DashboardOverview({ filters }: DashboardOverviewProps) {
  const kpis = useDashboardKpis(filters);
  const growth = useGrowthData(filters);

  // Loading: if either hook is loading
  // Error: if either hook has error
  // Success: render sub-components

  return (
    <>
      <KpiCardsSection
        data={kpis.data?.data ?? null}
        isLoading={kpis.isLoading}
        isError={kpis.isError}
        onRetry={kpis.refetch}
      />
      <TrendChartSection
        data={growth.data?.data ?? null}
        isLoading={growth.isLoading}
        isError={growth.isError}
        onRetry={growth.refetch}
      />
    </>
  );
}
```

### `KpiCardsSection` (sub-component)

```
Lives inside DashboardOverview.tsx (no separate file)
```

Responsibilities:
- Renders a 4-column grid of KPI cards
- Each card shows: label, value, trend badge, accent color bar
- Maps backend `DashboardKpis` to the four card shapes (see §2.4)

States:
| State | Rendering |
|---|---|
| Loading | 4 skeleton placeholder cards (pulsing gray blocks) |
| Error | Single error banner spanning the grid row with retry CTA |
| Empty/null data | 4 muted cards showing `—` values |
| Success | 4 real cards with computed values |

### `TrendChartSection` (sub-component)

```
Lives inside DashboardOverview.tsx (no separate file)
```

Responsibilities:
- Renders a card with title, description, and Recharts `AreaChart`
- Uses `safeGrowthData` fallback (empty array → single `{ year: "N/A", ... }` row)

States:
| State | Rendering |
|---|---|
| Loading | Chart-area skeleton (gray box with pulsing animation) |
| Error | Inline error banner inside card with retry |
| Empty/null data | Chart showing a single "N/A" data point |
| Success | Full AreaChart with rose gradient fill |

Chart configuration:
- Recharts imports: `AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer`
- Stroke: `#e11d48` (rose-600)
- Fill gradient: linear gradient id `roseGlow` matching current style (`TechJobDashboard.tsx:1015-1018`)
- Margins: `{ top: 10, right: 10, left: -20, bottom: 0 }`
- Tooltip: neo-brutalist style (`border: 2px solid #09090b`, `boxShadow: 4px 4px 0px 0px #09090b`)

---

## 4. Granular Numbered Checklist (6-Hour Sprint TODOs)

All times are estimates for a single developer. Each item is atomic and testable in isolation.

### Task 1 — Types (30 min)

- [ ] 1.1 Export `FilterParams` interface from `src/types.ts` (copy from `useDashboardData.ts:13-21`, delete the local copy)
- [ ] 1.2 Add `ApiResponse<T>` generic wrapper interface to `src/types.ts`
- [ ] 1.3 Add `DashboardKpis` interface to `src/types.ts` matching backend response shape
- [ ] 1.4 Add `KpiCard` derived interface to `src/types.ts`

### Task 2 — Skeleton extraction (45 min)

- [ ] 2.1 Create `src/components/DashboardOverview.tsx` with the minimal component shell
- [ ] 2.2 Define `DashboardOverviewProps` interface with `filters: FilterParams`
- [ ] 2.3 Import and call `useDashboardKpis(filters)` and `useGrowthData(filters)`
- [ ] 2.4 Implement a combined loading check (`const isLoading = kpis.isLoading || growth.isLoading`)
- [ ] 2.5 Implement a combined error check (`const isError = kpis.isError || growth.isError`)
- [ ] 2.6 Return a simple `<div>` placeholder with the text `DashboardOverview` to verify the component mounts

### Task 3 — KPI cards skeleton + loading (45 min)

- [ ] 3.1 Create `<KpiCardsSection>` inside the same file (or extract to a co-located file, but same-file is preferred by `.cursorrules` patterns)
- [ ] 3.2 Render a 4-column grid wrapper (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`)
- [ ] 3.3 When `isLoading` is true, render 4 skeleton cards: `bg-zinc-200 animate-pulse rounded-xl p-5 h-32`
- [ ] 3.4 When `isError` is true, render a single full-width error card with retry button calling `onRetry`
- [ ] 3.5 When `data` is null/undefined, render 4 muted cards showing `—` as value

### Task 4 — KPI cards data rendering (45 min)

- [ ] 4.1 Map `DashboardKpis` shape to the 4 KPI card models:
  - Card 1: `totalOffers` → label "Total Offers", value formatted with `toLocaleString()`, trend "↗ +12%"
  - Card 2: `remotePercentage` → label "Remote/Hybrid Rate", value with `%` suffix
  - Card 3: `topCompanies[0]` → label "Top Required Tech" (with `@TODO` to swap for real field)
  - Card 4: static `"Intermédiaire (3 à 5 ans)"` → label "Avg. Experience" (with `@TODO` to wire to backend field)
- [ ] 4.2 Style each card identical to the current design: white bg, `border-bold rounded-xl p-5`, accent color bar at bottom, trend badge top-right

### Task 5 — Trend chart skeleton + loading (45 min)

- [ ] 5.1 Create `<TrendChartSection>` inside the same file
- [ ] 5.2 Render a chart card wrapper (white bg, `border-bold rounded-xl p-5`)
- [ ] 5.3 Add title "Yearly Job Posting Volume (2016–2026)" and description
- [ ] 5.4 When `isLoading`, render a 220px-tall gray skeleton rectangle
- [ ] 5.5 When `isError`, render inline error banner with retry
- [ ] 5.6 When `data` is empty/null, render fallback `[{ year: 'N/A', Casablanca: 0, Rabat: 0, Tangier: 0, Marrakech: 0 }]`

### Task 6 — Trend chart Recharts integration (45 min)

- [ ] 6.1 Import Recharts: `AreaChart`, `Area`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `ResponsiveContainer`
- [ ] 6.2 Configure the `defs` gradient (`roseGlow` with `#e11d48` stops)
- [ ] 6.3 Wire `Casablanca` dataKey with rose stroke and gradient fill
- [ ] 6.4 Wire `Rabat` dataKey with zinc stroke and fill
- [ ] 6.5 Apply neo-brutalist tooltip styling matching the existing design
- [ ] 6.6 Set responsive container height to `h-[220px]`

### Task 7 — Extract from TechJobDashboard.tsx (30 min)

- [ ] 7.1 In `TechJobDashboard.tsx`, locate the Dashboard tab JSX block (`activeTab === 'dashboard'`, lines 834-1155)
- [ ] 7.2 Delete all JSX inside the block except the wrapper `<div className="space-y-6 animate-fade-in">`
- [ ] 7.3 Insert `<DashboardOverview filters={filters} />` in its place
- [ ] 7.4 Import `DashboardOverview` at the top of `TechJobDashboard.tsx`
- [ ] 7.5 Delete the now-unused local state variables and `useMemo` computations that were only consumed by the dashboard tab:
  - `filterMultiplier` (lines 185–217)
  - `computedTotalOffers` (lines 220–222)
  - `computedRemoteRate` (lines 224–231)
  - `computedTopTech` (lines 233–239)
  - `computedAvgExpString` (lines 241–244)
  - `computedTechnologies` (lines 247–265)
  - `computedCities` (lines 268–280)
  - `monthlyPostingTrendData` (lines 332–343)
  - `contractDistributionData` (lines 303–329)
  - The `safe*` fallback variables that wrap them (lines 408–419)

### Task 8 — Cleanup TechJobDashboard.tsx unused imports (15 min)

- [ ] 8.1 Remove unused Recharts imports (`BarChart`, `Bar`, `LineChart as RechartsLineChart`, `Line`, `RadarChart`, `PolarGrid`, `PolarAngleAxis`, `PolarRadiusAxis`, `Radar`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `ResponsiveContainer`) — but only if the removed dashboard tab was their sole consumer. Verify each chart import is still used in other tabs first.
- [ ] 8.2 Remove unused lucide-react icons that were only referenced in the dashboard tab
- [ ] 8.3 Remove unused hook destructures (`growthData`, `techRadarData`, `companiesApiData`, `marketMetricsData`, `topSkillsData`, `dashboardKpisData` — lines 92–97) since these are no longer consumed by the dashboard tab. The hook calls themselves stay (other tabs consume them).

### Task 9 — Verify + lint (30 min)

- [ ] 9.1 Run `npm run lint` (which runs `tsc --noEmit`) from `New_design/`
- [ ] 9.2 Fix all type errors
- [ ] 9.3 Run `npm run build` and confirm the production bundle compiles
- [ ] 9.4 Start the backend (`cd backend && uvicorn main:app --reload`) and verify `GET /api/dashboard-kpis` and `GET /api/growth-data` return valid JSON
- [ ] 9.5 Start the frontend (`npm run dev`) and visually confirm the Dashboard Overview tab renders the 4 KPI cards and the trend chart from real API data
- [ ] 9.6 Toggle a filter (e.g., change City to "Casablanca") and confirm the KPI values update (the backend currently ignores filters for these mock endpoints, but the React Query refetch must fire — verify via network tab)

### Task 10 — Mark mock data arrays for deletion (15 min)

- [ ] 10.1 The following inline arrays in `TechJobDashboard.tsx` are now dead code once all tabs use real APIs. Add a `// @TODO PHASE-2-DELETE` comment above each for future cleanup:
  - `baseTechnologies` (line 151)
  - `baseCities` (line 169)
  - `companiesData` (line 137)
  - `radarSkillProfileData` (line 346)
  - `techContractMatrix` (line 356)
  - `experienceRequirementsOverTimeData` (line 370)
  - `educationLevelByCityData` (line 385)
  - `yoyComparisonData` (line 394)
- [ ] 10.2 Do NOT delete them yet — they are still consumed by other tabs in this phase.

---

## Appendix A — File change summary

| File | Action |
|---|---|
| `src/types.ts` | Add `FilterParams`, `ApiResponse<T>`, `DashboardKpis`, `KpiCard` |
| `src/hooks/useDashboardData.ts` | Remove local `FilterParams` interface (now in `types.ts`), update import |
| `src/components/DashboardOverview.tsx` | **CREATE** — 200–300 lines |
| `src/components/TechJobDashboard.tsx` | Replace tab JSX with `<DashboardOverview>`, delete unused computations, prune imports |

## Appendix B — Cross-reference: current mock values vs backend fields

| UI element | Current source (mock) | Backend field to use | Gap |
|---|---|---|---|
| Total Offers | `computedTotalOffers` (multiplier simulation) | `dashboardKpisData.data.totalOffers` | None |
| Remote Rate | `computedRemoteRate` (conditional math) | `dashboardKpisData.data.remotePercentage` | None |
| Top Tech | `computedTopTech` (conditional string) | `dashboardKpisData.data.topCompanies[0]` | **Backend has no `topTech` field; fallback** |
| Avg Experience | `computedAvgExpString` (conditional string) | None | **Backend has no `avgExperience` field; hardcode** |
| Trend Chart | `monthlyPostingTrendData` (simulated months) | `growthData.data` (yearly) | **Axis changes from monthly to yearly** |

## Appendix C — Integration boundary

`DashboardOverview` is a **pure presentational component**. It:

- **DOES** receive filters as props
- **DOES** call the two TanStack Query hooks internally
- **DOES** render loading, error, empty, and success states for each sub-section independently
- **DOES NOT** manage filter state
- **DOES NOT** import or use any data from `src/data.ts`
- **DOES NOT** render any hardcoded arrays — all displayed values derive from API responses

This ensures it is independently testable, independently replaceable, and fully compliant with the `.cursorrules` architecture principle: *"the path from CSV → API → chart should be traceable in under 30 seconds of reading."*

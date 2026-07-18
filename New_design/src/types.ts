export interface GrowthDataPoint {
  year: string;
  Casablanca: number;
  Rabat: number;
  Tangier: number;
  Marrakech: number;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  tags: string[];
}

export interface TechRadarItem {
  name: string;
  growth: number;
  volume: number;
  avgSalary: number;
  experienceLevel: 'Junior' | 'Mid' | 'Senior' | 'Lead';
}

// ── Filter params passed to all dashboard hooks ──
export interface FilterParams {
  city?: string;
  tech?: string;
  experience?: string;
  contract?: string;
  education?: string;
  remote_only?: boolean;
  search?: string;
}

// ── Generic API response wrapper (every endpoint returns { data, filters }) ──
export interface ApiResponse<T> {
  data: T;
  filters: Record<string, string | boolean>;
}

// ── Dashboard KPIs returned by GET /api/dashboard-kpis ──
export interface DashboardKpis {
  totalOffers: number;
  newThisWeek: number;
  avgSalary: number;
  remotePercentage: number;
  topCompanies: string[];
}

// ── Derived KPI card model for the UI grid ──
export type KpiCardAccent = 'rose' | 'zinc' | 'emerald' | 'blue';

export interface KpiCard {
  label: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'stable';
  accentColor: KpiCardAccent;
}

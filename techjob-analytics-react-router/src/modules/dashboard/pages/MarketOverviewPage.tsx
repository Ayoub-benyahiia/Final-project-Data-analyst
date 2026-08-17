"use client";

import { KPICard } from "@/components/ui/KpiCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { CustomChartTooltip } from "@/components/ui/CustomChartTooltip";
import { KPICardSkeleton, ChartCardSkeleton } from "@/components/ui/Skeleton";
import { useMarketPulse, useMarketOverview } from "@/modules/dashboard/hooks/useMarketData";
import { useFilters } from "@/modules/dashboard/hooks/useFilters";
import { KPIData } from "@/types";
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const DONUT_COLORS = ["#161719", "#10B981", "#06B6D4", "#F59E0B", "#6366F1", "#EC4899", "#8B5CF6", "#F43F5E"];

const formatCompactK = (val: number | string) => {
  const num = typeof val === "number" ? val : parseFloat(val);
  if (isNaN(num)) return String(val);
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}k`;
  return String(num);
};

const truncateLabel = (val: string, maxLen = 20) => {
  if (typeof val !== "string") return String(val);
  return val.length > maxLen ? `${val.slice(0, maxLen - 2)}…` : val;
};

export default function MarketOverviewPage() {
  const filters = useFilters();
  const { data: pulseData, isPending: isPulsePending } = useMarketPulse();
  const { data: overviewData, isPending: isOverviewPending } = useMarketOverview(filters);

  const isPending = isPulsePending || isOverviewPending;

  if (isPending) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <KPICardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <ChartCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Format 5 KPI cards from live Market Pulse (Ground-truth DuckDB Star Schema)
  const kpis: KPIData[] = pulseData
    ? [
        {
          label: "Total Jobs",
          value: pulseData.total_jobs.toLocaleString(),
          change: 12.5,
          changeLabel: "verified postings",
          icon: "Briefcase",
          color: "indigo",
        },
        {
          label: "Total Companies",
          value: pulseData.total_companies.toLocaleString(),
          change: 8.4,
          changeLabel: "active employers",
          icon: "Building2",
          color: "amber",
        },
        {
          label: "Total Cities",
          value: `${pulseData.total_cities} Cities`,
          change: 5.2,
          changeLabel: "Moroccan hubs",
          icon: "MapPin",
          color: "cyan",
        },
        {
          label: "Remote Flexibility",
          value: `${pulseData.remote_flexibility_pct}%`,
          change: 18.4,
          changeLabel: "remote or hybrid",
          icon: "Zap",
          color: "emerald",
        },
        {
          label: "Avg. Experience",
          value: `${pulseData.avg_experience_years} Years`,
          change: 2.1,
          changeLabel: "market average",
          icon: "GraduationCap",
          color: "rose",
        },
      ]
    : [];

  const contracts = overviewData?.contract_distribution || [];
  const trend = overviewData?.yearly_trend.map((t) => ({ name: String(t.year), value: t.count })) || [];
  const regional = overviewData?.regional_hubs.map((r) => ({ name: r.city, value: r.count })) || [];
  const education = overviewData?.education_levels.map((e) => ({ name: e.level, value: e.count })) || [];
  const skills = overviewData?.top_technologies.map((t) => ({ name: t.name, value: t.count })) || [];

  return (
    <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
      {/* 5 KPI Cards Row with Hero Dark Variant on 1st Card */}
      {kpis.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {kpis.map((kpi, index) => (
            <KPICard
              key={kpi.label}
              data={kpi}
              variant={index === 0 ? "hero" : "default"}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No market pulse data available" />
      )}

      {/* Grid Charts Row with refined proportions & readability */}
      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2 xl:grid-cols-3">
        {/* 1. Contract Distribution */}
        <ChartCard title="Contracts Distribution" subtitle="By contract type across all jobs" height={220}>
          {contracts.length === 0 ? (
            <EmptyState className="h-full border-none p-3" />
          ) : (
            <div className="flex flex-col h-full justify-between">
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={contracts}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="name"
                  >
                    {contracts.map((_, i) => (
                      <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomChartTooltip suffix="jobs" />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                {contracts.slice(0, 4).map((entry, i) => (
                  <div key={entry.name} className="flex items-center gap-1">
                    <div
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }}
                    />
                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                      {entry.name} ({entry.pct}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ChartCard>

        {/* 2. Yearly Posting Trend */}
        <ChartCard title="Posting Trend Over Time" subtitle="Market postings volume by year" height={220}>
          {trend.length === 0 ? (
            <EmptyState className="h-full border-none p-3" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 8, right: 15, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#161719" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#161719" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis
                  tickFormatter={formatCompactK}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  width={38}
                />
                <Tooltip content={<CustomChartTooltip suffix="postings" />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#161719"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#trendAreaGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* 3. Top Regional Hubs — Clean horizontal layout with compact number formatting */}
        <ChartCard title="Top Regional Hubs" subtitle="Job opportunities by city" height={220}>
          {regional.length === 0 ? (
            <EmptyState className="h-full border-none p-3" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regional.slice(0, 6)} layout="vertical" margin={{ top: 6, right: 20, left: 80, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={true} vertical={false} />
                <XAxis
                  type="number"
                  tickFormatter={formatCompactK}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 10, fill: "#475569" }}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <Tooltip content={<CustomChartTooltip suffix="jobs" />} />
                <Bar dataKey="value" fill="#06B6D4" radius={[0, 4, 4, 0]} barSize={13} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* 4. Education Levels */}
        <ChartCard title="Required Education" subtitle="Minimum degree prerequisites" height={220} className="lg:col-span-1">
          {education.length === 0 ? (
            <EmptyState className="h-full border-none p-3" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={education} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis
                  tickFormatter={formatCompactK}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  width={38}
                />
                <Tooltip content={<CustomChartTooltip suffix="jobs" />} />
                <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* 5. Top Technologies — Horizontal ranking with clear labels and compact formatting (width=90, zero 45-degree angle) */}
        <ChartCard title="Top Demanded Tech" subtitle="Most frequently requested skills" height={220} className="lg:col-span-2">
          {skills.length === 0 ? (
            <EmptyState className="h-full border-none p-3" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={skills.slice(0, 8)}
                layout="vertical"
                margin={{ top: 6, right: 20, left: 90, bottom: 6 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={true} vertical={false} />
                <XAxis
                  type="number"
                  tickFormatter={formatCompactK}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickFormatter={(v) => truncateLabel(v, 20)}
                  tick={{ fontSize: 10, fill: "#475569" }}
                  axisLine={false}
                  tickLine={false}
                  width={90}
                />
                <Tooltip content={<CustomChartTooltip suffix="mentions" />} />
                <Bar dataKey="value" fill="#6366F1" radius={[0, 4, 4, 0]} barSize={13} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </div>
  );
}

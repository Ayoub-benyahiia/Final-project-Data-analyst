"use client";

import { ChartCard } from "@/components/ui/ChartCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { CustomChartTooltip } from "@/components/ui/CustomChartTooltip";
import { ChartCardSkeleton } from "@/components/ui/Skeleton";
import { useDetailedAnalysis } from "@/modules/dashboard/hooks/useMarketData";
import { useFilters } from "@/modules/dashboard/hooks/useFilters";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#161719", "#10B981", "#06B6D4", "#F59E0B", "#6366F1", "#EC4899", "#8B5CF6", "#F43F5E"];

const formatCompactK = (val: number | string) => {
  const num = typeof val === "number" ? val : parseFloat(val);
  if (isNaN(num)) return String(val);
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}k`;
  return String(num);
};

const truncateLabel = (val: string, maxLen = 22) => {
  if (typeof val !== "string") return String(val);
  return val.length > maxLen ? `${val.slice(0, maxLen - 2)}…` : val;
};

export default function DetailedAnalysisPage() {
  const filters = useFilters();
  const { data, isPending } = useDetailedAnalysis(filters);

  if (isPending) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="mb-1">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Detailed Analysis</h1>
          <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            Deep-dive metrics into workplace models, industries, and hiring patterns.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <ChartCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const workplace = data?.workplace_model || [];
  const industry = data?.industry_sectors.map((s) => ({ name: s.sector, value: s.count })) || [];
  const cityGrowth = data?.city_growth_yoy.map((c) => ({ name: c.city, value: c.yoy_pct })) || [];
  const recruiters = data?.top_companies.map((c) => ({ name: c.name, value: c.count })) || [];
  const roles = data?.top_roles.map((r) => ({ name: r.title, value: r.count })) || [];

  return (
    <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="mb-1">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Detailed Analysis</h1>
        <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          Deep-dive metrics into workplace models, industries, and hiring patterns.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2 xl:grid-cols-3">
        {/* 1. Workplace Model */}
        <ChartCard title="Workplace Model" subtitle="On-site vs Hybrid vs Remote" height={240}>
          {workplace.length === 0 ? (
            <EmptyState className="h-full border-none p-3" />
          ) : (
            <div className="flex flex-col h-full justify-between">
              <ResponsiveContainer width="100%" height={165}>
                <PieChart>
                  <Pie
                    data={workplace}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={74}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="name"
                  >
                    {workplace.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomChartTooltip suffix="jobs" />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-3 pt-1">
                {workplace.map((entry, i) => (
                  <div key={entry.name} className="flex items-center gap-1">
                    <div
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
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

        {/* 2. Industry Sectors — Horizontal Bar with dedicated left margin & clean ellipsis */}
        <ChartCard title="Industry Sectors" subtitle="Jobs by industry vertical" height={240}>
          {industry.length === 0 ? (
            <EmptyState className="h-full border-none p-3" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={industry.slice(0, 6)}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 140, bottom: 10 }}
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
                  tickFormatter={(v) => truncateLabel(v, 22)}
                  tick={{ fontSize: 9.5, fill: "#475569" }}
                  axisLine={false}
                  tickLine={false}
                  width={140}
                />
                <Tooltip content={<CustomChartTooltip suffix="jobs" />} />
                <Bar dataKey="value" fill="#06B6D4" radius={[0, 4, 4, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* 3. YoY City Growth — Clean horizontal diverging bar layout */}
        <ChartCard title="YoY City Growth" subtitle="Annual job growth rate by hub" height={240}>
          {cityGrowth.length === 0 ? (
            <EmptyState className="h-full border-none p-3" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={cityGrowth.slice(0, 6)}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 70, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={true} vertical={false} />
                <XAxis
                  type="number"
                  unit="%"
                  tickFormatter={(v) => `${v}%`}
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
                  width={70}
                />
                <Tooltip content={<CustomChartTooltip prefix="+" suffix="%" />} />
                <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* 4. Top Recruiters — Horizontal bar layout with spacious label width */}
        <ChartCard title="Top Recruiters" subtitle="Companies with most postings" height={240} className="lg:col-span-2">
          {recruiters.length === 0 ? (
            <EmptyState className="h-full border-none p-3" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={recruiters.slice(0, 8)}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 110, bottom: 10 }}
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
                  tickFormatter={(v) => truncateLabel(v, 22)}
                  tick={{ fontSize: 9.5, fill: "#475569" }}
                  axisLine={false}
                  tickLine={false}
                  width={110}
                />
                <Tooltip content={<CustomChartTooltip suffix="postings" />} />
                <Bar dataKey="value" fill="#6366F1" radius={[0, 4, 4, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* 5. Top Roles — Ample space for job role labels */}
        <ChartCard title="Top Roles" subtitle="Most in-demand job titles" height={240}>
          {roles.length === 0 ? (
            <EmptyState className="h-full border-none p-3" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={roles.slice(0, 6)}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 130, bottom: 10 }}
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
                  tickFormatter={(v) => truncateLabel(v, 24)}
                  tick={{ fontSize: 9.5, fill: "#475569" }}
                  axisLine={false}
                  tickLine={false}
                  width={130}
                />
                <Tooltip content={<CustomChartTooltip suffix="jobs" />} />
                <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </div>
  );
}

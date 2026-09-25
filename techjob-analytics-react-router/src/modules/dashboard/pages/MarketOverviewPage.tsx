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

// Restrained, premium chart palette matching DESIGN.md
const DONUT_COLORS = ["#2b59d1", "#242424", "#a0b5eb", "#ff9473", "#ecda98", "#797776"];

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

export default function MarketOverviewPage() {
  const filters = useFilters();
  const { data: pulseData, isPending: isPulsePending } = useMarketPulse();
  const { data: overviewData, isPending: isOverviewPending } = useMarketOverview(filters);

  const isPending = isPulsePending || isOverviewPending;

  if (isPending) {
    return (
      <div className="space-y-8 animate-pulse font-mono">
        <div className="space-y-2">
          <div className="h-9 w-64 rounded-full bg-[#cecac8]/40" />
          <div className="h-4 w-96 rounded-full bg-[#cecac8]/20" />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <KPICardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="col-span-12 lg:col-span-8"><ChartCardSkeleton /></div>
          <div className="col-span-12 lg:col-span-4"><ChartCardSkeleton /></div>
          <div className="col-span-12 lg:col-span-4"><ChartCardSkeleton /></div>
          <div className="col-span-12 lg:col-span-3"><ChartCardSkeleton /></div>
          <div className="col-span-12 lg:col-span-5"><ChartCardSkeleton /></div>
        </div>
      </div>
    );
  }

  // Ground-truth KPI metrics from DuckDB OLAP engine
  const kpis: KPIData[] = pulseData
    ? [
        {
          label: "Total Job Postings",
          value: pulseData.total_jobs.toLocaleString(),
          changeLabel: "aggregated records",
          icon: "Briefcase",
        },
        {
          label: "Active Employers",
          value: pulseData.total_companies.toLocaleString(),
          changeLabel: "hiring organizations",
          icon: "Building2",
        },
        {
          label: "Regional Coverage",
          value: `${pulseData.total_cities} Cities`,
          changeLabel: "Moroccan tech hubs",
          icon: "MapPin",
        },
        {
          label: "Remote Flexibility",
          value: `${pulseData.remote_flexibility_pct}%`,
          changeLabel: "hybrid / remote",
          icon: "Zap",
        },
        {
          label: "Avg. Experience",
          value: `${pulseData.avg_experience_years.toFixed(1)} Years`,
          changeLabel: "required seniority",
          icon: "GraduationCap",
        },
      ]
    : [];

  const contracts = overviewData?.contract_distribution || [];
  const trend = overviewData?.yearly_trend.map((t) => ({ name: String(t.year), value: t.count })) || [];
  const regional = overviewData?.regional_hubs.map((r) => ({
    name: r.city,
    value: r.count,
  })) || [];
  const education = overviewData?.education_levels.map((e) => ({ name: e.level, value: e.count })) || [];
  const skills = overviewData?.top_technologies.map((t) => ({
    name: t.name,
    value: t.count,
  })) || [];

  return (
    <div className="space-y-8 animate-fade-in font-mono">
      {/* 01 — EDITORIAL PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-[#cecac8] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-[#2b59d1]" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#797776]">
              Market Intelligence Platform
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#242424] tracking-[-0.02em]">
            Market Overview
          </h1>
          <p className="mt-1 font-mono text-xs sm:text-sm text-[#4e4d4d] max-w-2xl leading-relaxed">
            Morocco's technology employment market, decoded through{" "}
            <span className="text-[#242424] font-medium">
              {pulseData?.total_jobs.toLocaleString() || "10,782"}+ job postings
            </span>
            .
          </p>
        </div>

        {/* Metadata Chips */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto font-mono">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#cecac8] bg-[#f6f3f1] px-4 py-1.5 text-xs text-[#242424]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#a7fccd] border border-[#242424]/30" />
            Live Market Feed
          </span>
          <span className="inline-flex items-center rounded-full border border-[#cecac8] bg-[#f6f3f1] px-4 py-1.5 text-xs text-[#242424]">
            {pulseData?.total_cities || 27} Cities
          </span>
          <span className="inline-flex items-center rounded-full border border-[#cecac8] bg-[#f6f3f1] px-4 py-1.5 text-xs text-[#242424]">
            {pulseData?.total_companies.toLocaleString() || "2,767"} Employers
          </span>
        </div>
      </div>

      {/* 02 — ASYMMETRIC KPI SECTION */}
      {kpis.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
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

      {/* 03 — ASYMMETRIC ANALYTICAL CHART GRID MATCHING REFERENCE */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Row 1, Left (8 cols): Historical Trend with Lake Blue Gradient Fill */}
        <div className="col-span-12 lg:col-span-8">
          <ChartCard
            title="Historical Job Market Trend"
            subtitle="Annual posting volume across Moroccan tech sectors"
            height={250}
          >
            {trend.length === 0 ? (
              <EmptyState className="h-full border-none p-3" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="marketTrendLakeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2b59d1" stopOpacity="0.25" />
                      <stop offset="95%" stopColor="#2b59d1" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cecac8" strokeOpacity={0.6} vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#797776", fontFamily: "'ABC Diatype Mono', monospace" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={formatCompactK}
                    tick={{ fontSize: 11, fill: "#797776", fontFamily: "'ABC Diatype Mono', monospace" }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                  />
                  <Tooltip content={<CustomChartTooltip suffix="postings" />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#2b59d1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#marketTrendLakeGradient)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        {/* Row 1, Right (4 cols): Contract Distribution */}
        <div className="col-span-12 lg:col-span-4">
          <ChartCard
            title="Contract Distribution"
            subtitle="Breakdown by employment agreement type"
            height={250}
          >
            {contracts.length === 0 ? (
              <EmptyState className="h-full border-none p-3" />
            ) : (
              <div className="flex flex-col h-full justify-between">
                <ResponsiveContainer width="100%" height={165}>
                  <PieChart>
                    <Pie
                      data={contracts}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={72}
                      paddingAngle={2}
                      dataKey="count"
                      nameKey="name"
                      isAnimationActive={false}
                    >
                      {contracts.map((_, i) => (
                        <Cell
                          key={i}
                          fill={DONUT_COLORS[i % DONUT_COLORS.length]}
                          stroke="#f6f3f1"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomChartTooltip suffix="jobs" />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-x-3.5 gap-y-1.5 pt-3 border-t border-[#cecac8]/60">
                  {contracts.slice(0, 4).map((entry, i) => (
                    <div key={entry.name} className="flex items-center gap-1.5">
                      <div
                        className="h-2 w-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }}
                      />
                      <span className="text-[11px] font-mono text-[#4e4d4d]">
                        {entry.name} <strong className="text-[#242424] font-medium">({entry.pct}%)</strong>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ChartCard>
        </div>

        {/* Row 2, Left (4 cols): Regional Tech Hubs */}
        <div className="col-span-12 lg:col-span-4">
          <ChartCard
            title="Regional Tech Hubs"
            subtitle="Job volume concentrated across major economic zones"
            height={250}
          >
            {regional.length === 0 ? (
              <EmptyState className="h-full border-none p-3" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={regional.slice(0, 6)}
                  layout="vertical"
                  margin={{ top: 6, right: 20, left: 65, bottom: 6 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#cecac8" strokeOpacity={0.6} horizontal={true} vertical={false} />
                  <XAxis
                    type="number"
                    tickFormatter={formatCompactK}
                    tick={{ fontSize: 11, fill: "#797776", fontFamily: "'ABC Diatype Mono', monospace" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: 11, fill: "#242424", fontFamily: "'ABC Diatype Mono', monospace" }}
                    axisLine={false}
                    tickLine={false}
                    width={65}
                  />
                  <Tooltip content={<CustomChartTooltip suffix="jobs" />} />
                  <Bar dataKey="value" radius={[0, 9999, 9999, 0]} barSize={14} isAnimationActive={false}>
                    {regional.slice(0, 6).map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? "#2b59d1" : "#242424"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        {/* Row 2, Middle (3 cols): Required Education Levels */}
        <div className="col-span-12 lg:col-span-3">
          <ChartCard
            title="Required Education Levels"
            subtitle="Minimum academic prerequisites specified by recruiters"
            height={250}
          >
            {education.length === 0 ? (
              <EmptyState className="h-full border-none p-3" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={education} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cecac8" strokeOpacity={0.6} vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "#797776", fontFamily: "'ABC Diatype Mono', monospace" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={formatCompactK}
                    tick={{ fontSize: 10, fill: "#797776", fontFamily: "'ABC Diatype Mono', monospace" }}
                    axisLine={false}
                    tickLine={false}
                    width={35}
                  />
                  <Tooltip content={<CustomChartTooltip suffix="jobs" />} />
                  <Bar dataKey="value" radius={[9999, 9999, 0, 0]} barSize={20} isAnimationActive={false}>
                    {education.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? "#2b59d1" : index === 1 ? "#242424" : "#797776"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        {/* Row 2, Right (5 cols): Top Demanded Technologies & Skills */}
        <div className="col-span-12 lg:col-span-5">
          <ChartCard
            title="Top Demanded Technologies & Skills"
            subtitle="Most prevalent hard skills and frameworks extracted across postings"
            height={250}
          >
            {skills.length === 0 ? (
              <EmptyState className="h-full border-none p-3" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={skills.slice(0, 8)}
                  layout="vertical"
                  margin={{ top: 4, right: 25, left: 80, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#cecac8" strokeOpacity={0.6} horizontal={true} vertical={false} />
                  <XAxis
                    type="number"
                    tickFormatter={formatCompactK}
                    tick={{ fontSize: 10, fill: "#797776", fontFamily: "'ABC Diatype Mono', monospace" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tickFormatter={(v) => truncateLabel(v, 18)}
                    tick={{ fontSize: 10, fill: "#242424", fontFamily: "'ABC Diatype Mono', monospace" }}
                    axisLine={false}
                    tickLine={false}
                    width={80}
                  />
                  <Tooltip content={<CustomChartTooltip suffix="postings" />} />
                  <Bar dataKey="value" radius={[0, 9999, 9999, 0]} barSize={12} isAnimationActive={false}>
                    {skills.slice(0, 8).map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index < 2 ? "#2b59d1" : "#242424"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>
      </div>
    </div>
  );
}


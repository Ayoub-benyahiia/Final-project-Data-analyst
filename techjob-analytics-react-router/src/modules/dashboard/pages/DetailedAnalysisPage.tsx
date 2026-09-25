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

// Restrained, premium chart palette matching DESIGN.md
const DONUT_COLORS = ["#2b59d1", "#242424", "#a0b5eb", "#ff9473", "#ecda98"];

const formatCompactK = (val: number | string) => {
  const num = typeof val === "number" ? val : parseFloat(val);
  if (isNaN(num)) return String(val);
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}k`;
  return String(num);
};

const truncateLabel = (val: string, maxLen = 26) => {
  if (typeof val !== "string") return String(val);
  return val.length > maxLen ? `${val.slice(0, maxLen - 2)}…` : val;
};

export default function DetailedAnalysisPage() {
  const filters = useFilters();
  const { data, isPending } = useDetailedAnalysis(filters);

  if (isPending) {
    return (
      <div className="space-y-8 animate-pulse font-mono">
        <div className="space-y-2">
          <div className="h-9 w-64 rounded-full bg-[#cecac8]/40" />
          <div className="h-4 w-96 rounded-full bg-[#cecac8]/20" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="col-span-12 lg:col-span-5"><ChartCardSkeleton /></div>
          <div className="col-span-12 lg:col-span-7"><ChartCardSkeleton /></div>
          <div className="col-span-12 lg:col-span-6"><ChartCardSkeleton /></div>
          <div className="col-span-12 lg:col-span-6"><ChartCardSkeleton /></div>
          <div className="col-span-12"><ChartCardSkeleton /></div>
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
    <div className="space-y-8 animate-fade-in font-mono">
      {/* 01 — EDITORIAL PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-[#cecac8] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-[#2b59d1]" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#797776]">
              Deep-Dive Market Metrics
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#242424] tracking-[-0.02em]">
            Detailed Market Analysis
          </h1>
          <p className="mt-1 font-mono text-xs sm:text-sm text-[#4e4d4d] max-w-2xl leading-relaxed">
            Granular workplace modalities, industry verticals, city hiring growth, and top recruiting companies.
          </p>
        </div>
      </div>

      {/* 02 — CHARTS GRID */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Row 1, Left (5 cols): Workplace Model */}
        <div className="col-span-12 lg:col-span-5">
          <ChartCard
            title="Workplace Model"
            subtitle="Modality distribution (On-site, Hybrid, Remote)"
            height={250}
          >
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
                      innerRadius={48}
                      outerRadius={72}
                      paddingAngle={2}
                      dataKey="count"
                      nameKey="name"
                      isAnimationActive={false}
                    >
                      {workplace.map((_, i) => (
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
                <div className="flex justify-center gap-4 pt-3 border-t border-[#cecac8]/60">
                  {workplace.map((entry, i) => (
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

        {/* Row 1, Right (7 cols): Industry Sectors */}
        <div className="col-span-12 lg:col-span-7">
          <ChartCard
            title="Industry Sectors"
            subtitle="Job volume by industry vertical"
            height={250}
          >
            {industry.length === 0 ? (
              <EmptyState className="h-full border-none p-3" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={industry.slice(0, 6)}
                  layout="vertical"
                  margin={{ top: 6, right: 20, left: 140, bottom: 6 }}
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
                    tickFormatter={(v) => truncateLabel(v, 26)}
                    tick={{ fontSize: 11, fill: "#242424", fontFamily: "'ABC Diatype Mono', monospace" }}
                    axisLine={false}
                    tickLine={false}
                    width={140}
                  />
                  <Tooltip content={<CustomChartTooltip suffix="jobs" />} />
                  <Bar dataKey="value" radius={[0, 9999, 9999, 0]} barSize={14} isAnimationActive={false}>
                    {industry.slice(0, 6).map((_, index) => (
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

        {/* Row 2, Left (6 cols): YoY City Growth */}
        <div className="col-span-12 lg:col-span-6">
          <ChartCard
            title="YoY City Growth Rate"
            subtitle="Annual hiring expansion rate by city"
            height={250}
          >
            {cityGrowth.length === 0 ? (
              <EmptyState className="h-full border-none p-3" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={cityGrowth.slice(0, 6)}
                  layout="vertical"
                  margin={{ top: 6, right: 20, left: 75, bottom: 6 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#cecac8" strokeOpacity={0.6} horizontal={true} vertical={false} />
                  <XAxis
                    type="number"
                    unit="%"
                    tickFormatter={(v) => `${v}%`}
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
                    width={75}
                  />
                  <Tooltip content={<CustomChartTooltip prefix="+" suffix="%" />} />
                  <Bar dataKey="value" fill="#2b59d1" radius={[0, 9999, 9999, 0]} barSize={14} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        {/* Row 2, Right (6 cols): Top Recruiters */}
        <div className="col-span-12 lg:col-span-6">
          <ChartCard
            title="Top Hiring Companies"
            subtitle="Organizations with highest active job volume"
            height={250}
          >
            {recruiters.length === 0 ? (
              <EmptyState className="h-full border-none p-3" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={recruiters.slice(0, 6)}
                  layout="vertical"
                  margin={{ top: 6, right: 20, left: 100, bottom: 6 }}
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
                    tickFormatter={(v) => truncateLabel(v, 20)}
                    tick={{ fontSize: 11, fill: "#242424", fontFamily: "'ABC Diatype Mono', monospace" }}
                    axisLine={false}
                    tickLine={false}
                    width={100}
                  />
                  <Tooltip content={<CustomChartTooltip suffix="postings" />} />
                  <Bar dataKey="value" radius={[0, 9999, 9999, 0]} barSize={14} isAnimationActive={false}>
                    {recruiters.slice(0, 6).map((_, index) => (
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

        {/* Row 3 (12 cols): Most In-Demand Job Titles */}
        <div className="col-span-12">
          <ChartCard
            title="Most In-Demand Job Roles"
            subtitle="Standardized job titles ranked by employer demand"
            height={260}
          >
            {roles.length === 0 ? (
              <EmptyState className="h-full border-none p-3" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={roles.slice(0, 8)}
                  layout="vertical"
                  margin={{ top: 6, right: 25, left: 140, bottom: 6 }}
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
                    tickFormatter={(v) => truncateLabel(v, 26)}
                    tick={{ fontSize: 11, fill: "#242424", fontFamily: "'ABC Diatype Mono', monospace" }}
                    axisLine={false}
                    tickLine={false}
                    width={140}
                  />
                  <Tooltip content={<CustomChartTooltip suffix="jobs" />} />
                  <Bar dataKey="value" radius={[0, 9999, 9999, 0]} barSize={14} isAnimationActive={false}>
                    {roles.slice(0, 8).map((_, index) => (
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


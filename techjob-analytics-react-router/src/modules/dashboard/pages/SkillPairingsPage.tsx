import { useState } from "react";
import { KPICard } from "@/components/ui/KpiCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { CustomChartTooltip } from "@/components/ui/CustomChartTooltip";
import { KPICardSkeleton, ChartCardSkeleton } from "@/components/ui/Skeleton";
import { TECHNOLOGIES } from "@/lib/data";
import { useSkillPairings, useSkillsList } from "@/modules/dashboard/hooks/useMarketData";
import { useFilters } from "@/modules/dashboard/hooks/useFilters";
import { cn } from "@/lib/utils";
import { Search, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const formatCompactK = (val: number | string) => {
  const num = typeof val === "number" ? val : parseFloat(val);
  if (isNaN(num)) return String(val);
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}k`;
  return String(num);
};

const truncateLabel = (val: string, maxLen = 22) => {
  if (typeof val !== "string") return String(val);
  return val.length > maxLen ? `${val.slice(0, maxLen - 1)}…` : val;
};

export default function SkillPairingsPage() {
  const filters = useFilters();
  const [selectedSkill, setSelectedSkill] = useState("React");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: skillsListData } = useSkillsList();
  const { data, isPending } = useSkillPairings(selectedSkill, filters);

  const availableTechs = skillsListData && skillsListData.length > 0
    ? skillsListData.map((s) => s.name)
    : TECHNOLOGIES;

  const filteredTechs = availableTechs.filter((t) =>
    t.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isPending) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="space-y-3">
          <div className="h-9 w-64 rounded-full bg-ash/40" />
          <div className="h-4 w-96 rounded-full bg-ash/20" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <KPICardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="col-span-12 lg:col-span-1 space-y-6">
            <ChartCardSkeleton />
            <ChartCardSkeleton />
          </div>
          <div className="col-span-12 lg:col-span-2 space-y-6">
            <ChartCardSkeleton />
            <ChartCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  const pairings = data?.pairings || [];
  const categories = data?.pairings_by_category.map((c) => ({ name: c.category, value: c.count })) || [];
  const roles = data?.top_roles_for_stack.map((r) => ({ name: r.title, value: r.count })) || [];
  const topCompanion = data?.top_companion_skill || "Spring Boot";
  const avgSkills = data?.avg_skills_per_job ?? 4.2;

  const topCompanionItem = pairings.find((p) => p.skill === topCompanion);
  const topCooccurrencePct = topCompanionItem ? topCompanionItem.cooccurrence_pct : (pairings[0]?.cooccurrence_pct || 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 01 — EDITORIAL PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-ash pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lake-blue" />
            <span className="text-[10px] font-mono font-normal tracking-widest text-graphite uppercase">
              Technology Synergy Intelligence
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-normal text-off-black tracking-[-0.02em]">
            Skill Pairings & Tech Synergy
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-mono text-graphite max-w-2xl leading-relaxed">
            Analyze companion technologies, co-occurrence frequencies, and associated job roles across Moroccan IT listings.
          </p>
        </div>
      </div>

      {/* 02 — 3 KPI CARDS */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <KPICard
          data={{
            label: "Core Skill",
            value: data?.selected_core_skill || selectedSkill,
            changeLabel: "active anchor technology",
            icon: "Target",
          }}
          variant="hero"
        />
        <KPICard
          data={{
            label: "Top Companion Skill",
            value: topCompanion,
            change: topCooccurrencePct,
            changeLabel: "% co-occurrence rate",
            icon: "Users",
          }}
        />
        <KPICard
          data={{
            label: "Avg Skills / Job",
            value: String(avgSkills),
            changeLabel: "technologies per posting",
            icon: "Code2",
          }}
        />
      </div>

      {/* 03 — MAIN INTERACTION GRID */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
        <div className="col-span-12 lg:col-span-1 space-y-6">
          {/* Core Technology Slicer Card */}
          <div className="rounded-[28px] sm:rounded-[40px] border border-ash bg-white/70 backdrop-blur-xs p-6 sm:p-8">
            <h2 className="mb-1 font-serif text-xl font-normal text-off-black tracking-[-0.02em]">
              Select Core Technology
            </h2>
            <p className="mb-4 text-xs font-mono text-graphite">
              Filter synergies by anchor tool
            </p>

            <div className="relative mb-4">
              <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-graphite" />
              <input
                type="text"
                placeholder="Search technology..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-ash bg-parchment/60 py-2 pl-9 pr-4 text-xs font-mono text-ink placeholder:text-smoke focus:border-lake-blue focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <div className="max-h-56 overflow-auto custom-scrollbar space-y-1.5 pr-1">
              {filteredTechs.length === 0 ? (
                <p className="p-4 text-xs font-mono text-graphite text-center">No matching technologies</p>
              ) : (
                filteredTechs.slice(0, 35).map((tech) => {
                  const isSelected = selectedSkill.toLowerCase() === tech.toLowerCase();
                  return (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => setSelectedSkill(tech)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-full px-3.5 py-2 text-xs transition-all font-mono text-left",
                        isSelected
                          ? "bg-off-black text-parchment font-medium shadow-xs"
                          : "text-graphite hover:bg-black/5 hover:text-off-black"
                      )}
                    >
                      <span>{tech}</span>
                      {isSelected && (
                        <ArrowRight className="h-3 w-3 text-sky-blue stroke-[2]" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Co-occurrence % Chart */}
          <ChartCard
            title="Co-occurrence Rate"
            subtitle={`Top companion skills paired with ${data?.selected_core_skill || selectedSkill}`}
            height={260}
          >
            {pairings.length === 0 ? (
              <EmptyState className="h-full border-none p-3" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pairings.slice(0, 6)} layout="vertical" margin={{ top: 8, right: 24, left: 75, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke="#cecac8" horizontal={true} vertical={false} />
                  <XAxis
                    type="number"
                    unit="%"
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 10, fill: "#767270", fontFamily: "Space Mono, monospace" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    dataKey="skill"
                    type="category"
                    tick={{ fontSize: 11, fill: "#242424", fontFamily: "Space Mono, monospace", fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                    width={75}
                  />
                  <Tooltip content={<CustomChartTooltip suffix="%" />} />
                  <Bar dataKey="cooccurrence_pct" radius={[0, 9999, 9999, 0]} barSize={12} isAnimationActive={false}>
                    {pairings.slice(0, 6).map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? "#2b59d1" : index === 1 ? "#242424" : "#767270"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        <div className="col-span-12 lg:col-span-2 space-y-6">
          {/* Pairings by Category */}
          <ChartCard title="Pairings by Category" subtitle="Domain distribution for companion skills" height={260}>
            {categories.length === 0 ? (
              <EmptyState className="h-full border-none p-3" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categories} margin={{ top: 12, right: 20, left: -10, bottom: 12 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke="#cecac8" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "#767270", fontFamily: "Space Mono, monospace" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={formatCompactK}
                    tick={{ fontSize: 10, fill: "#767270", fontFamily: "Space Mono, monospace" }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                  />
                  <Tooltip content={<CustomChartTooltip suffix="pairs" />} />
                  <Bar dataKey="value" fill="#2b59d1" radius={[9999, 9999, 0, 0]} barSize={24} isAnimationActive={false}>
                    {categories.map((_, index) => (
                      <Cell
                        key={`cat-${index}`}
                        fill={index % 2 === 0 ? "#2b59d1" : "#242424"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* Associated Job Roles */}
          <ChartCard
            title="Associated Job Roles"
            subtitle={`Titles most frequently requesting ${data?.selected_core_skill || selectedSkill}`}
            height={260}
          >
            {roles.length === 0 ? (
              <EmptyState className="h-full border-none p-3" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roles.slice(0, 6)} layout="vertical" margin={{ top: 8, right: 24, left: 140, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke="#cecac8" horizontal={true} vertical={false} />
                  <XAxis
                    type="number"
                    tickFormatter={formatCompactK}
                    tick={{ fontSize: 10, fill: "#767270", fontFamily: "Space Mono, monospace" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tickFormatter={(v) => truncateLabel(v, 22)}
                    tick={{ fontSize: 11, fill: "#242424", fontFamily: "Space Mono, monospace", fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                    width={140}
                  />
                  <Tooltip content={<CustomChartTooltip suffix="jobs" />} />
                  <Bar dataKey="value" radius={[0, 9999, 9999, 0]} barSize={12} isAnimationActive={false}>
                    {roles.slice(0, 6).map((_, index) => (
                      <Cell
                        key={`role-${index}`}
                        fill={index === 0 ? "#2b59d1" : index === 1 ? "#242424" : "#767270"}
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

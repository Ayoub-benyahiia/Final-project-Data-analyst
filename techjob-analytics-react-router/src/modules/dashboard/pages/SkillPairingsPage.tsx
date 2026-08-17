"use client";

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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const formatCompactK = (val: number | string) => {
  const num = typeof val === "number" ? val : parseFloat(val);
  if (isNaN(num)) return String(val);
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}k`;
  return String(num);
};

const truncateLabel = (val: string, maxLen = 24) => {
  if (typeof val !== "string") return String(val);
  return val.length > maxLen ? `${val.slice(0, maxLen - 2)}…` : val;
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
      <div className="space-y-4 animate-pulse">
        <div className="mb-1">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Skill Pairings</h1>
          <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            Discover which technologies co-occur most frequently with {selectedSkill} in job postings.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <KPICardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-3">
          <div className="space-y-3.5">
            <ChartCardSkeleton />
            <ChartCardSkeleton />
          </div>
          <div className="lg:col-span-2 space-y-3.5">
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
    <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="mb-1">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Skill Pairings</h1>
        <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          Discover which technologies co-occur most frequently with {data?.selected_core_skill || selectedSkill} in job postings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KPICard
          data={{
            label: "Core Skill",
            value: data?.selected_core_skill || selectedSkill,
            icon: "Target",
            color: "indigo",
          }}
          variant="hero"
        />
        <KPICard
          data={{
            label: "Top Companion Skill",
            value: topCompanion,
            change: topCooccurrencePct,
            changeLabel: "% co-occurrence",
            icon: "Users",
            color: "emerald",
          }}
        />
        <KPICard
          data={{
            label: "Avg Skills / Job",
            value: String(avgSkills),
            icon: "Code2",
            color: "cyan",
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-3">
        <div className="space-y-3.5">
          {/* Core Technology Slicer Card */}
          <div className="rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-[#1E1F24] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-sm transition-all">
            <label className="mb-2 block text-xs font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Select Core Technology
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search technology..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161719] py-1.5 pl-8 pr-3 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-slate-900 dark:focus:border-[#D4F84B] focus:outline-none"
              />
            </div>

            <div className="mt-2.5 max-h-44 overflow-auto custom-scrollbar space-y-0.5 pr-1">
              {filteredTechs.length === 0 ? (
                <p className="p-2 text-xs text-slate-400 text-center">No matching technologies</p>
              ) : (
                filteredTechs.slice(0, 25).map((tech) => (
                  <button
                    key={tech}
                    onClick={() => setSelectedSkill(tech)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs transition-all font-medium",
                      selectedSkill.toLowerCase() === tech.toLowerCase()
                        ? "bg-slate-900 dark:bg-[#D4F84B] text-white dark:text-[#161719] font-bold shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:text-slate-900"
                    )}
                  >
                    <span>{tech}</span>
                    {selectedSkill.toLowerCase() === tech.toLowerCase() && (
                      <ArrowRight className="h-3 w-3 stroke-[2.5]" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Co-occurrence % Chart */}
          <ChartCard
            title="Co-occurrence %"
            subtitle={`Skills paired with ${data?.selected_core_skill || selectedSkill}`}
            height={240}
          >
            {pairings.length === 0 ? (
              <EmptyState className="h-full border-none p-3" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pairings.slice(0, 6)} layout="vertical" margin={{ top: 8, right: 20, left: 80, bottom: 8 }}>
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
                    dataKey="skill"
                    type="category"
                    tick={{ fontSize: 9.5, fill: "#475569" }}
                    axisLine={false}
                    tickLine={false}
                    width={80}
                  />
                  <Tooltip content={<CustomChartTooltip suffix="%" />} />
                  <Bar dataKey="cooccurrence_pct" fill="#161719" radius={[0, 4, 4, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        <div className="lg:col-span-2 space-y-3.5">
          {/* Pairings by Category */}
          <ChartCard title="Pairings by Category" subtitle="Grouped by technology domain" height={240}>
            {categories.length === 0 ? (
              <EmptyState className="h-full border-none p-3" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categories} margin={{ top: 10, right: 15, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis
                    tickFormatter={formatCompactK}
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                    width={38}
                  />
                  <Tooltip content={<CustomChartTooltip suffix="pairs" />} />
                  <Bar dataKey="value" fill="#06B6D4" radius={[4, 4, 0, 0]} barSize={22} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* Top Roles — Horizontal Bar with dedicated 160px width & clean ellipsis */}
          <ChartCard title="Top Roles" subtitle={`Roles requiring ${data?.selected_core_skill || selectedSkill}`} height={240}>
            {roles.length === 0 ? (
              <EmptyState className="h-full border-none p-3" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roles.slice(0, 6)} layout="vertical" margin={{ top: 10, right: 20, left: 160, bottom: 10 }}>
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
                    width={160}
                  />
                  <Tooltip content={<CustomChartTooltip suffix="jobs" />} />
                  <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

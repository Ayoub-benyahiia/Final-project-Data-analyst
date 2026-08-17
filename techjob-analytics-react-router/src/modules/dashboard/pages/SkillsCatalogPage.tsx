"use client";

import { useState, useMemo } from "react";
import { KPICard } from "@/components/ui/KpiCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { KPICardSkeleton, ChartCardSkeleton } from "@/components/ui/Skeleton";
import { useSkillsCatalog } from "@/modules/dashboard/hooks/useMarketData";
import { cn } from "@/lib/utils";
import { Search, Code2, Users, Filter, Sparkles, Trophy } from "lucide-react";

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Frontend: {
    bg: "bg-cyan-50 dark:bg-cyan-950/40",
    text: "text-cyan-700 dark:text-cyan-400",
    border: "border-cyan-200/80 dark:border-cyan-800",
  },
  Backend: {
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    text: "text-indigo-700 dark:text-indigo-400",
    border: "border-indigo-200/80 dark:border-indigo-800",
  },
  "Cloud & DevOps": {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200/80 dark:border-amber-800",
  },
  Database: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200/80 dark:border-emerald-800",
  },
  "Data & AI": {
    bg: "bg-purple-50 dark:bg-purple-950/40",
    text: "text-purple-700 dark:text-purple-400",
    border: "border-purple-200/80 dark:border-purple-800",
  },
  Language: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200/80 dark:border-blue-800",
  },
  Mobile: {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-200/80 dark:border-rose-800",
  },
  Testing: {
    bg: "bg-teal-50 dark:bg-teal-950/40",
    text: "text-teal-700 dark:text-teal-400",
    border: "border-teal-200/80 dark:border-teal-800",
  },
  Other: {
    bg: "bg-slate-50 dark:bg-slate-900",
    text: "text-slate-700 dark:text-slate-300",
    border: "border-slate-200 dark:border-slate-800",
  },
};

export default function SkillsCatalogPage() {
  const { data, isPending } = useSkillsCatalog();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const hardSkills = data?.hard_skills || [];
  const softSkills = data?.soft_skills || [];

  const categories = useMemo(() => {
    const set = new Set<string>();
    hardSkills.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return ["All", ...Array.from(set).sort()];
  }, [hardSkills]);

  const filteredHardSkills = useMemo(() => {
    return hardSkills.filter((skill) => {
      const matchesSearch =
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || skill.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [hardSkills, searchQuery, selectedCategory]);

  const filteredSoftSkills = useMemo(() => {
    return softSkills.filter((skill) =>
      skill.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [softSkills, searchQuery]);

  if (isPending) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <KPICardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCardSkeleton />
          <ChartCardSkeleton />
        </div>
      </div>
    );
  }

  const topHard = hardSkills[0]?.name || "Java";
  const topSoft = softSkills[0]?.name || "Travail en équipe";

  return (
    <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
      {/* Page Header */}
      <div className="mb-1">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 tracking-tight">
          <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          Skills Catalog & Frequency Matrix
        </h1>
        <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          Comprehensive benchmark of all 121 hard technologies and 50 soft competencies extracted across Moroccan job offers.
        </p>
      </div>

      {/* KPI Header Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          data={{
            label: "Total Hard Technologies",
            value: data?.total_hard_skills || 121,
            icon: "Code2",
            color: "indigo",
          }}
          variant="hero"
        />
        <KPICard
          data={{
            label: "Total Soft Skills",
            value: data?.total_soft_skills || 50,
            icon: "Users",
            color: "cyan",
          }}
        />
        <KPICard
          data={{
            label: "Top Tech Demand",
            value: topHard,
            change: hardSkills[0]?.percentage || 22.2,
            changeLabel: "% of listings",
            icon: "Target",
            color: "emerald",
          }}
        />
        <KPICard
          data={{
            label: "Top Soft Skill",
            value: topSoft,
            change: softSkills[0]?.percentage || 45.8,
            changeLabel: "% of listings",
            icon: "Zap",
            color: "amber",
          }}
        />
      </div>

      {/* Search & Domain Filter Bar */}
      <div className="rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-[#1E1F24] p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-sm transition-all">
        <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search skill (e.g. React, Docker)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161719] py-1.5 pl-8 pr-3 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-slate-900 dark:focus:border-[#D4F84B] focus:outline-none"
            />
          </div>

          {/* Category Pills with Moderate Rounded Radius */}
          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-0.5 max-w-2xl">
            <Filter className="h-3 w-3 text-slate-400 mr-1 flex-shrink-0" />
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "flex-shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all",
                    isActive
                      ? "bg-slate-900 dark:bg-[#D4F84B] text-white dark:text-[#161719] shadow-sm"
                      : "border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#161719] text-slate-600 dark:text-slate-400 hover:border-slate-300"
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two Parallel Columns */}
      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
        {/* Left Column: Hard Skills */}
        <div className="rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-[#1E1F24] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-sm transition-all flex flex-col h-[520px]">
          <div className="mb-2.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <Code2 className="h-3.5 w-3.5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Hard Technologies & Frameworks
              </h3>
            </div>
            <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.2 text-[10px] font-bold text-slate-600 dark:text-slate-300">
              {filteredHardSkills.length} skills
            </span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-1.5">
            {filteredHardSkills.length === 0 ? (
              <EmptyState
                title="No technologies match your search"
                description="Try modifying your keyword or resetting category filters."
                className="h-44 border-none"
              />
            ) : (
              filteredHardSkills.map((skill, index) => {
                const colorConfig = CATEGORY_COLORS[skill.category] || CATEGORY_COLORS.Other;
                const isTop3 = index < 3 && selectedCategory === "All" && !searchQuery;

                return (
                  <div
                    key={skill.name}
                    className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#161719]/50 hover:bg-slate-100/70 dark:hover:bg-white/[0.04] transition-all group"
                  >
                    {/* Rank Badge */}
                    <div
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold flex-shrink-0",
                        isTop3
                          ? "bg-slate-900 text-[#D4F84B] dark:bg-[#D4F84B] dark:text-[#161719]"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      )}
                    >
                      {isTop3 ? <Trophy className="h-2.5 w-2.5" /> : `#${index + 1}`}
                    </div>

                    {/* Skill Name & Category */}
                    <div className="w-32 flex-shrink-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-[#D4F84B] transition-colors truncate">
                        {skill.name}
                      </div>
                      <span
                        className={cn(
                          "inline-block rounded px-1 py-0.2 text-[9px] font-semibold border mt-0.2",
                          colorConfig.bg,
                          colorConfig.text,
                          colorConfig.border
                        )}
                      >
                        {skill.category}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex-1 min-w-[70px]">
                      <div className="h-1.5 rounded-full bg-slate-200/80 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-slate-900 dark:bg-[#D4F84B] transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(3, skill.percentage * 3.5))}%` }}
                        />
                      </div>
                    </div>

                    {/* Count & % Metric */}
                    <div className="text-right flex-shrink-0 w-20">
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                        {skill.count.toLocaleString()} <span className="font-normal text-slate-400 text-[10px]">jobs</span>
                      </div>
                      <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                        {skill.percentage}%
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Soft Skills */}
        <div className="rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-[#1E1F24] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-sm transition-all flex flex-col h-[520px]">
          <div className="mb-2.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <Users className="h-3.5 w-3.5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Soft & Behavioral Competencies
              </h3>
            </div>
            <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.2 text-[10px] font-bold text-slate-600 dark:text-slate-300">
              {filteredSoftSkills.length} competencies
            </span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-1.5">
            {filteredSoftSkills.length === 0 ? (
              <EmptyState
                title="No soft skills match your search"
                description="Try another keyword in the search bar."
                className="h-44 border-none"
              />
            ) : (
              filteredSoftSkills.map((skill, index) => {
                const isTop3 = index < 3 && !searchQuery;

                return (
                  <div
                    key={skill.name}
                    className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#161719]/50 hover:bg-slate-100/70 dark:hover:bg-white/[0.04] transition-all group"
                  >
                    {/* Rank Badge */}
                    <div
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold flex-shrink-0",
                        isTop3
                          ? "bg-cyan-600 text-white dark:bg-cyan-400 dark:text-[#161719]"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      )}
                    >
                      {isTop3 ? <Trophy className="h-2.5 w-2.5" /> : `#${index + 1}`}
                    </div>

                    {/* Skill Name */}
                    <div className="w-36 flex-shrink-0 text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors truncate">
                      {skill.name}
                    </div>

                    {/* Progress Bar */}
                    <div className="flex-1 min-w-[70px]">
                      <div className="h-1.5 rounded-full bg-slate-200/80 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-cyan-500 dark:bg-cyan-400 transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(3, skill.percentage * 1.8))}%` }}
                        />
                      </div>
                    </div>

                    {/* Count & % Metric */}
                    <div className="text-right flex-shrink-0 w-20">
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                        {skill.count.toLocaleString()} <span className="font-normal text-slate-400 text-[10px]">jobs</span>
                      </div>
                      <div className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 tabular-nums">
                        {skill.percentage}%
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

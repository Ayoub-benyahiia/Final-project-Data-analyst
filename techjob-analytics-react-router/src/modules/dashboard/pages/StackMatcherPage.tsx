"use client";

import { useState } from "react";
import { KPICard } from "@/components/ui/KpiCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { CustomChartTooltip } from "@/components/ui/CustomChartTooltip";
import { KPICardSkeleton, ChartCardSkeleton } from "@/components/ui/Skeleton";
import { STACK_PRESETS, TECHNOLOGIES } from "@/lib/data";
import { useStackMatcher, useSkillsList } from "@/modules/dashboard/hooks/useMarketData";
import { useFilters } from "@/modules/dashboard/hooks/useFilters";
import { cn } from "@/lib/utils";
import { Check, Layers, Coffee, Box, BarChart3, Plus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const presetIcons: Record<string, React.ReactNode> = {
  MERN: <Layers className="h-3.5 w-3.5" />,
  "Java Spring": <Coffee className="h-3.5 w-3.5" />,
  ".NET": <Box className="h-3.5 w-3.5" />,
  "Python Data": <BarChart3 className="h-3.5 w-3.5" />,
};

const formatCompactK = (val: number | string) => {
  const num = typeof val === "number" ? val : parseFloat(val);
  if (isNaN(num)) return String(val);
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}k`;
  return String(num);
};

export default function StackMatcherPage() {
  const filters = useFilters();
  const [selectedTechs, setSelectedTechs] = useState<string[]>(["React", "JavaScript", "SQL"]);
  
  const { data: skillsListData } = useSkillsList();
  const { data, isPending } = useStackMatcher(selectedTechs, filters);

  const availableTechs = skillsListData && skillsListData.length > 0
    ? skillsListData.map((s) => s.name)
    : TECHNOLOGIES;

  const toggleTech = (tech: string) => {
    setSelectedTechs((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  const addMissingSkill = (skill: string) => {
    if (!selectedTechs.includes(skill)) {
      setSelectedTechs((prev) => [...prev, skill]);
    }
  };

  const applyPreset = (preset: typeof STACK_PRESETS[0]) => {
    setSelectedTechs(preset.technologies);
  };

  if (isPending) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="mb-1">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Stack Matcher</h1>
          <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            Analyze your tech stack against 10,782+ Moroccan IT job postings.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <KPICardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3.5">
            <ChartCardSkeleton />
            <ChartCardSkeleton />
          </div>
          <div className="space-y-3.5">
            <ChartCardSkeleton />
            <ChartCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  const matchScore = data?.compatibility_score ?? (data ? Math.round(data.market_match_rate_pct) : 0);
  const topMissingSkill = data?.top_missing_booster_skill?.skill && data.top_missing_booster_skill.skill !== "N/A"
    ? `${data.top_missing_booster_skill.skill} (+${data.top_missing_booster_skill.boost_pct}%)`
    : "None";
  const bestCity = data?.top_hiring_city_for_stack?.city || "Casablanca";
  const missingRoi = data?.missing_skills_roi || [];
  const seniorityData = data?.match_by_seniority.map((s) => ({ name: s.seniority, value: s.count })) || [];
  const companies = data?.matching_companies || [];

  return (
    <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="mb-1">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Stack Matcher</h1>
        <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          Analyze your tech stack against 10,782+ Moroccan IT job postings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KPICard
          data={{
            label: "Match Score",
            value: `${matchScore}%`,
            change: data ? data.market_match_rate_pct : 0,
            changeLabel: "market coverage",
            icon: "Target",
            color: "indigo",
          }}
          variant="hero"
        />
        <KPICard
          data={{
            label: "Top Missing Booster",
            value: topMissingSkill,
            icon: "Zap",
            color: "amber",
          }}
        />
        <KPICard
          data={{
            label: "Top Hiring Hub",
            value: bestCity,
            icon: "MapPin",
            color: "cyan",
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-3 items-start">
        {/* Left Column (2 spans) */}
        <div className="lg:col-span-2 space-y-3.5">
          {/* Stack Selection Card */}
          <div className="rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-[#1E1F24] p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-sm transition-all">
            <div className="mb-2.5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">Your Tech Stack</h3>
                <p className="text-[11px] font-medium text-slate-400">
                  Select technologies or apply an industry preset
                </p>
              </div>
            </div>

            {/* Presets Pills */}
            <div className="mb-2.5 flex flex-wrap gap-1.5">
              {STACK_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161719] px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-all hover:border-slate-400 dark:hover:border-[#D4F84B] hover:bg-slate-100"
                >
                  {presetIcons[preset.name]}
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>

            {/* Technology Chips Selection */}
            <div className="mb-2.5 flex flex-wrap gap-1 max-h-36 overflow-y-auto custom-scrollbar pr-1">
              {availableTechs.slice(0, 36).map((tech) => {
                const isSelected = selectedTechs.includes(tech);
                return (
                  <button
                    key={tech}
                    onClick={() => toggleTech(tech)}
                    className={cn(
                      "flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] transition-all",
                      isSelected
                        ? "bg-slate-900 dark:bg-[#D4F84B] text-white dark:text-[#161719] font-bold shadow-sm"
                        : "border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#161719] text-slate-600 dark:text-slate-400 font-medium hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                    <span>{tech}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Active Stack Tags */}
            <div className="rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-[#161719] p-2.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Active Stack ({selectedTechs.length} skills)
              </div>
              {selectedTechs.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No technologies selected. Click skills above to match.</p>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {selectedTechs.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1 rounded-md bg-slate-200/80 dark:bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-slate-800 dark:text-slate-100"
                    >
                      <span>{tech}</span>
                      <button
                        onClick={() => toggleTech(tech)}
                        className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors ml-0.5 text-slate-400"
                        title={`Remove ${tech}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Missing Skills ROI Booster Card */}
          <ChartCard
            title="Missing Skills ROI Booster"
            subtitle="Click any booster skill to add it directly to your stack"
            height={210}
          >
            {missingRoi.length === 0 ? (
              <EmptyState
                title="No booster skills needed"
                description="Your stack covers key requirements for target postings."
                className="h-full border-none p-3"
              />
            ) : (
              <div className="space-y-1.5 overflow-y-auto custom-scrollbar max-h-[195px] pr-1">
                {missingRoi.slice(0, 6).map((item) => (
                  <div
                    key={item.skill}
                    className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors group"
                  >
                    <button
                      onClick={() => addMissingSkill(item.skill)}
                      className="flex items-center gap-1.5 text-left w-32 truncate"
                      title={item.skill}
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-slate-900 group-hover:text-[#D4F84B] transition-all flex-shrink-0">
                        <Plus className="h-3 w-3 stroke-[2.5]" />
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-[#D4F84B] transition-colors truncate">
                        {item.skill}
                      </span>
                    </button>

                    <span className="text-[10px] font-medium text-slate-400 w-20 truncate">{item.category}</span>

                    <div className="flex-1">
                      <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${Math.min(100, item.boost_pct * 2.5)}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => addMissingSkill(item.skill)}
                      className="rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.2 text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 transition-colors"
                      title={`Click to add ${item.skill}`}
                    >
                      +{item.boost_pct}%
                    </button>
                  </div>
                ))}
              </div>
            )}
          </ChartCard>
        </div>

        {/* Right Column (1 span) */}
        <div className="space-y-3.5">
          <div className="rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-[#1E1F24] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-sm text-center transition-all">
            <h3 className="mb-1.5 text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">Compatibility Score</h3>
            <div className="relative mx-auto mb-1.5 h-28 w-28">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                <circle cx="60" cy="60" r="46" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                <circle
                  cx="60"
                  cy="60"
                  r="46"
                  fill="none"
                  stroke="#161719"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(matchScore * 289) / 100} 289`}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">{matchScore}%</span>
              </div>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-normal">
              {matchScore >= 75
                ? "Excellent market alignment! High volume of matching openings."
                : matchScore >= 50
                ? "Strong foundation. Add complementary skills to expand reach."
                : "Specialized stack. Consider pairing with high-volume companions."}
            </p>
          </div>

          <ChartCard title="Seniority Distribution" subtitle="Matching jobs across experience tiers" height={135}>
            {seniorityData.length === 0 ? (
              <EmptyState className="h-full border-none p-3" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={seniorityData} margin={{ top: 0, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 9.5, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={formatCompactK} tick={{ fontSize: 9.5, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip content={<CustomChartTooltip suffix="jobs" />} />
                  <Bar dataKey="value" fill="#6366F1" radius={[3, 3, 0, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* Matching Companies — Clean rows with tooltip and no text clipping */}
          <ChartCard title="Matching Companies" subtitle="Top hiring employers for your stack" height={145}>
            {companies.length === 0 ? (
              <EmptyState className="h-full border-none p-3" />
            ) : (
              <div className="space-y-1.5 overflow-y-auto custom-scrollbar max-h-[130px] pr-1">
                {companies.slice(0, 6).map((company) => (
                  <div key={company.name} className="flex items-center gap-2" title={`${company.name}: ${company.count} postings`}>
                    <div className="w-28 text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate">{company.name}</div>
                    <div className="flex-1">
                      <div className="h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-cyan-500 transition-all duration-500"
                          style={{
                            width: `${Math.min(100, Math.max(15, company.count * 8))}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="w-10 text-right text-[10px] font-bold text-slate-600 dark:text-slate-400">
                      {company.count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

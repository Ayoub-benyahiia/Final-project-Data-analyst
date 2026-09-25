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
import { Check, Layers, Coffee, Box, BarChart3, Plus, X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const presetIcons: Record<string, React.ReactNode> = {
  MERN: <Layers className="h-3.5 w-3.5 text-[#4e4d4d]" />,
  "Java Spring": <Coffee className="h-3.5 w-3.5 text-[#4e4d4d]" />,
  ".NET": <Box className="h-3.5 w-3.5 text-[#4e4d4d]" />,
  "Python Data": <BarChart3 className="h-3.5 w-3.5 text-[#4e4d4d]" />,
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
      <div className="space-y-8 animate-pulse font-mono">
        <div className="space-y-2">
          <div className="h-9 w-64 rounded-full bg-[#cecac8]/40" />
          <div className="h-4 w-96 rounded-full bg-[#cecac8]/20" />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <KPICardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="col-span-12 lg:col-span-2 space-y-6">
            <ChartCardSkeleton />
            <ChartCardSkeleton />
          </div>
          <div className="col-span-12 lg:col-span-1 space-y-6">
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
    <div className="space-y-8 animate-fade-in font-mono">
      {/* 01 — EDITORIAL PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-[#cecac8] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-[#2b59d1]" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#797776]">
              Stack Compatibility Intelligence
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#242424] tracking-[-0.02em]">
            Stack Matcher & Skill Gap
          </h1>
          <p className="mt-1 font-mono text-xs sm:text-sm text-[#4e4d4d] max-w-2xl leading-relaxed">
            Evaluate tech stack compatibility against 10,782+ Moroccan IT job postings in real-time.
          </p>
        </div>
      </div>

      {/* 02 — 3 KPI CARDS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <KPICard
          data={{
            label: "Market Compatibility",
            value: `${matchScore}%`,
            changeLabel: "market alignment",
            icon: "Target",
          }}
          variant="hero"
        />
        <KPICard
          data={{
            label: "Top Missing Booster",
            value: topMissingSkill,
            changeLabel: "highest incremental ROI",
            icon: "Zap",
          }}
        />
        <KPICard
          data={{
            label: "Top Hiring Hub",
            value: bestCity,
            changeLabel: "primary regional demand",
            icon: "MapPin",
          }}
        />
      </div>

      {/* 03 — MAIN INTERACTION GRID */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
        {/* Left Column (2 spans) */}
        <div className="col-span-12 lg:col-span-2 space-y-6">
          {/* Tech Stack Selector Card */}
          <div className="rounded-[28px] sm:rounded-[40px] border border-[#cecac8] bg-[#f6f3f1] p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#242424] tracking-[-0.02em]">
                  Your Tech Stack
                </h3>
                <p className="font-mono text-xs sm:text-sm text-[#4e4d4d] mt-1">
                  Select technologies or apply an industry standard preset
                </p>
              </div>
            </div>

            {/* Presets Pills */}
            <div className="mb-5 flex flex-wrap gap-2">
              {STACK_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="flex items-center gap-2 rounded-full border border-[#cecac8] bg-[#f6f3f1] px-4 py-1.5 text-xs font-mono text-[#4e4d4d] transition-all hover:border-[#242424] hover:text-[#242424]"
                >
                  {presetIcons[preset.name]}
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>

            {/* Technology Chips Selection */}
            <div className="mb-5 flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
              {availableTechs.slice(0, 40).map((tech) => {
                const isSelected = selectedTechs.includes(tech);
                return (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => toggleTech(tech)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-mono transition-all select-none",
                      isSelected
                        ? "bg-[#cfdaf5] text-[#2b59d1] font-medium border border-[#a0b5eb]"
                        : "border border-[#cecac8] bg-[#f6f3f1] text-[#4e4d4d] hover:border-[#242424] hover:text-[#242424]"
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                    <span>{tech}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Active Stack Tags */}
            <div className="rounded-[28px] border border-[#cecac8] bg-[#f6f3f1] p-5">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#797776] mb-3">
                Active Stack ({selectedTechs.length} skills selected)
              </div>
              {selectedTechs.length === 0 ? (
                <p className="text-xs font-mono text-[#797776] italic">No technologies selected. Click skills above to match.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedTechs.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-2 rounded-full bg-[#f6f3f1] border border-[#cecac8] px-3.5 py-1.5 text-xs font-mono text-[#242424]"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => toggleTech(tech)}
                        className="hover:text-rose-600 transition-colors text-[#797776]"
                        title={`Remove ${tech}`}
                      >
                        <X className="h-3 w-3" />
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
            height={220}
          >
            {missingRoi.length === 0 ? (
              <EmptyState
                title="No booster skills needed"
                description="Your stack covers the core requirements for target postings."
                className="h-full border-none p-3"
              />
            ) : (
              <div className="space-y-2 overflow-y-auto custom-scrollbar max-h-[200px] pr-1 font-mono">
                {missingRoi.slice(0, 6).map((item) => (
                  <div
                    key={item.skill}
                    className="flex items-center gap-3 p-2 rounded-full hover:bg-[#cecac8]/20 transition-colors group border border-transparent"
                  >
                    <button
                      type="button"
                      onClick={() => addMissingSkill(item.skill)}
                      className="flex items-center gap-2 text-left w-44 truncate"
                      title={item.skill}
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#242424] text-[#f6f3f1] group-hover:bg-[#2b59d1] transition-colors flex-shrink-0">
                        <Plus className="h-3 w-3 stroke-[2.5]" />
                      </span>
                      <span className="text-xs font-mono text-[#242424] transition-colors truncate">
                        {item.skill}
                      </span>
                    </button>

                    <span className="text-[11px] font-mono text-[#797776] w-28 truncate">{item.category}</span>

                    <div className="flex-1">
                      <div className="h-1.5 rounded-full bg-[#cecac8]/40 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#2b59d1] transition-all duration-500"
                          style={{ width: `${Math.min(100, item.boost_pct * 2.5)}%` }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => addMissingSkill(item.skill)}
                      className="rounded-full bg-[#a7fccd]/40 border border-[#a7fccd] px-3 py-0.5 text-[10px] font-mono text-[#242424] hover:bg-[#a7fccd] transition-colors"
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
        <div className="col-span-12 lg:col-span-1 space-y-6">
          {/* Compatibility Score Radial Dial on Periwinkle Card */}
          <div className="rounded-[28px] sm:rounded-[40px] border border-[#a0b5eb] bg-[#cfdaf5] p-6 text-center text-[#242424]">
            <h3 className="mb-3 font-serif text-lg font-normal tracking-[-0.02em] text-[#242424]">
              Compatibility Score
            </h3>
            <div className="relative mx-auto mb-3 h-28 w-28">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                <circle cx="60" cy="60" r="46" fill="none" stroke="#f6f3f1" strokeWidth="8" />
                <circle
                  cx="60"
                  cy="60"
                  r="46"
                  fill="none"
                  stroke="#2b59d1"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(matchScore * 289) / 100} 289`}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-3xl font-normal text-[#242424] tabular-nums">{matchScore}%</span>
              </div>
            </div>
            <p className="font-mono text-xs text-[#4e4d4d] leading-relaxed">
              {matchScore >= 75
                ? "High market alignment across active postings."
                : matchScore >= 50
                ? "Solid foundation. Add companion booster skills to expand reach."
                : "Specialized profile. Consider pairing with high-volume technologies."}
            </p>
          </div>

          {/* Seniority Distribution Chart */}
          <ChartCard title="Seniority Distribution" subtitle="Matching openings across tiers" height={145}>
            {seniorityData.length === 0 ? (
              <EmptyState className="h-full border-none p-3" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={seniorityData} margin={{ top: 0, right: 10, left: -5, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cecac8" strokeOpacity={0.6} vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#797776", fontFamily: "'ABC Diatype Mono', monospace" }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={formatCompactK} tick={{ fontSize: 10, fill: "#797776", fontFamily: "'ABC Diatype Mono', monospace" }} axisLine={false} tickLine={false} width={36} />
                  <Tooltip content={<CustomChartTooltip suffix="jobs" />} />
                  <Bar dataKey="value" fill="#242424" radius={[9999, 9999, 0, 0]} barSize={18} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* Top Matching Companies */}
          <ChartCard title="Top Matching Employers" subtitle="Companies hiring for this stack" height={155}>
            {companies.length === 0 ? (
              <EmptyState className="h-full border-none p-3" />
            ) : (
              <div className="space-y-3 overflow-y-auto custom-scrollbar max-h-[140px] pr-1 font-mono">
                {companies.slice(0, 6).map((company) => (
                  <div key={company.name} className="flex items-center gap-2" title={`${company.name}: ${company.count} postings`}>
                    <div className="w-28 text-xs font-mono text-[#242424] truncate">{company.name}</div>
                    <div className="flex-1">
                      <div className="h-1.5 rounded-full bg-[#cecac8]/30 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#2b59d1] transition-all duration-500"
                          style={{
                            width: `${Math.min(100, Math.max(15, company.count * 8))}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="w-8 text-right text-[11px] font-mono text-[#4e4d4d]">
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


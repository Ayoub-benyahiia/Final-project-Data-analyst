import { useState, useMemo } from "react";
import { KPICard } from "@/components/ui/KpiCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { KPICardSkeleton, ChartCardSkeleton } from "@/components/ui/Skeleton";
import { useSkillsCatalog } from "@/modules/dashboard/hooks/useMarketData";
import { cn } from "@/lib/utils";
import { Search, Code2, Users, Filter } from "lucide-react";

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
      <div className="space-y-8 animate-pulse">
        <div className="space-y-3">
          <div className="h-9 w-64 rounded-full bg-ash/40" />
          <div className="h-4 w-96 rounded-full bg-ash/20" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <KPICardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCardSkeleton />
          <ChartCardSkeleton />
        </div>
      </div>
    );
  }

  const topHard = hardSkills[0]?.name || "Java";
  const topSoft = softSkills[0]?.name || "Scrum / Agile";

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 01 — EDITORIAL PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-ash pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lake-blue" />
            <span className="text-[10px] font-mono font-normal tracking-widest text-graphite uppercase">
              Skills Taxonomy & Frequency
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-normal text-off-black tracking-[-0.02em]">
            Skills & Competency Catalog
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-mono text-graphite max-w-2xl leading-relaxed">
            Standardized taxonomy of 121 technical technologies and 50 soft competencies extracted from 10,782+ Moroccan IT postings.
          </p>
        </div>
      </div>

      {/* 02 — 4 KPI METRICS */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          data={{
            label: "Technical Skills",
            value: String(hardSkills.length || 121),
            changeLabel: "catalogued technologies",
            icon: "Code2",
          }}
          variant="hero"
        />
        <KPICard
          data={{
            label: "Soft Competencies",
            value: String(softSkills.length || 50),
            changeLabel: "catalogued behavioral skills",
            icon: "Users",
          }}
        />
        <KPICard
          data={{
            label: "Most In-Demand Hard Skill",
            value: topHard,
            changeLabel: `${hardSkills[0]?.percentage || "22.2"}% of all postings`,
            icon: "Trophy",
          }}
        />
        <KPICard
          data={{
            label: "Most In-Demand Soft Skill",
            value: topSoft,
            changeLabel: `${softSkills[0]?.percentage || "21.2"}% of all postings`,
            icon: "Trophy",
          }}
        />
      </div>

      {/* 03 — FILTER & SEARCH CONTROLS */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between rounded-[28px] sm:rounded-[40px] border border-ash bg-white/70 backdrop-blur-xs p-5 sm:p-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-graphite" />
          <input
            type="text"
            placeholder="Search skills, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-ash bg-parchment/60 py-2.5 pl-10 pr-4 text-xs font-mono text-ink placeholder:text-smoke focus:border-lake-blue focus:bg-white focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
          <Filter className="h-3.5 w-3.5 text-graphite mr-1 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-mono transition-all flex-shrink-0",
                selectedCategory === cat
                  ? "bg-off-black text-parchment font-medium shadow-xs"
                  : "bg-parchment/80 border border-ash text-graphite hover:border-off-black hover:text-off-black"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 04 — DUAL SKILL TAXONOMY TABLES */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Hard Skills Table */}
        <div className="rounded-[28px] sm:rounded-[40px] border border-ash bg-white/70 backdrop-blur-xs p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="mb-5 flex items-center justify-between border-b border-ash pb-4">
              <div className="flex items-center gap-2.5">
                <Code2 className="h-4 w-4 text-off-black" />
                <h2 className="font-serif text-xl font-normal text-off-black tracking-[-0.02em]">
                  Technical Skills & Frameworks
                </h2>
              </div>
              <span className="rounded-full bg-parchment border border-ash px-3 py-1 text-[11px] font-mono text-graphite">
                {filteredHardSkills.length} skills
              </span>
            </div>

            <div className="max-h-[480px] overflow-y-auto custom-scrollbar pr-1">
              {filteredHardSkills.length === 0 ? (
                <EmptyState title="No matching technical skills" className="border-none py-10" />
              ) : (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-ash text-[10px] font-mono uppercase text-graphite tracking-wider">
                      <th className="pb-3 pl-2 font-normal">Skill Name</th>
                      <th className="pb-3 font-normal">Category</th>
                      <th className="pb-3 text-right font-normal">Job Postings</th>
                      <th className="pb-3 text-right pr-2 font-normal">Market Pct</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ash/30 font-mono">
                    {filteredHardSkills.map((skill, index) => (
                      <tr key={skill.name} className="hover:bg-parchment/60 transition-colors group">
                        <td className="py-3 pl-2 font-medium text-off-black flex items-center gap-2.5">
                          <span className="text-[10px] text-graphite w-5">{index + 1}</span>
                          <span>{skill.name}</span>
                        </td>
                        <td className="py-3 text-graphite">
                          <span className="rounded-full bg-parchment border border-ash px-2.5 py-0.5 text-[10px]">
                            {skill.category}
                          </span>
                        </td>
                        <td className="py-3 text-right font-medium text-off-black">
                          {skill.count.toLocaleString()}
                        </td>
                        <td className="py-3 text-right pr-2">
                          <span className="inline-flex items-center gap-2 justify-end">
                            <span className="font-medium text-off-black">{skill.percentage}%</span>
                            <span
                              className="h-1.5 w-10 rounded-full bg-ash/30 overflow-hidden inline-block"
                              title={`${skill.percentage}%`}
                            >
                              <span
                                className="h-full block bg-lake-blue group-hover:bg-off-black transition-colors"
                                style={{ width: `${Math.min(100, skill.percentage * 4)}%` }}
                              />
                            </span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Soft Skills Table */}
        <div className="rounded-[28px] sm:rounded-[40px] border border-ash bg-white/70 backdrop-blur-xs p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="mb-5 flex items-center justify-between border-b border-ash pb-4">
              <div className="flex items-center gap-2.5">
                <Users className="h-4 w-4 text-off-black" />
                <h2 className="font-serif text-xl font-normal text-off-black tracking-[-0.02em]">
                  Soft Competencies & Behavioral Traits
                </h2>
              </div>
              <span className="rounded-full bg-parchment border border-ash px-3 py-1 text-[11px] font-mono text-graphite">
                {filteredSoftSkills.length} skills
              </span>
            </div>

            <div className="max-h-[480px] overflow-y-auto custom-scrollbar pr-1">
              {filteredSoftSkills.length === 0 ? (
                <EmptyState title="No matching soft skills" className="border-none py-10" />
              ) : (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-ash text-[10px] font-mono uppercase text-graphite tracking-wider">
                      <th className="pb-3 pl-2 font-normal">Competency</th>
                      <th className="pb-3 text-right font-normal">Job Postings</th>
                      <th className="pb-3 text-right pr-2 font-normal">Market Pct</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ash/30 font-mono">
                    {filteredSoftSkills.map((skill, index) => (
                      <tr key={skill.name} className="hover:bg-parchment/60 transition-colors group">
                        <td className="py-3 pl-2 font-medium text-off-black flex items-center gap-2.5">
                          <span className="text-[10px] text-graphite w-5">{index + 1}</span>
                          <span>{skill.name}</span>
                        </td>
                        <td className="py-3 text-right font-medium text-off-black">
                          {skill.count.toLocaleString()}
                        </td>
                        <td className="py-3 text-right pr-2">
                          <span className="inline-flex items-center gap-2 justify-end">
                            <span className="font-medium text-off-black">{skill.percentage}%</span>
                            <span
                              className="h-1.5 w-10 rounded-full bg-ash/30 overflow-hidden inline-block"
                              title={`${skill.percentage}%`}
                            >
                              <span
                                className="h-full block bg-lake-blue group-hover:bg-off-black transition-colors"
                                style={{ width: `${Math.min(100, skill.percentage * 4)}%` }}
                              />
                            </span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

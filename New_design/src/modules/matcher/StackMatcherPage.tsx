import React, { useState } from 'react';
import {
  RadialBarChart,
  RadialBar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useStackMatcher } from '../../hooks/useDashboardData';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import SkillInput from './SkillInput';
import ROIBooster from './ROIBooster';

const COLORS = {
  indigo: '#6366F1',
  electric: '#06B6D4',
  emerald: '#10B981',
  amber: '#F59E0B',
  rose: '#F43F5E',
  slate: '#64748B',
};

export default function StackMatcherPage() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['React', 'JavaScript', 'SQL']);
  const matcherMutation = useStackMatcher();

  const handleToggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleApplyPreset = (skills: string[]) => {
    setSelectedSkills(skills);
  };

  const handleAnalyze = () => {
    matcherMutation.mutate({ skills: selectedSkills });
  };

  const result = matcherMutation.data;
  const isAnalyzing = matcherMutation.isPending;

  const compatibilityScore = result?.compatibility_score ?? 0;
  const gaugeColor =
    compatibilityScore <= 40 ? COLORS.rose : compatibilityScore <= 70 ? COLORS.amber : COLORS.emerald;

  const gaugeData = [
    {
      name: 'Score',
      value: compatibilityScore,
      fill: gaugeColor,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stack Matcher"
        subtitle="Select your tech stack and discover your market coverage, missing skills ROI, and top hiring companies."
      />

      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard variant="elevated" className="flex flex-col justify-center">
          <p className="text-sm text-slate-400 font-medium mb-1">Market Match Rate</p>
          <div className="text-3xl font-bold text-slate-100">
            {result?.market_match_rate_pct ?? 0}%
          </div>
        </GlassCard>

        <GlassCard variant="elevated" className="flex flex-col justify-center">
          <p className="text-sm text-slate-400 font-medium mb-1">Top Missing Booster Skill</p>
          <div className="text-2xl font-bold text-slate-100">
            {result?.top_missing_booster_skill?.skill ?? '-'}
            <span className="text-emerald-400 text-lg ml-2">
              {result?.top_missing_booster_skill?.boost_pct
                ? `+${result.top_missing_booster_skill.boost_pct}%`
                : ''}
            </span>
          </div>
        </GlassCard>

        <GlassCard variant="elevated" className="flex flex-col justify-center">
          <p className="text-sm text-slate-400 font-medium mb-1">Top Hiring City</p>
          <div className="text-2xl font-bold text-slate-100">
            {result?.top_hiring_city_for_stack?.city ?? '-'}
            <span className="text-slate-400 text-base font-normal ml-2">
              {result?.top_hiring_city_for_stack?.count ? `${result.top_hiring_city_for_stack.count} jobs` : ''}
            </span>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          {/* Control 1: SkillInput */}
          <SkillInput
            selectedSkills={selectedSkills}
            onToggleSkill={handleToggleSkill}
            onApplyPreset={handleApplyPreset}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
          />

          {/* Chart 2: Gauge - Compatibility Score */}
          <GlassCard className="h-[300px] flex flex-col items-center justify-center relative">
            <h3 className="text-lg font-semibold text-slate-100 absolute top-4 left-6">
              Compatibility Score
            </h3>
            <div className="w-full h-full pt-10">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="70%"
                  innerRadius="70%"
                  outerRadius="100%"
                  barSize={20}
                  data={gaugeData}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar
                    background={{ fill: '#334155' }}
                    dataKey="value"
                    cornerRadius={10}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute top-[65%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <span className="text-4xl font-bold text-slate-100">{compatibilityScore}</span>
              <span className="text-sm text-slate-400">/100</span>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Chart 3: ROIBooster */}
          <ROIBooster result={result} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart 4: Match by Seniority */}
            <GlassCard className="h-[350px]">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Match by Seniority</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result?.match_by_seniority || []} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                    <XAxis dataKey="seniority" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: '#334155', opacity: 0.4 }} contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#F1F5F9' }} />
                    <Bar dataKey="count" fill={COLORS.indigo} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Chart 5: Matching Companies */}
            <GlassCard className="h-[350px]">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Top Matching Companies</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result?.matching_companies || []} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                    <XAxis type="number" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="name" width={120} stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: '#334155', opacity: 0.4 }} contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#F1F5F9' }} />
                    <Bar dataKey="count" fill={COLORS.electric} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}

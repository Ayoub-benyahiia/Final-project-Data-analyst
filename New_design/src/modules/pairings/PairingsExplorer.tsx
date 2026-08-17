import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useSkillPairings, useSkillsList } from '../../hooks/useDashboardData';
import { useGlobalFilters } from '../../hooks/useGlobalFilters';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';

const COLORS = {
  indigo: '#6366F1',
  electric: '#06B6D4',
  emerald: '#10B981',
  amber: '#F59E0B',
  rose: '#F43F5E',
  slate: '#64748B',
};

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: '#6366F1',
  Backend: '#06B6D4',
  Database: '#10B981',
  'Cloud & DevOps': '#F43F5E',
  'Data & AI': '#F59E0B',
  Mobile: '#8B5CF6',
  Cybersecurity: '#EC4899',
  'Methodology & Tools': '#64748B',
  Other: '#94A3B8',
};

const CustomPairingsTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-lg">
        <p className="text-slate-200 font-medium">
          {data.skill} appears in{' '}
          <span className="text-indigo-400 font-bold">{data.cooccurrence_pct}%</span> of jobs
        </p>
      </div>
    );
  }
  return null;
};

export default function PairingsExplorer() {
  const [selectedSkill, setSelectedSkill] = useState<string>('React');
  const { filters } = useGlobalFilters();
  const { data: pairingsData } = useSkillPairings(selectedSkill, filters);
  const { data: skillsList = [] } = useSkillsList();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Skill Pairings Explorer"
        subtitle="Select a core technology and discover its most frequent companion skills, category distribution, and associated job roles."
      />

      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard variant="elevated" className="flex flex-col justify-center">
          <p className="text-sm text-slate-400 font-medium mb-1">Selected Core Skill</p>
          <div className="text-3xl font-bold text-slate-100">
            {pairingsData?.selected_core_skill ?? '-'}
          </div>
        </GlassCard>

        <GlassCard variant="elevated" className="flex flex-col justify-center">
          <p className="text-sm text-slate-400 font-medium mb-1">Top Companion Skill</p>
          <div className="text-2xl font-bold text-slate-100">
            {pairingsData?.top_companion_skill ?? '-'}
          </div>
        </GlassCard>

        <GlassCard variant="elevated" className="flex flex-col justify-center">
          <p className="text-sm text-slate-400 font-medium mb-1">Avg Skills per Job</p>
          <div className="text-3xl font-bold text-slate-100">
            {pairingsData?.avg_skills_per_job?.toFixed(1) ?? '-'}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          {/* Control 1: Skill Selector */}
          <GlassCard>
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Core Technology</h3>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {skillsList.map((skill) => (
                <option key={skill.name} value={skill.name}>
                  {skill.name}
                </option>
              ))}
            </select>
          </GlassCard>

          {/* Chart 3: Pairings by Category */}
          <GlassCard className="h-[350px]">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Pairings by Category</h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pairingsData?.pairings_by_category || []} margin={{ top: 10, right: 10, left: -20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis 
                    dataKey="category" 
                    stroke="#94A3B8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    angle={-30}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: '#334155', opacity: 0.4 }} contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#F1F5F9' }} />
                  <Bar dataKey="count" fill={COLORS.indigo} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Chart 2: Top Co-occurring Technologies */}
          <GlassCard className="h-[400px]">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Top Co-occurring Technologies</h3>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={(pairingsData?.pairings || []).slice(0, 15)} 
                  layout="vertical" 
                  margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                  <XAxis type="number" dataKey="cooccurrence_pct" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="skill" width={100} stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: '#334155', opacity: 0.4 }} content={<CustomPairingsTooltip />} />
                  <Bar dataKey="cooccurrence_pct" radius={[0, 4, 4, 0]}>
                    {(pairingsData?.pairings || []).slice(0, 15).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.category] || CATEGORY_COLORS['Other']} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Chart 4: Top Roles for Stack */}
          <GlassCard className="h-[400px]">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Top Roles for {selectedSkill}</h3>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={(pairingsData?.top_roles_for_stack || []).slice(0, 15)} 
                  layout="vertical" 
                  margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                  <XAxis type="number" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis 
                    type="category" 
                    dataKey="title" 
                    width={180} 
                    stroke="#94A3B8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(val) => val.length > 30 ? val.substring(0, 30) + '...' : val}
                  />
                  <Tooltip cursor={{ fill: '#334155', opacity: 0.4 }} contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#F1F5F9' }} />
                  <Bar dataKey="count" fill={COLORS.electric} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

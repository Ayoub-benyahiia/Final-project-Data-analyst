import React, { useMemo } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, ResponsiveContainer
} from 'recharts';
import { Briefcase, Building2, MapPin, Wifi, GraduationCap } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { Skeleton } from '../../components/ui/Skeleton';
import { useMarketPulse, useMarketOverview } from '../../hooks/useDashboardData';
import { useGlobalFilters } from '../../hooks/useGlobalFilters';

const COLORS = {
  indigo: '#6366F1',
  electric: '#06B6D4',
  emerald: '#10B981',
  amber: '#F59E0B',
  rose: '#F43F5E',
  slate: '#64748B',
};

const COLOR_VALUES = Object.values(COLORS);

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

export default function DashboardOverview() {
  const { filters } = useGlobalFilters();
  const { data: pulse, isLoading: isPulseLoading } = useMarketPulse();
  const { data: overview, isLoading: isOverviewLoading } = useMarketOverview(filters);

  const isLoading = isPulseLoading || isOverviewLoading;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="font-medium text-slate-900 dark:text-white mb-1">{label || payload[0].payload.name}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color || entry.fill }}>
              {entry.name}: {entry.value?.toLocaleString()}
              {entry.payload.pct !== undefined ? ` (${entry.payload.pct}%)` : ''}
              {entry.payload.category ? ` - ${entry.payload.category}` : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard Overview" 
        subtitle="High-level metrics and trends of the tech job market." 
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <GlassCard variant="elevated" className="flex flex-col p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono uppercase text-slate-500">Total Jobs</span>
          </div>
          <span className="text-2xl font-black text-slate-950 dark:text-white">
            {isLoading ? <Skeleton className="h-8 w-24" /> : pulse?.total_jobs?.toLocaleString() || '0'}
          </span>
        </GlassCard>
        
        <GlassCard variant="elevated" className="flex flex-col p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-full bg-electric-100 dark:bg-electric-900/30 text-electric-600 dark:text-electric-400" style={{ backgroundColor: `${COLORS.electric}20`, color: COLORS.electric }}>
              <Building2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono uppercase text-slate-500">Total Companies</span>
          </div>
          <span className="text-2xl font-black text-slate-950 dark:text-white">
            {isLoading ? <Skeleton className="h-8 w-24" /> : pulse?.total_companies?.toLocaleString() || '0'}
          </span>
        </GlassCard>

        <GlassCard variant="elevated" className="flex flex-col p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono uppercase text-slate-500">Total Cities</span>
          </div>
          <span className="text-2xl font-black text-slate-950 dark:text-white">
            {isLoading ? <Skeleton className="h-8 w-24" /> : pulse?.total_cities?.toLocaleString() || '0'}
          </span>
        </GlassCard>

        <GlassCard variant="elevated" className="flex flex-col p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <Wifi className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono uppercase text-slate-500">Remote Flex %</span>
          </div>
          <span className="text-2xl font-black text-slate-950 dark:text-white">
            {isLoading ? <Skeleton className="h-8 w-16" /> : `${pulse?.remote_flexibility_pct || 0}%`}
          </span>
        </GlassCard>

        <GlassCard variant="elevated" className="flex flex-col p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono uppercase text-slate-500">Avg. Experience</span>
          </div>
          <span className="text-2xl font-black text-slate-950 dark:text-white">
            {isLoading ? <Skeleton className="h-8 w-20" /> : `${pulse?.avg_experience_years || 0} years`}
          </span>
        </GlassCard>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 w-full col-span-1" />
          <Skeleton className="h-80 w-full col-span-1" />
          <Skeleton className="h-80 w-full col-span-1" />
          <Skeleton className="h-80 w-full col-span-1 lg:col-span-1" />
          <Skeleton className="h-80 w-full col-span-1 lg:col-span-2" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlassCard variant="elevated" className="p-6 h-80 flex flex-col">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Contract Type Distribution</h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={overview?.contract_distribution || []}
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="count"
                      nameKey="name"
                    >
                      {(overview?.contract_distribution || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLOR_VALUES[index % COLOR_VALUES.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="middle" align="right" layout="vertical" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard variant="elevated" className="p-6 h-80 flex flex-col">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Historical Job Market Trend</h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={overview?.yearly_trend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.indigo} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={COLORS.indigo} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="year" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="count" stroke={COLORS.indigo} strokeWidth={2} fillOpacity={1} fill="url(#colorTrend)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard variant="elevated" className="p-6 h-80 flex flex-col">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Regional Tech Hubs</h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={overview?.regional_hubs || []} margin={{ top: 10, right: 10, left: -20, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                    <XAxis dataKey="city" fontSize={12} tickLine={false} axisLine={false} angle={-45} textAnchor="end" height={80} interval={0} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill={COLORS.electric} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard variant="elevated" className="p-6 h-96 flex flex-col">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Required Education Levels</h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={overview?.education_levels || []} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                    <XAxis dataKey="level" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill={COLORS.emerald} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard variant="elevated" className="p-6 h-96 flex flex-col">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Top Technologies</h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    layout="vertical" 
                    data={overview?.top_technologies?.slice(0, 15) || []} 
                    margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
                    <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" width={100} fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {(overview?.top_technologies?.slice(0, 15) || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.category] || COLORS.slate} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>
        </>
      )}
    </div>
  );
}

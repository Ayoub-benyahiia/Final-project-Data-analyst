import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { Skeleton } from '../../components/ui/Skeleton';
import { useMarketAnalysis } from '../../hooks/useDashboardData';
import { useGlobalFilters } from '../../hooks/useGlobalFilters';

const COLORS = {
  indigo: '#6366F1',
  electric: '#06B6D4',
  emerald: '#10B981',
  amber: '#F59E0B',
  rose: '#F43F5E',
  slate: '#64748B',
};

const WORKPLACE_COLORS: Record<string, string> = {
  Remote: COLORS.emerald,
  Hybrid: COLORS.indigo,
  Onsite: COLORS.rose,
};

const ELECTRIC_GRADIENT = [
  '#06B6D4', '#0891B2', '#0E7490', '#155E75', '#164E63'
];

export default function DetailedAnalysis() {
  const { filters } = useGlobalFilters();
  const { data: analysis, isLoading } = useMarketAnalysis(filters);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="font-medium text-slate-900 dark:text-white mb-1">{label || payload[0].payload.name || payload[0].payload.city || payload[0].payload.title || payload[0].payload.sector}</p>
          {payload.map((entry: any, index: number) => {
            let val = entry.value;
            let suffix = '';
            if (entry.dataKey === 'yoy_pct' || entry.payload.yoy_pct !== undefined) {
              val = entry.payload.yoy_pct;
              suffix = '%';
            }
            return (
              <p key={index} style={{ color: entry.color || entry.fill }}>
                {entry.name || 'Value'}: {val}{suffix}
                {entry.payload.pct !== undefined && !suffix ? ` (${entry.payload.pct}%)` : ''}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const formatYAxisRole = (tickItem: string) => {
    if (typeof tickItem === 'string' && tickItem.length > 30) {
      return `${tickItem.substring(0, 30)}...`;
    }
    return tickItem;
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Detailed Market Analysis" 
        subtitle="Deep-dive into workplace models, industry sectors, company hiring profiles, and most demanded roles." 
      />

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 w-full col-span-1" />
          <Skeleton className="h-80 w-full col-span-1" />
          <Skeleton className="h-80 w-full col-span-1" />
          <Skeleton className="h-96 w-full col-span-1 lg:col-span-1" />
          <Skeleton className="h-96 w-full col-span-1 lg:col-span-2" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlassCard variant="elevated" className="p-6 h-80 flex flex-col">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Workplace Model Breakdown</h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analysis?.workplace_model || []}
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="count"
                      nameKey="name"
                    >
                      {(analysis?.workplace_model || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={WORKPLACE_COLORS[entry.name] || COLORS.slate} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard variant="elevated" className="p-6 h-80 flex flex-col">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Job Volume by Industry Sector</h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analysis?.industry_sectors || []} margin={{ top: 10, right: 10, left: -20, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                    <XAxis dataKey="sector" fontSize={12} tickLine={false} axisLine={false} angle={-30} textAnchor="end" height={100} interval={0} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill={COLORS.indigo} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard variant="elevated" className="p-6 h-80 flex flex-col">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Hiring Growth Share by City (YoY %)</h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={(analysis?.city_growth_yoy || []).map((item: any) => ({
                        ...item,
                        abs_yoy: Math.abs(item.yoy_pct || 0)
                      }))}
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="abs_yoy"
                      nameKey="city"
                    >
                      {(analysis?.city_growth_yoy || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={ELECTRIC_GRADIENT[index % ELECTRIC_GRADIENT.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard variant="elevated" className="p-6 h-96 flex flex-col">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Top Companies</h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    layout="vertical" 
                    data={analysis?.top_companies?.slice(0, 15) || []} 
                    margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
                    <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" width={120} fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill={COLORS.indigo} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard variant="elevated" className="p-6 h-96 flex flex-col">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Most Demanded Roles</h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    layout="vertical" 
                    data={analysis?.top_roles?.slice(0, 15) || []} 
                    margin={{ top: 10, right: 30, left: 60, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
                    <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis dataKey="title" type="category" width={180} fontSize={12} tickLine={false} axisLine={false} tickFormatter={formatYAxisRole} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill={COLORS.electric} radius={[0, 4, 4, 0]} />
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

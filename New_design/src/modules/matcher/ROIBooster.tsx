import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { StackMatcherResult } from '../../types';
import { GlassCard } from '../../components/ui/GlassCard';

interface ROIBoosterProps {
  result: StackMatcherResult | undefined;
}

interface TooltipPayloadItem {
  payload?: {
    skill: string;
    boost_pct: number;
    category: string;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length && payload[0].payload) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-xl backdrop-blur-md">
        <p className="text-slate-200 text-xs font-medium">
          <span className="text-emerald-400 font-bold">+{data.boost_pct}%</span> de postes en plus si vous apprenez <strong className="text-white">{data.skill}</strong>
        </p>
      </div>
    );
  }
  return null;
}

export default function ROIBooster({ result }: ROIBoosterProps) {
  const data = result?.missing_skills_roi;

  return (
    <GlassCard variant="elevated" className="h-[380px] flex flex-col p-6">
      <div className="mb-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Top Missing Skills by ROI Boost</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Compétences à fort impact pour maximiser votre éligibilité</p>
      </div>
      
      {!data || data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-xs font-mono">
          Sélectionnez des compétences et lancez l'analyse pour voir le ROI
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.slice(0, 10)}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.2} />
              <XAxis 
                type="number" 
                dataKey="boost_pct" 
                stroke="#94A3B8" 
                fontSize={11} 
                tickFormatter={(val: number) => `+${val}%`} 
              />
              <YAxis 
                type="category" 
                dataKey="skill" 
                width={100} 
                stroke="#94A3B8" 
                fontSize={11} 
              />
              <Tooltip cursor={{ fill: '#334155', opacity: 0.2 }} content={<CustomTooltip />} />
              <Bar 
                dataKey="boost_pct" 
                fill="#10B981" 
                radius={[0, 4, 4, 0]} 
                barSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </GlassCard>
  );
}

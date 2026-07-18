import { RefreshCw } from 'lucide-react';
import { useDashboardKpis, useGrowthData } from '../hooks/useDashboardData';
import type { FilterParams, DashboardKpis, GrowthDataPoint } from '../types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DashboardOverviewProps {
  filters: FilterParams;
}

function KpiCardsSection({
  data,
  isLoading,
  isError,
  onRetry,
}: {
  data: DashboardKpis | null | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-zinc-200 animate-pulse rounded-xl p-5 h-32 border-bold" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white border-bold rounded-xl p-6 shadow-hard">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-rose-600 uppercase tracking-wider font-mono">Failed to load KPIs</p>
            <p className="text-sm text-zinc-600 mt-1 font-sans">Could not fetch dashboard KPI data. The backend may be offline.</p>
          </div>
          <button
            onClick={onRetry}
            className="flex items-center gap-2 bg-zinc-950 text-white border-bold-thin px-4 py-2 rounded-lg text-xs font-extrabold transition-all shadow-hard-sm hover:translate-x-[-1px] hover:translate-y-[-1px] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border-bold rounded-xl p-5 shadow-hard">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 font-mono">—</span>
            <div className="mt-4">
              <span className="text-3xl font-black text-zinc-300 tracking-tight font-serif">—</span>
            </div>
            <div className="h-1.5 bg-zinc-200 border-t border-zinc-950/10 rounded mt-4" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: 'Total Offers',
      value: data.totalOffers.toLocaleString(),
      trend: '↗ +12%',
      trendClass: 'text-emerald-800 bg-emerald-100 border-emerald-900/10',
      accentClass: 'bg-rose-600',
    },
    {
      label: 'Remote/Hybrid Rate',
      value: `${data.remotePercentage}%`,
      trend: 'Stable',
      trendClass: 'text-zinc-800 bg-zinc-100 border-zinc-900/10',
      accentClass: 'bg-zinc-950',
    },
    {
      label: 'Top Required Tech',
      // @TODO Replace with real `topTech` field once backend provides it
      value: data.topCompanies[0] ?? 'React/TypeScript',
      trend: 'Trending',
      trendClass: 'text-rose-800 bg-rose-100 border-rose-950/10',
      accentClass: 'bg-emerald-500',
    },
    {
      label: 'Avg. Experience',
      // @TODO Wire to backend `avgExperience` field when available
      value: '3.2 Ans',
      trend: 'Stable',
      trendClass: 'text-zinc-800 bg-zinc-100 border-zinc-900/10',
      accentClass: 'bg-blue-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white border-bold rounded-xl p-5 hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all shadow-hard"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-600 font-mono">{card.label}</span>
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border font-mono flex items-center gap-0.5 ${card.trendClass}`}
            >
              {card.trend}
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-zinc-950 tracking-tight font-serif">{card.value}</span>
          </div>
          <div className={`h-1.5 ${card.accentClass} border-t border-zinc-950/10 rounded mt-4`} />
        </div>
      ))}
    </div>
  );
}

function TrendChartSection({
  data,
  isLoading,
  isError,
  onRetry,
}: {
  data: GrowthDataPoint[] | null | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}) {
  if (isLoading) {
    return (
      <div className="bg-white border-bold rounded-xl p-5 shadow-hard">
        <div className="h-[220px] bg-zinc-200 animate-pulse rounded-lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white border-bold rounded-xl p-5 shadow-hard">
        <h3 className="text-lg font-serif font-black text-zinc-950 mb-1">Yearly Job Posting Volume (2016–2026)</h3>
        <p className="text-xs text-zinc-600 mb-6">Volume of new offers over time (years)</p>
        <div className="flex items-center justify-between bg-rose-50 border border-rose-200 rounded-lg p-4">
          <div>
            <p className="text-xs font-black text-rose-600 uppercase tracking-wider font-mono">Failed to load growth data</p>
            <p className="text-sm text-zinc-600 mt-1 font-sans">Could not fetch yearly trend data. The backend may be offline.</p>
          </div>
          <button
            onClick={onRetry}
            className="flex items-center gap-2 bg-zinc-950 text-white border-bold-thin px-4 py-2 rounded-lg text-xs font-extrabold transition-all shadow-hard-sm hover:translate-x-[-1px] hover:translate-y-[-1px] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-bold rounded-xl p-5 shadow-hard">
      <h3 className="text-lg font-serif font-black text-zinc-950 mb-1">Yearly Job Posting Volume (2016–2026)</h3>
      <p className="text-xs text-zinc-600 mb-6">Volume of new offers over time (years)</p>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data && data.length > 0 ? data : [{ year: 'N/A', Casablanca: 0, Rabat: 0, Tangier: 0, Marrakech: 0 }]}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="roseGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e11d48" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="year" axisLine={true} stroke="#09090b" tickLine={false} tick={{ fontSize: 10, fill: '#09090b', fontWeight: 'bold' }} />
            <YAxis axisLine={true} stroke="#09090b" tickLine={false} tick={{ fontSize: 10, fill: '#09090b', fontWeight: 'bold' }} />
            <CartesianGrid vertical={false} stroke="#e4e4e7" strokeDasharray="3 3" />
            <Tooltip
              contentStyle={{ backgroundColor: '#ffffff', border: '2px solid #09090b', boxShadow: '4px 4px 0px 0px #09090b', borderRadius: '4px', fontSize: '11px', color: '#09090b', fontWeight: 'bold' }}
            />
            <Area type="monotone" dataKey="Casablanca" stroke="#e11d48" strokeWidth={2.5} fillOpacity={1} fill="url(#roseGlow)" />
            <Area type="monotone" dataKey="Rabat" stroke="#09090b" strokeWidth={2} fillOpacity={0.1} fill="#09090b" />
            <Area type="monotone" dataKey="Tangier" stroke="#2563eb" strokeWidth={2} fillOpacity={0.1} fill="#2563eb" />
            <Area type="monotone" dataKey="Marrakech" stroke="#059669" strokeWidth={2} fillOpacity={0.1} fill="#059669" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function DashboardOverview({ filters }: DashboardOverviewProps) {
  const { data: kpiResponse, isLoading: isLoadingKpis, isError: isErrorKpis, refetch: refetchKpis } = useDashboardKpis(filters);
  const { data: growthResponse, isLoading: isLoadingGrowth, isError: isErrorGrowth, refetch: refetchGrowth } = useGrowthData(filters);

  return (
    <div className="space-y-6">
      <KpiCardsSection
        data={kpiResponse?.data ?? null}
        isLoading={isLoadingKpis}
        isError={isErrorKpis}
        onRetry={() => refetchKpis()}
      />
      <TrendChartSection
        data={growthResponse?.data ?? null}
        isLoading={isLoadingGrowth}
        isError={isErrorGrowth}
        onRetry={() => refetchGrowth()}
      />
    </div>
  );
}

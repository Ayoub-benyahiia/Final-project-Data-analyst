import {
  Briefcase,
  DollarSign,
  MapPin,
  Users,
  TrendingUp,
  TrendingDown,
  Building2,
  GraduationCap,
  Code2,
  Target,
  Zap,
  Circle,
  ArrowUpRight,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { KPIData } from "@/types";

const colorStyles: Record<KPIData["color"], { iconBg: string; iconText: string }> = {
  indigo: {
    iconBg: "bg-indigo-50/80 dark:bg-indigo-950/40",
    iconText: "text-indigo-600 dark:text-indigo-400",
  },
  cyan: {
    iconBg: "bg-cyan-50/80 dark:bg-cyan-950/40",
    iconText: "text-cyan-600 dark:text-cyan-400",
  },
  emerald: {
    iconBg: "bg-emerald-50/80 dark:bg-emerald-950/40",
    iconText: "text-emerald-600 dark:text-emerald-400",
  },
  rose: {
    iconBg: "bg-rose-50/80 dark:bg-rose-950/40",
    iconText: "text-rose-600 dark:text-rose-400",
  },
  amber: {
    iconBg: "bg-amber-50/80 dark:bg-amber-950/40",
    iconText: "text-amber-600 dark:text-amber-400",
  },
};

const iconMap: Record<string, LucideIcon> = {
  Briefcase,
  DollarSign,
  MapPin,
  Users,
  TrendingUp,
  Building2,
  GraduationCap,
  Code2,
  Target,
  Zap,
  Circle,
};

interface KPICardProps {
  data: KPIData;
  variant?: "default" | "hero";
}

export function KPICard({ data, variant = "default" }: KPICardProps) {
  const Icon = iconMap[data.icon] || Circle;
  const isPositive = (data.change ?? 0) >= 0;
  const isHero = variant === "hero";
  const styles = colorStyles[data.color] || colorStyles.indigo;

  if (isHero) {
    return (
      <div className="rounded-xl border border-white/[0.08] bg-[#18191B] text-white p-4 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400 tracking-wide uppercase">{data.label}</span>
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-slate-300 group-hover:bg-[#D4F84B] group-hover:text-[#161719] transition-colors">
            <ArrowUpRight className="h-3 w-3" />
          </div>
        </div>

        <div className="mb-2 text-2xl font-extrabold text-white tracking-tight tabular-nums">
          {data.value}
        </div>

        {data.change !== undefined && (
          <div className="inline-flex items-center gap-1 rounded-full bg-[#D4F84B]/15 px-2 py-0.5 text-[11px] font-bold text-[#D4F84B]">
            {isPositive ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
            <span>
              {isPositive ? "+" : ""}
              {data.change}% <span className="font-normal opacity-80">{data.changeLabel || "vs last year"}</span>
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-[#1E1F24] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-sm transition-all group">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate pr-1">
          {data.label}
        </span>
        <div className={cn("flex h-6 w-6 items-center justify-center rounded-full flex-shrink-0", styles.iconBg, styles.iconText)}>
          <Icon className="h-3 w-3" />
        </div>
      </div>

      <div className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight tabular-nums">
        {data.value}
      </div>

      {data.change !== undefined && (
        <div
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.2 text-[10px] font-semibold",
            isPositive
              ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
              : "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400"
          )}
        >
          {isPositive ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
          <span>
            {isPositive ? "+" : ""}
            {data.change}% <span className="font-normal text-slate-400">{data.changeLabel || "vs last year"}</span>
          </span>
        </div>
      )}
    </div>
  );
}

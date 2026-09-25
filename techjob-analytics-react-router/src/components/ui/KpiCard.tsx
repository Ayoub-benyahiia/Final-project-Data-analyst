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
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { KPIData } from "@/types";

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
  className?: string;
}

export function KPICard({ data, variant = "default", className }: KPICardProps) {
  const Icon = iconMap[data.icon] || Circle;
  const isHero = variant === "hero";
  const hasChange = data.change !== undefined && data.change !== null;
  const isPositive = (data.change ?? 0) >= 0;

  if (isHero) {
    return (
      <div
        className={cn(
          "rounded-[28px] sm:rounded-[40px] border border-[#a0b5eb] bg-[#cfdaf5] p-6 sm:p-8 text-[#242424] transition-all relative overflow-hidden flex flex-col justify-between",
          className
        )}
      >
        <div>
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-[#242424]">
              {data.label}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f6f3f1] text-[#2b59d1] border border-[#a0b5eb]">
              <Icon className="h-4 w-4 stroke-[2]" />
            </div>
          </div>

          <div className="mb-2 font-serif text-3xl sm:text-4xl font-normal text-[#242424] tracking-[-0.02em] tabular-nums leading-none">
            {data.value}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 font-mono text-xs text-[#4e4d4d]">
          {hasChange ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-medium",
                isPositive ? "bg-[#a7fccd] text-[#242424]" : "bg-[#ff9473]/30 text-[#242424]"
              )}
            >
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {isPositive ? "+" : ""}
              {data.change}%
            </span>
          ) : (
            <span className="h-2 w-2 rounded-full bg-[#2b59d1]" />
          )}
          {data.changeLabel ? (
            <span className="truncate text-[#4e4d4d]">{data.changeLabel}</span>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-[28px] sm:rounded-[40px] border border-[#cecac8] bg-[#f6f3f1] p-6 sm:p-8 text-[#242424] transition-all flex flex-col justify-between",
        className
      )}
    >
      <div>
        <div className="mb-4 flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-wider text-[#4e4d4d]">
            {data.label}
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#cecac8]/30 text-[#242424] border border-[#cecac8]">
            <Icon className="h-4 w-4 stroke-[2]" />
          </div>
        </div>

        <div className="mb-2 font-serif text-3xl sm:text-4xl font-normal text-[#242424] tracking-[-0.02em] tabular-nums leading-none">
          {data.value}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 font-mono text-xs text-[#797776]">
        {hasChange ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-medium",
              isPositive ? "bg-[#a7fccd]/50 text-[#242424]" : "bg-[#ff9473]/20 text-[#242424]"
            )}
          >
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {isPositive ? "+" : ""}
            {data.change}%
          </span>
        ) : (
          <span className="h-2 w-2 rounded-full bg-[#cecac8]" />
        )}
        {data.changeLabel ? (
          <span className="truncate text-[#797776]">{data.changeLabel}</span>
        ) : null}
      </div>
    </div>
  );
}


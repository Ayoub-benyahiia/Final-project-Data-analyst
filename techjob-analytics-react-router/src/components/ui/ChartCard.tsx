import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  height?: number;
  action?: React.ReactNode;
}

export function ChartCard({
  title,
  subtitle,
  children,
  className,
  loading = false,
  height = 220,
  action,
}: ChartCardProps) {
  if (loading) {
    return (
      <div className={cn("rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-[#1E1F24] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)]", className)}>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            {subtitle && <div className="mt-1 h-3 w-44 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />}
          </div>
        </div>
        <div className="animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" style={{ height }} />
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-[#1E1F24] p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-sm transition-all", className)}>
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">{title}</h3>
          {subtitle && <p className="mt-0.5 text-[11px] font-medium text-slate-400 dark:text-slate-400">{subtitle}</p>}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      <div style={{ height }}>{children}</div>
    </div>
  );
}

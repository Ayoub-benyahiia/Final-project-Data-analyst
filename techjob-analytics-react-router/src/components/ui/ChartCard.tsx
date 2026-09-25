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
  height = 240,
  action,
}: ChartCardProps) {
  if (loading) {
    return (
      <div
        className={cn(
          "rounded-[28px] sm:rounded-[40px] border border-[#cecac8] bg-[#f6f3f1] p-6 sm:p-8 md:p-10",
          className
        )}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="h-6 w-36 animate-pulse rounded-full bg-[#cecac8]/40" />
            {subtitle && <div className="mt-2 h-4 w-48 animate-pulse rounded-full bg-[#cecac8]/20" />}
          </div>
        </div>
        <div className="animate-pulse rounded-3xl bg-[#cecac8]/20" style={{ height }} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-[28px] sm:rounded-[40px] border border-[#cecac8] bg-[#f6f3f1] p-6 sm:p-8 md:p-10 flex flex-col justify-between transition-all",
        className
      )}
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#242424] tracking-[-0.02em]">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 font-mono text-xs sm:text-sm text-[#4e4d4d] leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      <div className="w-full" style={{ height }}>
        {children}
      </div>
    </div>
  );
}


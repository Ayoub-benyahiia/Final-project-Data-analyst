import { SearchX } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = "No data available",
  description = "Try adjusting your filters to see results.",
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center",
        className
      )}
    >
      {icon || <SearchX className="mb-4 h-12 w-12 text-slate-300 dark:text-slate-700" strokeWidth={1.5} />}
      <h3 className="mb-1 text-base font-medium text-slate-700 dark:text-slate-300">{title}</h3>
      <p className="text-sm text-slate-400 dark:text-slate-500">{description}</p>
    </div>
  );
}

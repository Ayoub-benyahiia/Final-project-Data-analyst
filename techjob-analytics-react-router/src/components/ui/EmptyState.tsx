import { SearchX } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  title = "No data available",
  description = "Try adjusting your active filters to see results.",
  icon,
  className,
  action,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[28px] sm:rounded-[40px] border border-dashed border-[#cecac8] bg-[#f6f3f1] p-8 sm:p-12 text-center",
        className
      )}
    >
      {icon || <SearchX className="mb-3 h-8 w-8 text-[#797776]" strokeWidth={1.5} />}
      <h3 className="mb-1 font-serif text-lg sm:text-xl font-normal text-[#242424] tracking-[-0.02em]">{title}</h3>
      <p className="font-mono text-xs sm:text-sm text-[#797776] max-w-sm leading-relaxed">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}


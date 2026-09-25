import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse rounded-full bg-[#cecac8]/30", className)} />
  );
}

export function KPICardSkeleton() {
  return (
    <div className="rounded-[28px] sm:rounded-[40px] border border-[#cecac8] bg-[#f6f3f1] p-6 sm:p-8">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="mb-3 h-9 w-32" />
      <Skeleton className="h-4 w-28" />
    </div>
  );
}

export function ChartCardSkeleton() {
  return (
    <div className="rounded-[28px] sm:rounded-[40px] border border-[#cecac8] bg-[#f6f3f1] p-6 sm:p-8 md:p-10">
      <div className="mb-6">
        <Skeleton className="mb-2 h-6 w-44" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="h-[200px] w-full rounded-3xl bg-[#cecac8]/20 animate-pulse" />
    </div>
  );
}


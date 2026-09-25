import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-[28px] sm:rounded-[40px] border border-ash bg-white/70 backdrop-blur-xs p-6 sm:p-8 text-off-black",
        className
      )}
    >
      {children}
    </div>
  );
}


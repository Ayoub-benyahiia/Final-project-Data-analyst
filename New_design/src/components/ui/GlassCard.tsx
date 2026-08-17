import React from 'react';

export interface GlassCardProps extends React.ComponentPropsWithoutRef<'div'> {
  variant?: 'default' | 'elevated' | 'subtle';
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export function GlassCard({
  variant = 'default',
  children,
  className = '',
  hoverEffect = true,
  ...props
}: GlassCardProps) {
  let baseStyles = 'rounded-2xl transition-all duration-300 backdrop-blur-xl ';

  switch (variant) {
    case 'elevated':
      baseStyles += 'bg-white/80 dark:bg-slate-850/80 border border-slate-200/80 dark:border-slate-700/60 shadow-xl shadow-slate-900/5 dark:shadow-black/40 ';
      break;
    case 'subtle':
      baseStyles += 'bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 ';
      break;
    case 'default':
    default:
      baseStyles += 'bg-white/90 dark:bg-slate-850/60 border border-slate-200/60 dark:border-slate-800/80 shadow-md shadow-slate-900/5 dark:shadow-black/20 ';
      break;
  }

  if (hoverEffect) {
    baseStyles += 'hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/15 hover:-translate-y-0.5 hover:border-indigo-500/30 dark:hover:border-indigo-500/40 ';
  }

  return (
    <div className={`${baseStyles} ${className}`} {...props}>
      {children}
    </div>
  );
}

export default GlassCard;

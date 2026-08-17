import React from 'react';
import { Badge } from './Badge';

interface PageHeaderProps {
  moduleNumber?: number;
  badgeText?: string;
  title: string;
  subtitle: string;
  lastUpdated?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  moduleNumber,
  badgeText,
  title,
  subtitle,
  lastUpdated = 'Live DuckDB Engine (<15ms)',
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
      <div className="space-y-1.5">
        {(moduleNumber || badgeText) && (
          <div className="flex items-center gap-2">
            <Badge variant="indigo">
              {moduleNumber ? `Module ${moduleNumber}` : ''} {badgeText ? `· ${badgeText}` : ''}
            </Badge>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              ● {lastUpdated}
            </span>
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
          {title}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          {subtitle}
        </p>
      </div>

      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

export default PageHeader;

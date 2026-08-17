import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';
import { GlassCard } from './GlassCard';

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <GlassCard variant="elevated" className="p-8 text-center space-y-4 max-w-lg mx-auto my-12 border-rose-500/30">
      <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-bold text-slate-950 dark:text-white">Something went wrong</h2>
      <p className="text-xs text-slate-500 font-mono">
        {error?.message || 'An unexpected analytical query error occurred in DuckDB.'}
      </p>
      {resetErrorBoundary && (
        <Button onClick={resetErrorBoundary} variant="primary" size="sm" className="mx-auto">
          <RotateCcw className="w-3.5 h-3.5" />
          Retry Module Query
        </Button>
      )}
    </GlassCard>
  );
}

export default ErrorFallback;

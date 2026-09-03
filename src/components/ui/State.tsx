import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      {icon && <div className="mb-3 text-slate-300">{icon}</div>}
      <h3 className="text-[14px] font-semibold text-slate-300">{title}</h3>
      {description && <p className="text-[13px] text-slate-500 mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

interface LoadingStateProps {
  rows?: number;
  className?: string;
}

export function TableLoading({ rows = 8, className }: LoadingStateProps) {
  return (
    <div className={cn('space-y-2 p-4', className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 animate-pulse">
          <div className="h-4 bg-slate-800/30 rounded flex-1" />
          <div className="h-4 bg-slate-800/30 rounded w-24" />
          <div className="h-4 bg-slate-800/30 rounded w-20" />
          <div className="h-4 bg-slate-800/30 rounded w-16" />
        </div>
      ))}
    </div>
  );
}

export function CardLoading({ className }: LoadingStateProps) {
  return (
    <div className={cn('card p-4 animate-pulse', className)}>
      <div className="h-3 bg-slate-800/30 rounded w-24 mb-3" />
      <div className="h-8 bg-slate-800/30 rounded w-32 mb-2" />
      <div className="h-3 bg-slate-800/30 rounded w-40" />
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({ title = 'Unable to load data', description = 'Something went wrong. Please try again.', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mb-3">
        <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-[14px] font-semibold text-slate-200">{title}</h3>
      <p className="text-[13px] text-slate-400 mt-1 max-w-sm">{description}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary mt-4">
          Retry
        </button>
      )}
    </div>
  );
}

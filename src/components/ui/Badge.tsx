import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps {
  children: ReactNode;
  variant?: 'neutral' | 'info' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'neutral', size = 'md', className }: BadgeProps) {
  const variants = {
    neutral: 'bg-slate-100 text-slate-600 border border-slate-200',
    info: 'bg-navy-50 text-navy-700 border border-navy-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    error: 'bg-red-50 text-red-700 border border-red-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-semibold rounded uppercase tracking-wide',
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-[11px]',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

interface StatusDotProps {
  status: 'operational' | 'demo' | 'partial' | 'issue';
  label?: string;
}

export function StatusDot({ status, label }: StatusDotProps) {
  const configs = {
    operational: { color: 'bg-emerald-500', label: 'Operational' },
    demo: { color: 'bg-amber-500', label: 'Demo Mode' },
    partial: { color: 'bg-orange-500', label: 'Partial' },
    issue: { color: 'bg-red-500', label: 'Issue' },
  };
  const config = configs[status];

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn('w-1.5 h-1.5 rounded-full pulse-dot', config.color)} />
      {label && <span className="text-[12px] text-slate-600">{label || config.label}</span>}
    </span>
  );
}

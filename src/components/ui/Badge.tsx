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
    neutral: 'bg-slate-800/60 text-slate-300 border border-slate-700/40',
    info: 'bg-sky-500/10 text-sky-400 border border-navy-200',
    success: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    error: 'bg-red-500/20 text-red-300 border border-red-500/30',
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
      {label && <span className="text-[12px] text-slate-300">{label || config.label}</span>}
    </span>
  );
}

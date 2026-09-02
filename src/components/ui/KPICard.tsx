import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus, ArrowUpRight } from 'lucide-react';
import { cn } from '@/utils/cn';

interface KPICardProps {
  label: string;
  value: string | number;
  supporting: string;
  trend?: { direction: 'up' | 'down' | 'flat'; value: string };
  accent?: 'default' | 'risk';
  to?: string;
  icon?: ReactNode;
}

export function KPICard({ label, value, supporting, trend, accent = 'default', to, icon }: KPICardProps) {
  const content = (
    <div
      className={cn(
        'card p-4 transition-all duration-200',
        to && 'hover:border-slate-300 hover:shadow-card-hover cursor-pointer',
        accent === 'risk' && 'border-l-4 border-l-red-400'
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        {icon && <span className="text-slate-300">{icon}</span>}
      </div>
      <div className="text-[26px] font-bold text-slate-900 tabular-nums leading-tight">{value}</div>
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-[12px] text-slate-400">{supporting}</span>
        {trend && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-[11px] font-medium',
              trend.direction === 'up' && 'text-emerald-600',
              trend.direction === 'down' && 'text-red-500',
              trend.direction === 'flat' && 'text-slate-400'
            )}
          >
            {trend.direction === 'up' && <TrendingUp className="w-3 h-3" />}
            {trend.direction === 'down' && <TrendingDown className="w-3 h-3" />}
            {trend.direction === 'flat' && <Minus className="w-3 h-3" />}
            {trend.value}
          </span>
        )}
      </div>
      {to && (
        <div className="mt-2 flex items-center gap-1 text-[11px] text-navy-600 font-medium">
          View <ArrowUpRight className="w-3 h-3" />
        </div>
      )}
    </div>
  );

  if (to) return <Link to={to}>{content}</Link>;
  return content;
}

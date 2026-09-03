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
        'card p-4 transition-all duration-300 hover-lift',
        to && 'cursor-pointer',
        accent === 'risk' && 'border-l-[3px]'
      )}
      style={accent === 'risk' ? {
        borderLeftColor: 'rgba(239, 68, 68, 0.6)',
        background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.08) 0%, rgba(15, 23, 42, 0.65) 40%)',
      } : undefined}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        {icon && <span className="text-slate-500">{icon}</span>}
      </div>
      <div className="text-[26px] font-bold text-white tabular-nums leading-tight animate-number">{value}</div>
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-[12px] text-slate-500">{supporting}</span>
        {trend && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-[11px] font-medium',
              trend.direction === 'up' && 'text-emerald-400',
              trend.direction === 'down' && 'text-red-400',
              trend.direction === 'flat' && 'text-slate-500'
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
        <div className="mt-2 flex items-center gap-1 text-[11px] text-sky-400 font-medium">
          View <ArrowUpRight className="w-3 h-3" />
        </div>
      )}
    </div>
  );

  if (to) return <Link to={to}>{content}</Link>;
  return content;
}

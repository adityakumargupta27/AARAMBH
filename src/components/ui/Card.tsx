import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  glow?: 'blue' | 'sky' | 'emerald' | 'red' | 'amber';
}

export function Card({ children, className, hover = false, onClick, glow }: CardProps) {
  const glowClass = glow ? `glow-${glow}` : '';
  return (
    <div
      onClick={onClick}
      className={cn(
        hover ? 'card-interactive hover-lift' : 'card',
        glowClass,
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between px-5 py-4', className)}
      style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.08)' }}
    >
      <div>
        <h3 className="text-[14px] font-semibold text-white">{title}</h3>
        {subtitle && <p className="text-[12px] text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export function CardBody({ children, className }: CardBodyProps) {
  return <div className={cn('p-5', className)}>{children}</div>;
}

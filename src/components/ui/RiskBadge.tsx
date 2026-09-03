import type { RiskLevel } from '@/types';
import { riskLevelConfig } from '@/utils/format';
import { cn } from '@/utils/cn';

interface RiskBadgeProps {
  level: RiskLevel;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export function RiskBadge({ level, showLabel = true, size = 'md' }: RiskBadgeProps) {
  const config = riskLevelConfig(level);
  return (
    <span className={cn(config.badgeClass, size === 'sm' && 'text-[10px] px-1.5 py-0.5')}>
      {showLabel ? config.label : <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.hex }} />}
    </span>
  );
}

interface RiskScoreProps {
  score: number;
  showLevel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function RiskScore({ score, showLevel = false, size = 'md' }: RiskScoreProps) {
  const level: RiskLevel = score >= 70 ? 'high' : score >= 50 ? 'review' : score >= 30 ? 'watch' : 'normal';
  const config = riskLevelConfig(level);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-2">
      <span className={cn('font-bold tabular-nums', sizeClasses[size], config.textClass)}>{score}</span>
      {showLevel && <RiskBadge level={level} size="sm" />}
    </div>
  );
}

interface RiskBarProps {
  score: number;
  showLabel?: boolean;
}

export function RiskBar({ score, showLabel = false }: RiskBarProps) {
  const level: RiskLevel = score >= 70 ? 'high' : score >= 50 ? 'review' : score >= 30 ? 'watch' : 'normal';
  const config = riskLevelConfig(level);

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 meter min-w-[60px]">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${score}%`, backgroundColor: config.hex }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium tabular-nums text-slate-500 w-7 text-right">{score}</span>
      )}
    </div>
  );
}

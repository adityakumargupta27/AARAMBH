import type { RiskLevel } from '@/types';

export function formatCurrency(amount: number, compact = false): string {
  if (compact) {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyShort(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return formatCurrency(amount);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-IN').format(n);
}

export function formatDate(date: string): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateShort(date: string): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  });
}

export function riskLevelConfig(level: RiskLevel): {
  label: string;
  badgeClass: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
  hex: string;
} {
  const configs = {
    high: {
      label: 'HIGH',
      badgeClass: 'badge-risk-high',
      textClass: 'text-red-700',
      bgClass: 'bg-red-50',
      borderClass: 'border-red-200',
      hex: '#ef4444',
    },
    review: {
      label: 'MEDIUM',
      badgeClass: 'badge-risk-review',
      textClass: 'text-orange-700',
      bgClass: 'bg-orange-50',
      borderClass: 'border-orange-200',
      hex: '#f97316',
    },
    watch: {
      label: 'LOW',
      badgeClass: 'badge-risk-watch',
      textClass: 'text-amber-700',
      bgClass: 'bg-amber-50',
      borderClass: 'border-amber-200',
      hex: '#f59e0b',
    },
    normal: {
      label: 'NORMAL',
      badgeClass: 'badge-risk-normal',
      textClass: 'text-emerald-700',
      bgClass: 'bg-emerald-50',
      borderClass: 'border-emerald-200',
      hex: '#10b981',
    },
  };
  return configs[level];
}

export function riskScoreToLevel(score: number): RiskLevel {
  if (score >= 70) return 'high';
  if (score >= 50) return 'review';
  if (score >= 30) return 'watch';
  return 'normal';
}

export function riskLevelLabel(level: RiskLevel): string {
  const labels = {
    high: 'HIGH PRIORITY REVIEW',
    review: 'REVIEW RECOMMENDED',
    watch: 'WATCH',
    normal: 'NORMAL',
  };
  return labels[level];
}

export function caseStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'open': 'Open',
    'under-review': 'Under Review',
    'escalated': 'Escalated',
    'resolved': 'Resolved',
  };
  return labels[status] || status;
}

export function signalLabel(category: string): string {
  const labels: Record<string, string> = {
    'price-anomaly': 'Price Anomaly',
    'bid-pattern': 'Bid Pattern',
    'contractor-history': 'Contractor History',
    'execution-variance': 'Execution Variance',
    'payment-anomaly': 'Payment Anomaly',
    'document-discrepancy': 'Document Discrepancy',
    'timeline-anomaly': 'Timeline Anomaly',
    'duplicate-similar': 'Duplicate/Similar Project',
  };
  return labels[category] || category;
}

import type { RiskLevel } from '@/types';

// ============================================================
// RISK BANDING — single source of truth
// ------------------------------------------------------------
// Every risk level in the product is DERIVED from a 0-100 score
// via riskScoreToLevel(). Nothing hardcodes a level, so a score
// and its label can never disagree across pages.
//
// Calibrated so the central demo case reads as specified:
//   Project MPLADS-1024  82 -> high    (HIGH PRIORITY REVIEW)
//   Tender  T-9281       81 -> high
//   Contractor CTR-001   76 -> review  (REVIEW RECOMMENDED)
// ============================================================

export const RISK_THRESHOLDS = {
  high: 80,
  review: 60,
  watch: 35,
} as const;

export function riskScoreToLevel(score: number): RiskLevel {
  if (score >= RISK_THRESHOLDS.high) return 'high';
  if (score >= RISK_THRESHOLDS.review) return 'review';
  if (score >= RISK_THRESHOLDS.watch) return 'watch';
  return 'normal';
}

export interface RiskLevelConfig {
  /** Compact badge text, e.g. "HIGH PRIORITY" */
  label: string;
  /** Full editorial label, e.g. "HIGH PRIORITY REVIEW" */
  fullLabel: string;
  /** Coarse severity band. Required so risk is never colour-only. */
  band: 'HIGH' | 'MEDIUM' | 'LOW';
  /** One-line plain-language meaning, used in tooltips. */
  meaning: string;
  badgeClass: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
  barClass: string;
  dotClass: string;
  hex: string;
}

const RISK_CONFIG: Record<RiskLevel, RiskLevelConfig> = {
  high: {
    label: 'HIGH PRIORITY',
    fullLabel: 'HIGH PRIORITY REVIEW',
    band: 'HIGH',
    meaning: 'Multiple corroborating signals. Recommended for investigation.',
    badgeClass: 'badge-risk-high',
    textClass: 'text-risk-high-text',
    bgClass: 'bg-risk-high-bg',
    borderClass: 'border-risk-high-border',
    barClass: 'bg-risk-high',
    dotClass: 'bg-risk-high',
    hex: '#dc2626',
  },
  review: {
    label: 'REVIEW',
    fullLabel: 'REVIEW RECOMMENDED',
    band: 'MEDIUM',
    meaning: 'One or more signals above threshold. Review recommended.',
    badgeClass: 'badge-risk-review',
    textClass: 'text-risk-review-text',
    bgClass: 'bg-risk-review-bg',
    borderClass: 'border-risk-review-border',
    barClass: 'bg-risk-review',
    dotClass: 'bg-risk-review',
    hex: '#ea580c',

  },
  watch: {
    label: 'WATCH',
    fullLabel: 'WATCH',
    band: 'LOW',
    meaning: 'Minor deviations only. Monitor, no action required.',
    badgeClass: 'badge-risk-watch',
    textClass: 'text-risk-watch-text',
    bgClass: 'bg-risk-watch-bg',
    borderClass: 'border-risk-watch-border',
    barClass: 'bg-risk-watch',
    dotClass: 'bg-risk-watch',
    hex: '#d97706',
  },
  normal: {
    label: 'NORMAL',
    fullLabel: 'NORMAL',
    band: 'LOW',
    meaning: 'No material deviation from comparable records.',
    badgeClass: 'badge-risk-normal',
    textClass: 'text-risk-normal-text',
    bgClass: 'bg-risk-normal-bg',
    borderClass: 'border-risk-normal-border',
    barClass: 'bg-risk-normal',
    dotClass: 'bg-risk-normal',
    hex: '#059669',
  },
};

export function riskLevelConfig(level: RiskLevel): RiskLevelConfig {
  return RISK_CONFIG[level];
}

/** Config resolved straight from a score — preferred call site. */
export function riskConfigForScore(score: number): RiskLevelConfig {
  return RISK_CONFIG[riskScoreToLevel(score)];
}

export function riskLevelLabel(level: RiskLevel): string {
  return RISK_CONFIG[level].fullLabel;
}

/** Accessible description combining level and band — never colour alone. */
export function riskAriaLabel(score: number): string {
  const c = riskConfigForScore(score);
  return `Risk score ${score} of 100 — ${c.fullLabel.toLowerCase()}, ${c.band.toLowerCase()} severity`;
}

// ============================================================
// CURRENCY — Indian numbering (lakh / crore)
// ============================================================

/** Full precision, e.g. ₹49,20,000 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Compact lakh/crore form used in tables and KPI cards.
 * ₹49.2L · ₹1.28 Cr · ₹8,250
 */
export function formatCurrencyShort(amount: number): string {
  if (Math.abs(amount) >= 10000000) {
    return `₹${trimZero(amount / 10000000)} Cr`;
  }
  if (Math.abs(amount) >= 100000) {
    return `₹${trimZero(amount / 100000)}L`;
  }
  return formatCurrency(amount);
}

function trimZero(n: number): string {
  const fixed = n.toFixed(n < 10 ? 2 : 1);
  return fixed.replace(/\.?0+$/, '');
}

/** Crore-denominated, for aggregate/portfolio values. ₹1,284 Cr */
export function formatCrore(amount: number): string {
  return `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
    Math.round(amount / 10000000),
  )} Cr`;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-IN').format(n);
}

export function formatPercent(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

/** Signed deviation, e.g. +45.5% / −64.7% */
export function formatDeviation(n: number, digits = 1): string {
  const sign = n > 0 ? '+' : n < 0 ? '−' : '';
  return `${sign}${Math.abs(n).toFixed(digits)}%`;
}

/** Signed percentage-point gap, e.g. −4 pp */
export function formatPointGap(n: number, digits = 0): string {
  const sign = n > 0 ? '+' : n < 0 ? '−' : '';
  return `${sign}${Math.abs(n).toFixed(digits)} pp`;
}

// ============================================================
// DATES
// ============================================================

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

/** Reference "today" for the demo build. */
export const DEMO_TODAY = '2026-09-03';

export function daysBetween(from: string, to: string): number {
  const a = new Date(from).getTime();
  const b = new Date(to).getTime();
  return Math.round((b - a) / 86400000);
}

// ============================================================
// LABELS
// ============================================================

const SIGNAL_LABELS: Record<string, string> = {
  'price-anomaly': 'Price anomaly',
  'bid-pattern': 'Bid pattern',
  'contractor-history': 'Contractor history',
  'execution-variance': 'Execution variance',
  'payment-anomaly': 'Payment anomaly',
  'document-discrepancy': 'Document discrepancy',
  'timeline-anomaly': 'Timeline anomaly',
  'duplicate-similar': 'Duplicate or similar work',
};

export function signalLabel(category: string): string {
  return SIGNAL_LABELS[category] ?? category;
}

const SIGNAL_MEANINGS: Record<string, string> = {
  'price-anomaly': 'Unit rates deviate from comparable project records.',
  'bid-pattern': 'Bid spread or participation differs from the historical comparison set.',
  'contractor-history': 'Historical delay or cancellation rate above the peer group.',
  'execution-variance': 'Reported physical progress and financial utilisation diverge.',
  'payment-anomaly': 'Payment timing or sequencing departs from the expected pattern.',
  'document-discrepancy': 'Field values differ between records and supporting documents.',
  'timeline-anomaly': 'Procurement or execution dates fall outside expected ranges.',
  'duplicate-similar': 'Scope closely resembles another sanctioned work.',
};

export function signalMeaning(category: string): string {
  return SIGNAL_MEANINGS[category] ?? '';
}

const CASE_STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  'under-review': 'Under Review',
  escalated: 'Escalated',
  resolved: 'Resolved',
};

export function caseStatusLabel(status: string): string {
  return CASE_STATUS_LABELS[status] ?? status;
}

export function caseStatusClass(status: string): string {
  switch (status) {
    case 'open':
      return 'badge-status-open';
    case 'under-review':
      return 'badge-status-review';
    case 'escalated':
      return 'badge-status-escalated';
    case 'resolved':
      return 'badge-status-resolved';
    default:
      return 'badge-neutral';
  }
}

const ENTITY_STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  completed: 'Completed',
  delayed: 'Delayed',
  cancelled: 'Cancelled',
  pending: 'Pending',
};

export function entityStatusLabel(status: string): string {
  return ENTITY_STATUS_LABELS[status] ?? status;
}

export function entityStatusClass(status: string): string {
  switch (status) {
    case 'completed':
      return 'badge-risk-normal';
    case 'active':
      return 'badge-info';
    case 'delayed':
      return 'badge-risk-review';
    case 'cancelled':
      return 'badge-risk-high';
    default:
      return 'badge-neutral';
  }
}

const DOC_TYPE_LABELS: Record<string, string> = {
  'tender-document': 'Tender Document',
  boq: 'BOQ',
  'work-order': 'Work Order',
  agreement: 'Agreement',
  invoice: 'Invoice',
  'payment-certificate': 'Payment Certificate',
  'completion-certificate': 'Completion Certificate',
};

export function docTypeLabel(type: string): string {
  return DOC_TYPE_LABELS[type] ?? type;
}

const DOC_STATUS_LABELS: Record<string, string> = {
  verified: 'Verified',
  'pending-review': 'Pending Review',
  mismatch: 'Mismatch',
  unavailable: 'Unavailable',
};

export function docStatusLabel(status: string): string {
  return DOC_STATUS_LABELS[status] ?? status;
}

export function docStatusClass(status: string): string {
  switch (status) {
    case 'verified':
      return 'badge-risk-normal';
    case 'pending-review':
      return 'badge-risk-watch';
    case 'mismatch':
      return 'badge-risk-high';
    default:
      return 'badge-neutral';
  }
}

const TXN_TYPE_LABELS: Record<string, string> = {
  'mobilization-advance': 'Mobilisation advance',
  'milestone-payment': 'Milestone payment',
  'interim-payment': 'Interim payment',
  'final-payment': 'Final payment',
};

export function txnTypeLabel(type: string): string {
  return TXN_TYPE_LABELS[type] ?? type;
}

export function confidenceLabel(c: string): string {
  return c.charAt(0).toUpperCase() + c.slice(1);
}

export function confidenceClass(c: string): string {
  switch (c) {
    case 'high':
      return 'badge-neutral-strong';
    case 'medium':
      return 'badge-neutral';
    default:
      return 'badge-neutral-soft';
  }
}

/**
 * Evidence status labels. Deliberately non-conclusive: an evidence
 * record is never "confirmed wrongdoing", only corroborated as a signal.
 */
const EVIDENCE_STATUS_LABELS: Record<string, string> = {
  confirmed: 'Corroborated',
  'review-recommended': 'Review recommended',
  'needs-verification': 'Verification required',
};

export function evidenceStatusLabel(status: string): string {
  return EVIDENCE_STATUS_LABELS[status] ?? status;
}

export function evidenceStatusClass(status: string): string {
  switch (status) {
    case 'confirmed':
      return 'badge-neutral-strong';
    case 'review-recommended':
      return 'badge-risk-review';
    default:
      return 'badge-risk-watch';
  }
}

// ============================================================
// SHARED COPY — one wording for the platform's core caveat
// ============================================================

export const RISK_DISCLAIMER =
  'Risk indicators are analytical signals intended for review and do not independently establish fraud, corruption or criminal liability.';

export const RISK_SCORE_TOOLTIP =
  'Composite indicator based on available anomaly signals. It is intended for prioritisation and does not establish wrongdoing.';

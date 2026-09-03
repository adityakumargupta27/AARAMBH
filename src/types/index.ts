// ============================================================
// AARAMBHA — Core Type System
// Procurement Intelligence & Investigation Platform
// ============================================================

export type RiskLevel = 'normal' | 'watch' | 'review' | 'high';
export type CaseStatus = 'open' | 'under-review' | 'escalated' | 'resolved';
export type EntityStatus = 'active' | 'completed' | 'delayed' | 'cancelled' | 'pending';

export interface Project {
  id: string;
  name: string;
  state: string;
  constituency: string;
  projectType: string;
  estimatedCost: number; // in rupees
  sanctionedAmount: number;
  tenderValue: number;
  awardValue: number;
  expenditure: number;
  physicalProgress: number; // percentage 0-100
  status: EntityStatus;
  riskScore: number; // 0-100
  riskLevel: RiskLevel;
  lastUpdated: string;
  recommendedDate: string;
  sanctionedDate: string;
  tenderPublishedDate: string;
  biddingClosedDate: string;
  contractAwardedDate: string;
  executionStartDate: string;
  expectedCompletionDate: string;
  tenderId: string;
  contractId: string;
  contractorId: string;
  mpName: string;
  mpConstituency: string;
  fiscalYear: string;
  description: string;
}

export interface Tender {
  id: string;
  projectId: string;
  projectName: string;
  state: string;
  tenderValue: number;
  tenderStatus: 'published' | 'closed' | 'awarded' | 'cancelled';
  closingDate: string;
  publishedDate: string;
  bidderCount: number;
  bidders: Bidder[];
  winnerId: string;
  winnerName: string;
  winningBid: number;
  bidSpread: number; // percentage
  historicalMedianSpread: number; // percentage
  riskScore: number;
  riskLevel: RiskLevel;
  projectType: string;
  awardDate: string;
  contractId: string;
}

export interface Bidder {
  rank: number;
  contractorId: string;
  name: string;
  bidAmount: number;
  differenceFromLowest: number; // percentage
  historicalParticipation: number;
  status: 'winner' | 'participated' | 'disqualified';
}

export interface Contractor {
  id: string;
  name: string;
  previousContracts: number;
  completed: number;
  delayed: number;
  cancelled: number;
  averageValue: number;
  riskScore: number;
  riskLevel: RiskLevel;
  registrationDate: string;
  registrationNumber: string;
  categories: string[];
  states: string[];
  totalValueAwarded: number;
  delayRate: number; // percentage
  peerDelayRate: number; // percentage
}

export interface Contract {
  id: string;
  projectId: string;
  projectName: string;
  tenderId: string;
  contractorId: string;
  contractorName: string;
  awardValue: number;
  awardDate: string;
  startDate: string;
  expectedCompletionDate: string;
  currentProgress: number;
  expenditure: number;
  status: EntityStatus;
  riskScore: number;
  riskLevel: RiskLevel;
  state: string;
}

export interface Transaction {
  id: string;
  contractId: string;
  date: string;
  type: 'milestone-payment' | 'interim-payment' | 'final-payment' | 'mobilization-advance';
  amount: number;
  reference: string;
  status: 'processed' | 'pending' | 'verified';
}

export interface RiskSignal {
  id: string;
  category: RiskSignalCategory;
  label: string;
  score: number; // 0-100
  finding: string;
  value: string;
  benchmark: string;
  deviation: string;
  source: string;
  confidence: 'high' | 'medium' | 'low';
  status: 'confirmed' | 'review-recommended' | 'needs-verification';
  evidenceCount: number;
}

export type RiskSignalCategory =
  | 'price-anomaly'
  | 'bid-pattern'
  | 'contractor-history'
  | 'execution-variance'
  | 'payment-anomaly'
  | 'document-discrepancy'
  | 'timeline-anomaly'
  | 'duplicate-similar';

export interface RiskAssessment {
  projectId: string;
  overallScore: number;
  overallLevel: RiskLevel;
  signals: RiskSignal[];
  assessedAt: string;
}

export interface InvestigationCase {
  id: string;
  projectId: string;
  projectName: string;
  contractId: string;
  tenderId: string;
  contractorId: string;
  contractorName: string;
  state: string;
  riskScore: number;
  riskLevel: RiskLevel;
  primarySignal: RiskSignalCategory;
  secondarySignals: RiskSignalCategory[];
  status: CaseStatus;
  detectedDate: string;
  assignedReviewer: string;
  evidenceCount: number;
  caseValue: number;
  lastUpdated: string;
}

export interface Evidence {
  id: string;
  caseId: string;
  signalCategory: RiskSignalCategory;
  title: string;
  finding: string;
  value: string;
  benchmark: string;
  deviation: string;
  confidence: 'high' | 'medium' | 'low';
  source: string;
  recommendedVerification: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  label: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | 'flagged';
  category: 'project' | 'tender' | 'contract' | 'execution' | 'risk' | 'financial';
}

export interface Document {
  id: string;
  projectId: string;
  name: string;
  type: DocumentType;
  date: string;
  status: 'verified' | 'pending-review' | 'mismatch' | 'unavailable';
  lastChecked: string;
  extractedFields?: ExtractedField[];
  mismatches?: DocumentMismatch[];
}

export type DocumentType =
  | 'tender-document'
  | 'boq'
  | 'work-order'
  | 'agreement'
  | 'invoice'
  | 'payment-certificate'
  | 'completion-certificate';

export interface ExtractedField {
  label: string;
  value: string;
}

export interface DocumentMismatch {
  field: string;
  databaseValue: string;
  documentValue: string;
  difference: string;
  severity: 'high' | 'medium' | 'low';
  recommendation: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  structured?: AIResponseStructure;
  timestamp: string;
}

export interface AIResponseStructure {
  answer?: string;
  signals?: { label: string; description: string }[];
  evidence?: string[];
  recommendation?: string;
  disclaimer?: string;
}

export interface ComparableProject {
  id: string;
  name: string;
  location: string;
  quantity: number;
  unitPrice: number;
  isCurrent: boolean;
}

export interface StateRiskData {
  state: string;
  projects: number;
  contracts: number;
  highPriority: number;
  riskIndex: number;
  region: 'north' | 'south' | 'east' | 'west' | 'central' | 'northeast';
}

export interface Notification {
  id: string;
  title: string;
  time: string;
  type: 'risk' | 'update' | 'document' | 'contractor';
  read: boolean;
  link?: string;
}

export interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'ready' | 'generating' | 'scheduled';
  category: string;
}

export interface MPAllocation {
  srNo: number;
  state: string;
  mpName: string;
  constituency: string;
  allocatedAmount: number;
  isBaseline: boolean;
  variancePercentage: number;
}


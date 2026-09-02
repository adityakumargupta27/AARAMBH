import type {
  Project,
  Tender,
  Contractor,
  Contract,
  Transaction,
  RiskAssessment,
  InvestigationCase,
  Evidence,
  TimelineEvent,
  Document,
  ComparableProject,
  StateRiskData,
  Notification,
  ReportTemplate,
  AIMessage,
} from '@/types';

// ============================================================
// CENTRAL DEMO CASE — Construction of Community Hall
// MPLADS-1024 / T-9281 / C-9281 / CTR-001 / AR-2026-001024
// ============================================================

export const demoProject: Project = {
  id: 'MPLADS-1024',
  name: 'Construction of Community Hall',
  state: 'Maharashtra',
  constituency: 'Pune',
  projectType: 'Infrastructure',
  estimatedCost: 5000000,
  sanctionedAmount: 5200000,
  tenderValue: 5000000,
  awardValue: 4920000,
  expenditure: 4270000,
  physicalProgress: 68,
  status: 'active',
  riskScore: 82,
  riskLevel: 'high',
  lastUpdated: '2026-09-02',
  recommendedDate: '2026-01-05',
  sanctionedDate: '2026-01-12',
  tenderPublishedDate: '2026-01-15',
  biddingClosedDate: '2026-01-18',
  contractAwardedDate: '2026-01-20',
  executionStartDate: '2026-02-05',
  expectedCompletionDate: '2026-10-15',
  tenderId: 'T-9281',
  contractId: 'C-9281',
  contractorId: 'CTR-001',
  mpName: 'Hon. Rajesh Deshmukh',
  mpConstituency: 'Pune',
  fiscalYear: '2025-26',
  description:
    'Construction of a community hall with seating capacity of 500, including civil works, electrical fittings, and ancillary facilities under MPLADS funding.',
};

export const demoTender: Tender = {
  id: 'T-9281',
  projectId: 'MPLADS-1024',
  projectName: 'Construction of Community Hall',
  state: 'Maharashtra',
  tenderValue: 5000000,
  tenderStatus: 'awarded',
  closingDate: '2026-01-18',
  publishedDate: '2026-01-15',
  bidderCount: 5,
  bidders: [
    { rank: 1, contractorId: 'CTR-001', name: 'ABC Infrastructure Pvt Ltd', bidAmount: 4920000, differenceFromLowest: 0, historicalParticipation: 18, status: 'winner' },
    { rank: 2, contractorId: 'CTR-002', name: 'XYZ Contractors', bidAmount: 4950000, differenceFromLowest: 0.61, historicalParticipation: 12, status: 'participated' },
    { rank: 3, contractorId: 'CTR-003', name: 'PQR Works Ltd', bidAmount: 4980000, differenceFromLowest: 1.22, historicalParticipation: 9, status: 'participated' },
    { rank: 4, contractorId: 'CTR-004', name: 'DEF Projects', bidAmount: 5010000, differenceFromLowest: 1.83, historicalParticipation: 7, status: 'participated' },
    { rank: 5, contractorId: 'CTR-005', name: 'MNO Infra Solutions', bidAmount: 5040000, differenceFromLowest: 2.44, historicalParticipation: 4, status: 'participated' },
  ],
  winnerId: 'CTR-001',
  winnerName: 'ABC Infrastructure Pvt Ltd',
  winningBid: 4920000,
  bidSpread: 2.4,
  historicalMedianSpread: 6.8,
  riskScore: 81,
  riskLevel: 'high',
  projectType: 'Infrastructure',
  awardDate: '2026-01-20',
  contractId: 'C-9281',
};

export const demoContractor: Contractor = {
  id: 'CTR-001',
  name: 'ABC Infrastructure Pvt Ltd',
  previousContracts: 42,
  completed: 29,
  delayed: 10,
  cancelled: 3,
  averageValue: 4860000,
  riskScore: 76,
  riskLevel: 'review',
  registrationDate: '2018-03-15',
  registrationNumber: 'MAH-PWD-2018-04471',
  categories: ['Infrastructure', 'Civil Works', 'Public Buildings'],
  states: ['Maharashtra', 'Gujarat', 'Karnataka'],
  totalValueAwarded: 204120000,
  delayRate: 23.8,
  peerDelayRate: 9.4,
};

export const demoContract: Contract = {
  id: 'C-9281',
  projectId: 'MPLADS-1024',
  projectName: 'Construction of Community Hall',
  tenderId: 'T-9281',
  contractorId: 'CTR-001',
  contractorName: 'ABC Infrastructure Pvt Ltd',
  awardValue: 4920000,
  awardDate: '2026-01-20',
  startDate: '2026-02-05',
  expectedCompletionDate: '2026-10-15',
  currentProgress: 68,
  expenditure: 4270000,
  status: 'active',
  riskScore: 82,
  riskLevel: 'high',
  state: 'Maharashtra',
};

export const demoTransactions: Transaction[] = [
  { id: 'TXN-001', contractId: 'C-9281', date: '2026-02-10', type: 'mobilization-advance', amount: 492000, reference: 'PAY-2026-0110', status: 'verified' },
  { id: 'TXN-002', contractId: 'C-9281', date: '2026-03-15', type: 'milestone-payment', amount: 985000, reference: 'PAY-2026-0188', status: 'verified' },
  { id: 'TXN-003', contractId: 'C-9281', date: '2026-04-22', type: 'interim-payment', amount: 1230000, reference: 'PAY-2026-0301', status: 'verified' },
  { id: 'TXN-004', contractId: 'C-9281', date: '2026-06-05', type: 'interim-payment', amount: 985000, reference: 'PAY-2026-0482', status: 'processed' },
  { id: 'TXN-005', contractId: 'C-9281', date: '2026-07-18', type: 'milestone-payment', amount: 575000, reference: 'PAY-2026-0619', status: 'processed' },
  { id: 'TXN-006', contractId: 'C-9281', date: '2026-08-25', type: 'interim-payment', amount: 0, reference: 'PAY-2026-PENDING', status: 'pending' },
];

export const demoRiskAssessment: RiskAssessment = {
  projectId: 'MPLADS-1024',
  overallScore: 82,
  overallLevel: 'high',
  assessedAt: '2026-08-15',
  signals: [
    {
      id: 'RS-001',
      category: 'price-anomaly',
      label: 'Price Anomaly',
      score: 92,
      finding: 'Unit price significantly above peer benchmark',
      value: '₹12,000/unit',
      benchmark: '₹8,250/unit',
      deviation: '+45.5%',
      source: 'Comparable project records',
      confidence: 'high',
      status: 'review-recommended',
      evidenceCount: 5,
    },
    {
      id: 'RS-002',
      category: 'bid-pattern',
      label: 'Bid Pattern',
      score: 81,
      finding: 'Bid spread narrower than historical comparison group',
      value: '2.4%',
      benchmark: '6.8%',
      deviation: '-64.7%',
      source: 'Bid records',
      confidence: 'medium',
      status: 'review-recommended',
      evidenceCount: 3,
    },
    {
      id: 'RS-003',
      category: 'contractor-history',
      label: 'Contractor History',
      score: 76,
      finding: 'Contractor delay rate significantly above peer average',
      value: '23.8%',
      benchmark: '9.4%',
      deviation: '+153%',
      source: 'Contractor history',
      confidence: 'high',
      status: 'confirmed',
      evidenceCount: 7,
    },
    {
      id: 'RS-004',
      category: 'execution-variance',
      label: 'Execution Variance',
      score: 54,
      finding: 'Financial utilization ahead of physical progress',
      value: '86.8%',
      benchmark: '68%',
      deviation: '+18.8 pp',
      source: 'Execution & financial records',
      confidence: 'medium',
      status: 'needs-verification',
      evidenceCount: 2,
    },
    {
      id: 'RS-005',
      category: 'document-discrepancy',
      label: 'Document Consistency',
      score: 32,
      finding: 'Minor inconsistency in document amounts',
      value: '₹82,00,000',
      benchmark: '₹72,00,000',
      deviation: '+13.9%',
      source: 'Document verification',
      confidence: 'low',
      status: 'needs-verification',
      evidenceCount: 1,
    },
  ],
};

export const demoInvestigationCase: InvestigationCase = {
  id: 'AR-2026-001024',
  projectId: 'MPLADS-1024',
  projectName: 'Construction of Community Hall',
  contractId: 'C-9281',
  tenderId: 'T-9281',
  contractorId: 'CTR-001',
  contractorName: 'ABC Infrastructure Pvt Ltd',
  state: 'Maharashtra',
  riskScore: 82,
  riskLevel: 'high',
  primarySignal: 'price-anomaly',
  secondarySignals: ['contractor-history', 'bid-pattern'],
  status: 'open',
  detectedDate: '2026-08-15',
  assignedReviewer: 'Unassigned',
  evidenceCount: 12,
  caseValue: 4920000,
  lastUpdated: '2026-09-01',
};

export const demoEvidence: Evidence[] = [
  {
    id: 'EV-001',
    caseId: 'AR-2026-001024',
    signalCategory: 'price-anomaly',
    title: 'Price Anomaly',
    finding: 'Current unit price is approximately 45.5% above the peer benchmark for comparable projects in the same region.',
    value: '₹12,000/unit',
    benchmark: '₹8,250/unit',
    deviation: '+45.5%',
    confidence: 'high',
    source: 'Comparable project records',
    recommendedVerification: 'Review BOQ specifications, quantities, location-specific costs and market conditions.',
  },
  {
    id: 'EV-002',
    caseId: 'AR-2026-001024',
    signalCategory: 'contractor-history',
    title: 'Contractor History',
    finding: 'The contractor shows a higher historical delay rate (23.8%) than the selected comparison group (9.4%).',
    value: '23.8% delay rate',
    benchmark: '9.4% peer delay rate',
    deviation: '+153%',
    confidence: 'high',
    source: 'Contractor history',
    recommendedVerification: 'Review contractor performance records, past project completion reports and delay justifications.',
  },
  {
    id: 'EV-003',
    caseId: 'AR-2026-001024',
    signalCategory: 'bid-pattern',
    title: 'Bid Pattern',
    finding: 'The tender shows a narrower bid spread (2.4%) than the historical comparison set (6.8%).',
    value: '2.4% spread',
    benchmark: '6.8% historical median',
    deviation: '-64.7%',
    confidence: 'medium',
    source: 'Bid records',
    recommendedVerification: 'Review tender documentation and bidder history. Bid-pattern anomalies do not establish collusion.',
  },
];

export const demoTimeline: TimelineEvent[] = [
  { id: 'TL-01', date: '2026-01-05', label: 'Project Recommended', description: 'Project recommended by MP under MPLADS', status: 'completed', category: 'project' },
  { id: 'TL-02', date: '2026-01-12', label: 'Sanctioned', description: '₹52,00,000 sanctioned by district authority', status: 'completed', category: 'project' },
  { id: 'TL-03', date: '2026-01-15', label: 'Tender Published', description: 'Tender T-9281 published with estimated value ₹50L', status: 'completed', category: 'tender' },
  { id: 'TL-04', date: '2026-01-18', label: 'Bidding Closed', description: '5 bids received, bid spread 2.4%', status: 'completed', category: 'tender' },
  { id: 'TL-05', date: '2026-01-20', label: 'Contract Awarded', description: 'Awarded to ABC Infrastructure Pvt Ltd for ₹49.2L', status: 'completed', category: 'contract' },
  { id: 'TL-06', date: '2026-02-05', label: 'Execution Started', description: 'Mobilization advance released, work commenced', status: 'completed', category: 'execution' },
  { id: 'TL-07', date: '2026-08-15', label: 'Risk Signal Generated', description: 'Risk engine flagged case — overall score 82/100', status: 'flagged', category: 'risk' },
  { id: 'TL-08', date: '2026-09-01', label: 'Investigation Opened', description: 'Case AR-2026-001024 opened for review', status: 'in-progress', category: 'risk' },
];

export const demoDocuments: Document[] = [
  {
    id: 'DOC-001',
    projectId: 'MPLADS-1024',
    name: 'Tender Notice T-9281',
    type: 'tender-document',
    date: '2026-01-15',
    status: 'verified',
    lastChecked: '2026-09-01',
    extractedFields: [
      { label: 'Document ID', value: 'TN-9281' },
      { label: 'Authority', value: 'District Collector, Pune' },
      { label: 'Tender Value', value: '₹50,00,000' },
      { label: 'Published Date', value: '15 Jan 2026' },
      { label: 'Tender ID', value: 'T-9281' },
      { label: 'Project ID', value: 'MPLADS-1024' },
    ],
  },
  {
    id: 'DOC-002',
    projectId: 'MPLADS-1024',
    name: 'Bill of Quantities',
    type: 'boq',
    date: '2026-01-15',
    status: 'pending-review',
    lastChecked: '2026-09-01',
    extractedFields: [
      { label: 'Document ID', value: 'BOQ-9281' },
      { label: 'Total Items', value: '47' },
      { label: 'Estimated Total', value: '₹50,00,000' },
      { label: 'Unit Price (Civil)', value: '₹12,000' },
      { label: 'Tender ID', value: 'T-9281' },
      { label: 'Project ID', value: 'MPLADS-1024' },
    ],
    mismatches: [
      {
        field: 'Unit Price (Civil Works)',
        databaseValue: '₹8,250/unit',
        documentValue: '₹12,000/unit',
        difference: '+₹3,750/unit (+45.5%)',
        severity: 'high',
        recommendation: 'Verify BOQ specifications and local market pricing for the specific construction category.',
      },
    ],
  },
  {
    id: 'DOC-003',
    projectId: 'MPLADS-1024',
    name: 'Work Order C-9281',
    type: 'work-order',
    date: '2026-01-20',
    status: 'verified',
    lastChecked: '2026-09-01',
    extractedFields: [
      { label: 'Document ID', value: 'WO-9281' },
      { label: 'Contractor', value: 'ABC Infrastructure Pvt Ltd' },
      { label: 'Award Value', value: '₹49,20,000' },
      { label: 'Start Date', value: '05 Feb 2026' },
      { label: 'Contract ID', value: 'C-9281' },
      { label: 'Project ID', value: 'MPLADS-1024' },
    ],
  },
  {
    id: 'DOC-004',
    projectId: 'MPLADS-1024',
    name: 'Agreement Document',
    type: 'agreement',
    date: '2026-01-22',
    status: 'mismatch',
    lastChecked: '2026-08-30',
    extractedFields: [
      { label: 'Document ID', value: 'AGR-9281' },
      { label: 'Contractor', value: 'ABC Infrastructure Pvt Ltd' },
      { label: 'Amount', value: '₹82,00,000' },
      { label: 'Date', value: '03 May 2026' },
      { label: 'Contract ID', value: 'C-9281' },
      { label: 'Project ID', value: 'MPLADS-1024' },
    ],
    mismatches: [
      {
        field: 'Contract Value',
        databaseValue: '₹49,20,000',
        documentValue: '₹82,00,000',
        difference: '₹32,80,000',
        severity: 'high',
        recommendation: 'Verify the source agreement document. Significant value mismatch detected.',
      },
      {
        field: 'Agreement Date',
        databaseValue: '20 Jan 2026',
        documentValue: '03 May 2026',
        difference: '103 days',
        severity: 'medium',
        recommendation: 'Date inconsistency — verify document version and execution timeline.',
      },
    ],
  },
  {
    id: 'DOC-005',
    projectId: 'MPLADS-1024',
    name: 'Invoice Set',
    type: 'invoice',
    date: '2026-08-01',
    status: 'pending-review',
    lastChecked: '2026-08-28',
    extractedFields: [
      { label: 'Document ID', value: 'INV-9281-SET' },
      { label: 'Total Invoiced', value: '₹42,70,000' },
      { label: 'Invoice Count', value: '5' },
      { label: 'Last Invoice Date', value: '25 Aug 2026' },
      { label: 'Contract ID', value: 'C-9281' },
      { label: 'Project ID', value: 'MPLADS-1024' },
    ],
  },
  {
    id: 'DOC-006',
    projectId: 'MPLADS-1024',
    name: 'Payment Certificates',
    type: 'payment-certificate',
    date: '2026-08-25',
    status: 'verified',
    lastChecked: '2026-08-30',
    extractedFields: [
      { label: 'Document ID', value: 'PC-9281-SET' },
      { label: 'Total Certified', value: '₹42,70,000' },
      { label: 'Certificate Count', value: '5' },
      { label: 'Last Certificate', value: '18 Jul 2026' },
      { label: 'Contract ID', value: 'C-9281' },
      { label: 'Project ID', value: 'MPLADS-1024' },
    ],
  },
  {
    id: 'DOC-007',
    projectId: 'MPLADS-1024',
    name: 'Completion Certificate',
    type: 'completion-certificate',
    date: '',
    status: 'unavailable',
    lastChecked: '2026-09-01',
  },
];

export const demoComparableProjects: ComparableProject[] = [
  { id: 'CMP-001', name: 'Community Hall — Wagholi', location: 'Pune, MH', quantity: 410, unitPrice: 8100, isCurrent: false },
  { id: 'CMP-002', name: 'Community Hall — Hadapsar', location: 'Pune, MH', quantity: 395, unitPrice: 8400, isCurrent: false },
  { id: 'CMP-003', name: 'Community Hall — Lonavala', location: 'Pune, MH', quantity: 420, unitPrice: 7900, isCurrent: false },
  { id: 'CMP-004', name: 'Community Hall — Khadki', location: 'Pune, MH', quantity: 380, unitPrice: 8600, isCurrent: false },
  { id: 'CMP-005', name: 'Community Hall — Chakan', location: 'Pune, MH', quantity: 435, unitPrice: 8200, isCurrent: false },
  { id: 'MPLADS-1024', name: 'Community Hall — Current Project', location: 'Pune, MH', quantity: 410, unitPrice: 12000, isCurrent: true },
];

export const demoStateRisk: StateRiskData[] = [
  { state: 'Maharashtra', projects: 1024, contracts: 412, highPriority: 18, riskIndex: 64, region: 'west' },
  { state: 'Uttar Pradesh', projects: 1348, contracts: 521, highPriority: 22, riskIndex: 68, region: 'north' },
  { state: 'Tamil Nadu', projects: 872, contracts: 364, highPriority: 11, riskIndex: 52, region: 'south' },
  { state: 'Karnataka', projects: 685, contracts: 298, highPriority: 9, riskIndex: 47, region: 'south' },
  { state: 'Gujarat', projects: 512, contracts: 241, highPriority: 7, riskIndex: 41, region: 'west' },
  { state: 'Rajasthan', projects: 478, contracts: 198, highPriority: 12, riskIndex: 55, region: 'north' },
  { state: 'West Bengal', projects: 634, contracts: 267, highPriority: 14, riskIndex: 58, region: 'east' },
  { state: 'Bihar', projects: 421, contracts: 156, highPriority: 10, riskIndex: 54, region: 'east' },
  { state: 'Andhra Pradesh', projects: 389, contracts: 174, highPriority: 6, riskIndex: 43, region: 'south' },
  { state: 'Telangana', projects: 342, contracts: 148, highPriority: 5, riskIndex: 39, region: 'south' },
  { state: 'Madhya Pradesh', projects: 467, contracts: 189, highPriority: 8, riskIndex: 48, region: 'central' },
  { state: 'Kerala', projects: 298, contracts: 132, highPriority: 4, riskIndex: 36, region: 'south' },
  { state: 'Odisha', projects: 356, contracts: 145, highPriority: 7, riskIndex: 45, region: 'east' },
  { state: 'Punjab', projects: 234, contracts: 98, highPriority: 4, riskIndex: 38, region: 'north' },
  { state: 'Haryana', projects: 198, contracts: 84, highPriority: 3, riskIndex: 35, region: 'north' },
  { state: 'Assam', projects: 167, contracts: 62, highPriority: 3, riskIndex: 37, region: 'northeast' },
  { state: 'Jharkhand', projects: 189, contracts: 71, highPriority: 5, riskIndex: 44, region: 'east' },
  { state: 'Chhattisgarh', projects: 212, contracts: 88, highPriority: 4, riskIndex: 40, region: 'central' },
  { state: 'Delhi', projects: 156, contracts: 72, highPriority: 2, riskIndex: 33, region: 'north' },
  { state: 'Goa', projects: 78, contracts: 31, highPriority: 1, riskIndex: 28, region: 'west' },
];

export const demoNotifications: Notification[] = [
  { id: 'N-001', title: 'High priority case identified', time: '9:42 AM', type: 'risk', read: false, link: '/investigations/AR-2026-001024' },
  { id: 'N-002', title: 'Contractor profile updated', time: '9:21 AM', type: 'contractor', read: false, link: '/contractors/CTR-001' },
  { id: 'N-003', title: 'New procurement records available', time: '8:54 AM', type: 'update', read: false, link: '/data-sources' },
  { id: 'N-004', title: 'Document discrepancy detected', time: '8:31 AM', type: 'document', read: true, link: '/investigations/AR-2026-001024' },
];

export const demoReports: ReportTemplate[] = [
  { id: 'RPT-001', title: 'Risk Summary Report', description: 'Aggregate risk distribution and priority cases across monitored records', date: '2026-09-01', status: 'ready', category: 'Risk' },
  { id: 'RPT-002', title: 'Tender Analytics Report', description: 'Tender participation, bid patterns and award analysis', date: '2026-08-28', status: 'ready', category: 'Tender' },
  { id: 'RPT-003', title: 'Contractor Risk Report', description: 'Contractor performance, delay rates and risk distribution', date: '2026-08-25', status: 'ready', category: 'Contractor' },
  { id: 'RPT-004', title: 'Price Anomaly Report', description: 'Projects with significant price deviations from benchmarks', date: '2026-08-20', status: 'ready', category: 'Price' },
  { id: 'RPT-005', title: 'Execution Variance Report', description: 'Financial vs physical progress gaps and timeline anomalies', date: '2026-08-15', status: 'generating', category: 'Execution' },
  { id: 'RPT-006', title: 'Investigation Summary', description: 'Status of open, under-review, escalated and resolved cases', date: '2026-09-02', status: 'ready', category: 'Investigation' },
];

// ============================================================
// EXPANDED MOCK DATA — Additional projects, contractors, cases
// ============================================================

export const mockProjects: Project[] = [
  demoProject,
  {
    id: 'MPLADS-1025', name: 'Road Construction — Ward 12', state: 'Uttar Pradesh', constituency: 'Lucknow',
    projectType: 'Infrastructure', estimatedCost: 3500000, sanctionedAmount: 3600000, tenderValue: 3500000, awardValue: 3380000,
    expenditure: 2100000, physicalProgress: 55, status: 'active', riskScore: 74, riskLevel: 'review',
    lastUpdated: '2026-09-01', recommendedDate: '2026-02-01', sanctionedDate: '2026-02-10', tenderPublishedDate: '2026-02-15',
    biddingClosedDate: '2026-02-22', contractAwardedDate: '2026-02-25', executionStartDate: '2026-03-10',
    expectedCompletionDate: '2026-11-30', tenderId: 'T-9282', contractId: 'C-9282', contractorId: 'CTR-006',
    mpName: 'Hon. Asha Verma', mpConstituency: 'Lucknow', fiscalYear: '2025-26',
    description: 'Construction of 2.5 km internal road in Ward 12 with drainage.',
  },
  {
    id: 'MPLADS-1026', name: 'School Building Construction', state: 'Tamil Nadu', constituency: 'Chennai South',
    projectType: 'Public Building', estimatedCost: 6500000, sanctionedAmount: 6700000, tenderValue: 6500000, awardValue: 6320000,
    expenditure: 6320000, physicalProgress: 100, status: 'completed', riskScore: 28, riskLevel: 'normal',
    lastUpdated: '2026-08-20', recommendedDate: '2025-06-01', sanctionedDate: '2025-06-10', tenderPublishedDate: '2025-06-15',
    biddingClosedDate: '2025-06-25', contractAwardedDate: '2025-06-28', executionStartDate: '2025-07-15',
    expectedCompletionDate: '2026-03-15', tenderId: 'T-9283', contractId: 'C-9283', contractorId: 'CTR-007',
    mpName: 'Hon. K. Ramesh', mpConstituency: 'Chennai South', fiscalYear: '2025-26',
    description: 'Construction of 8-classroom school building with amenities.',
  },
  {
    id: 'MPLADS-1027', name: 'Drainage System Upgrade', state: 'Karnataka', constituency: 'Bengaluru North',
    projectType: 'Civil Works', estimatedCost: 2800000, sanctionedAmount: 2900000, tenderValue: 2800000, awardValue: 2710000,
    expenditure: 1450000, physicalProgress: 42, status: 'delayed', riskScore: 61, riskLevel: 'review',
    lastUpdated: '2026-08-28', recommendedDate: '2026-01-10', sanctionedDate: '2026-01-18', tenderPublishedDate: '2026-01-25',
    biddingClosedDate: '2026-02-01', contractAwardedDate: '2026-02-05', executionStartDate: '2026-02-20',
    expectedCompletionDate: '2026-07-30', tenderId: 'T-9284', contractId: 'C-9284', contractorId: 'CTR-008',
    mpName: 'Hon. S. Gowda', mpConstituency: 'Bengaluru North', fiscalYear: '2025-26',
    description: 'Upgrade of stormwater drainage system covering 3 wards.',
  },
  {
    id: 'MPLADS-1028', name: 'Primary Health Centre', state: 'Rajasthan', constituency: 'Jaipur Rural',
    projectType: 'Public Building', estimatedCost: 4500000, sanctionedAmount: 4700000, tenderValue: 4500000, awardValue: 4380000,
    expenditure: 3200000, physicalProgress: 72, status: 'active', riskScore: 45, riskLevel: 'watch',
    lastUpdated: '2026-08-30', recommendedDate: '2026-03-01', sanctionedDate: '2026-03-10', tenderPublishedDate: '2026-03-15',
    biddingClosedDate: '2026-03-22', contractAwardedDate: '2026-03-25', executionStartDate: '2026-04-10',
    expectedCompletionDate: '2026-12-15', tenderId: 'T-9285', contractId: 'C-9285', contractorId: 'CTR-009',
    mpName: 'Hon. M. Singh', mpConstituency: 'Jaipur Rural', fiscalYear: '2025-26',
    description: 'Construction of Primary Health Centre with medical equipment installation.',
  },
  {
    id: 'MPLADS-1029', name: 'Street Lighting Installation', state: 'Gujarat', constituency: 'Surat',
    projectType: 'Electrical', estimatedCost: 1800000, sanctionedAmount: 1900000, tenderValue: 1800000, awardValue: 1720000,
    expenditure: 1720000, physicalProgress: 100, status: 'completed', riskScore: 15, riskLevel: 'normal',
    lastUpdated: '2026-07-15', recommendedDate: '2025-10-01', sanctionedDate: '2025-10-10', tenderPublishedDate: '2025-10-15',
    biddingClosedDate: '2025-10-25', contractAwardedDate: '2025-10-28', executionStartDate: '2025-11-10',
    expectedCompletionDate: '2026-02-28', tenderId: 'T-9286', contractId: 'C-9286', contractorId: 'CTR-010',
    mpName: 'Hon. P. Patel', mpConstituency: 'Surat', fiscalYear: '2025-26',
    description: 'Installation of 450 LED street lights across 6 wards.',
  },
  {
    id: 'MPLADS-1030', name: 'Water Supply Pipeline', state: 'West Bengal', constituency: 'Kolkata North',
    projectType: 'Civil Works', estimatedCost: 5200000, sanctionedAmount: 5400000, tenderValue: 5200000, awardValue: 5080000,
    expenditure: 3800000, physicalProgress: 65, status: 'active', riskScore: 55, riskLevel: 'watch',
    lastUpdated: '2026-08-25', recommendedDate: '2026-02-01', sanctionedDate: '2026-02-10', tenderPublishedDate: '2026-02-18',
    biddingClosedDate: '2026-02-28', contractAwardedDate: '2026-03-02', executionStartDate: '2026-03-20',
    expectedCompletionDate: '2026-11-30', tenderId: 'T-9287', contractId: 'C-9287', contractorId: 'CTR-011',
    mpName: 'Hon. A. Banerjee', mpConstituency: 'Kolkata North', fiscalYear: '2025-26',
    description: 'Laying of 8 km water supply pipeline with pumping station.',
  },
  {
    id: 'MPLADS-1031', name: 'Anganwadi Center Construction', state: 'Bihar', constituency: 'Patna',
    projectType: 'Public Building', estimatedCost: 1200000, sanctionedAmount: 1300000, tenderValue: 1200000, awardValue: 1180000,
    expenditure: 950000, physicalProgress: 80, status: 'active', riskScore: 38, riskLevel: 'normal',
    lastUpdated: '2026-08-22', recommendedDate: '2026-04-01', sanctionedDate: '2026-04-10', tenderPublishedDate: '2026-04-15',
    biddingClosedDate: '2026-04-25', contractAwardedDate: '2026-04-28', executionStartDate: '2026-05-15',
    expectedCompletionDate: '2026-10-15', tenderId: 'T-9288', contractId: 'C-9288', contractorId: 'CTR-012',
    mpName: 'Hon. R. Prasad', mpConstituency: 'Patna', fiscalYear: '2025-26',
    description: 'Construction of Anganwadi center with child-friendly facilities.',
  },
  {
    id: 'MPLADS-1032', name: 'Bus Shelter Construction', state: 'Andhra Pradesh', constituency: 'Visakhapatnam',
    projectType: 'Infrastructure', estimatedCost: 900000, sanctionedAmount: 950000, tenderValue: 900000, awardValue: 870000,
    expenditure: 870000, physicalProgress: 100, status: 'completed', riskScore: 12, riskLevel: 'normal',
    lastUpdated: '2026-06-30', recommendedDate: '2025-11-01', sanctionedDate: '2025-11-10', tenderPublishedDate: '2025-11-15',
    biddingClosedDate: '2025-11-25', contractAwardedDate: '2025-11-28', executionStartDate: '2025-12-10',
    expectedCompletionDate: '2026-04-30', tenderId: 'T-9289', contractId: 'C-9289', contractorId: 'CTR-013',
    mpName: 'Hon. V. Reddy', mpConstituency: 'Visakhapatnam', fiscalYear: '2025-26',
    description: 'Construction of 12 modern bus shelters across the constituency.',
  },
  {
    id: 'MPLADS-1033', name: 'Community Toilet Block', state: 'Madhya Pradesh', constituency: 'Indore',
    projectType: 'Public Building', estimatedCost: 750000, sanctionedAmount: 800000, tenderValue: 750000, awardValue: 725000,
    expenditure: 580000, physicalProgress: 78, status: 'active', riskScore: 22, riskLevel: 'normal',
    lastUpdated: '2026-08-18', recommendedDate: '2026-03-15', sanctionedDate: '2026-03-25', tenderPublishedDate: '2026-04-01',
    biddingClosedDate: '2026-04-10', contractAwardedDate: '2026-04-13', executionStartDate: '2026-05-01',
    expectedCompletionDate: '2026-09-30', tenderId: 'T-9290', contractId: 'C-9290', contractorId: 'CTR-014',
    mpName: 'Hon. N. Chauhan', mpConstituency: 'Indore', fiscalYear: '2025-26',
    description: 'Construction of community toilet complex with 12 units.',
  },
  {
    id: 'MPLADS-1034', name: 'Park Development', state: 'Telangana', constituency: 'Hyderabad',
    projectType: 'Civil Works', estimatedCost: 3200000, sanctionedAmount: 3300000, tenderValue: 3200000, awardValue: 3080000,
    expenditure: 2400000, physicalProgress: 75, status: 'active', riskScore: 35, riskLevel: 'normal',
    lastUpdated: '2026-08-27', recommendedDate: '2026-02-10', sanctionedDate: '2026-02-20', tenderPublishedDate: '2026-02-27',
    biddingClosedDate: '2026-03-07', contractAwardedDate: '2026-03-10', executionStartDate: '2026-03-25',
    expectedCompletionDate: '2026-10-25', tenderId: 'T-9291', contractId: 'C-9291', contractorId: 'CTR-015',
    mpName: 'Hon. L. Rao', mpConstituency: 'Hyderabad', fiscalYear: '2025-26',
    description: 'Development of 2-acre urban park with landscaping and walking tracks.',
  },
];

export const mockContractors: Contractor[] = [
  demoContractor,
  {
    id: 'CTR-002', name: 'XYZ Contractors', previousContracts: 28, completed: 21, delayed: 5, cancelled: 2,
    averageValue: 3200000, riskScore: 52, riskLevel: 'watch', registrationDate: '2019-07-20',
    registrationNumber: 'UP-PWD-2019-02231', categories: ['Civil Works', 'Road Construction'], states: ['Uttar Pradesh', 'Madhya Pradesh'],
    totalValueAwarded: 89600000, delayRate: 17.9, peerDelayRate: 9.4,
  },
  {
    id: 'CTR-003', name: 'PQR Works Ltd', previousContracts: 35, completed: 27, delayed: 6, cancelled: 2,
    averageValue: 4100000, riskScore: 48, riskLevel: 'watch', registrationDate: '2017-02-14',
    registrationNumber: 'TN-PWD-2017-01182', categories: ['Public Buildings', 'Civil Works'], states: ['Tamil Nadu', 'Karnataka'],
    totalValueAwarded: 143500000, delayRate: 17.1, peerDelayRate: 9.4,
  },
  {
    id: 'CTR-004', name: 'DEF Projects', previousContracts: 19, completed: 15, delayed: 3, cancelled: 1,
    averageValue: 2800000, riskScore: 38, riskLevel: 'normal', registrationDate: '2020-01-10',
    registrationNumber: 'KA-PWD-2020-00931', categories: ['Infrastructure', 'Electrical'], states: ['Karnataka'],
    totalValueAwarded: 53200000, delayRate: 15.8, peerDelayRate: 9.4,
  },
  {
    id: 'CTR-005', name: 'MNO Infra Solutions', previousContracts: 11, completed: 9, delayed: 1, cancelled: 1,
    averageValue: 2100000, riskScore: 25, riskLevel: 'normal', registrationDate: '2021-06-05',
    registrationNumber: 'MH-PWD-2021-00571', categories: ['Infrastructure'], states: ['Maharashtra'],
    totalValueAwarded: 23100000, delayRate: 9.1, peerDelayRate: 9.4,
  },
  {
    id: 'CTR-006', name: 'Shree Ram Construction', previousContracts: 31, completed: 22, delayed: 7, cancelled: 2,
    averageValue: 3500000, riskScore: 58, riskLevel: 'watch', registrationDate: '2016-11-12',
    registrationNumber: 'UP-PWD-2016-03491', categories: ['Road Construction', 'Civil Works'], states: ['Uttar Pradesh', 'Bihar'],
    totalValueAwarded: 108500000, delayRate: 22.6, peerDelayRate: 9.4,
  },
  {
    id: 'CTR-007', name: 'Chennai Build Corp', previousContracts: 24, completed: 22, delayed: 1, cancelled: 1,
    averageValue: 5200000, riskScore: 18, riskLevel: 'normal', registrationDate: '2018-09-18',
    registrationNumber: 'TN-PWD-2018-02941', categories: ['Public Buildings'], states: ['Tamil Nadu'],
    totalValueAwarded: 124800000, delayRate: 4.2, peerDelayRate: 9.4,
  },
  {
    id: 'CTR-008', name: 'Bengaluru Infra Ltd', previousContracts: 16, completed: 11, delayed: 4, cancelled: 1,
    averageValue: 2900000, riskScore: 44, riskLevel: 'watch', registrationDate: '2019-03-22',
    registrationNumber: 'KA-PWD-2019-01821', categories: ['Civil Works', 'Drainage'], states: ['Karnataka'],
    totalValueAwarded: 46400000, delayRate: 25.0, peerDelayRate: 9.4,
  },
  {
    id: 'CTR-009', name: 'Jaipur Builders Pvt Ltd', previousContracts: 20, completed: 16, delayed: 3, cancelled: 1,
    averageValue: 3800000, riskScore: 32, riskLevel: 'normal', registrationDate: '2018-06-15',
    registrationNumber: 'RJ-PWD-2018-02211', categories: ['Public Buildings', 'Health'], states: ['Rajasthan'],
    totalValueAwarded: 76000000, delayRate: 15.0, peerDelayRate: 9.4,
  },
  {
    id: 'CTR-010', name: 'Surat Electrical Works', previousContracts: 14, completed: 14, delayed: 0, cancelled: 0,
    averageValue: 1900000, riskScore: 10, riskLevel: 'normal', registrationDate: '2020-04-10',
    registrationNumber: 'GJ-PWD-2020-00712', categories: ['Electrical'], states: ['Gujarat'],
    totalValueAwarded: 26600000, delayRate: 0, peerDelayRate: 9.4,
  },
  {
    id: 'CTR-011', name: 'Kolkata Civil Works', previousContracts: 26, completed: 19, delayed: 5, cancelled: 2,
    averageValue: 4400000, riskScore: 50, riskLevel: 'watch', registrationDate: '2017-08-30',
    registrationNumber: 'WB-PWD-2017-02851', categories: ['Civil Works', 'Water Supply'], states: ['West Bengal'],
    totalValueAwarded: 114400000, delayRate: 19.2, peerDelayRate: 9.4,
  },
];

export const mockTenders: Tender[] = [
  demoTender,
  {
    id: 'T-9282', projectId: 'MPLADS-1025', projectName: 'Road Construction — Ward 12', state: 'Uttar Pradesh',
    tenderValue: 3500000, tenderStatus: 'awarded', closingDate: '2026-02-22', publishedDate: '2026-02-15',
    bidderCount: 7, bidders: [], winnerId: 'CTR-006', winnerName: 'Shree Ram Construction', winningBid: 3380000,
    bidSpread: 3.8, historicalMedianSpread: 7.2, riskScore: 74, riskLevel: 'review', projectType: 'Infrastructure', awardDate: '2026-02-25', contractId: 'C-9282',
  },
  {
    id: 'T-9283', projectId: 'MPLADS-1026', projectName: 'School Building Construction', state: 'Tamil Nadu',
    tenderValue: 6500000, tenderStatus: 'awarded', closingDate: '2025-06-25', publishedDate: '2025-06-15',
    bidderCount: 8, bidders: [], winnerId: 'CTR-007', winnerName: 'Chennai Build Corp', winningBid: 6320000,
    bidSpread: 5.6, historicalMedianSpread: 6.5, riskScore: 28, riskLevel: 'normal', projectType: 'Public Building', awardDate: '2025-06-28', contractId: 'C-9283',
  },
  {
    id: 'T-9284', projectId: 'MPLADS-1027', projectName: 'Drainage System Upgrade', state: 'Karnataka',
    tenderValue: 2800000, tenderStatus: 'awarded', closingDate: '2026-02-01', publishedDate: '2026-01-25',
    bidderCount: 4, bidders: [], winnerId: 'CTR-008', winnerName: 'Bengaluru Infra Ltd', winningBid: 2710000,
    bidSpread: 4.2, historicalMedianSpread: 7.0, riskScore: 61, riskLevel: 'review', projectType: 'Civil Works', awardDate: '2026-02-05', contractId: 'C-9284',
  },
  {
    id: 'T-9285', projectId: 'MPLADS-1028', projectName: 'Primary Health Centre', state: 'Rajasthan',
    tenderValue: 4500000, tenderStatus: 'awarded', closingDate: '2026-03-22', publishedDate: '2026-03-15',
    bidderCount: 6, bidders: [], winnerId: 'CTR-009', winnerName: 'Jaipur Builders Pvt Ltd', winningBid: 4380000,
    bidSpread: 5.1, historicalMedianSpread: 6.8, riskScore: 45, riskLevel: 'watch', projectType: 'Public Building', awardDate: '2026-03-25', contractId: 'C-9285',
  },
  {
    id: 'T-9286', projectId: 'MPLADS-1029', projectName: 'Street Lighting Installation', state: 'Gujarat',
    tenderValue: 1800000, tenderStatus: 'awarded', closingDate: '2025-10-25', publishedDate: '2025-10-15',
    bidderCount: 5, bidders: [], winnerId: 'CTR-010', winnerName: 'Surat Electrical Works', winningBid: 1720000,
    bidSpread: 6.2, historicalMedianSpread: 7.5, riskScore: 15, riskLevel: 'normal', projectType: 'Electrical', awardDate: '2025-10-28', contractId: 'C-9286',
  },
  {
    id: 'T-9287', projectId: 'MPLADS-1030', projectName: 'Water Supply Pipeline', state: 'West Bengal',
    tenderValue: 5200000, tenderStatus: 'awarded', closingDate: '2026-02-28', publishedDate: '2026-02-18',
    bidderCount: 6, bidders: [], winnerId: 'CTR-011', winnerName: 'Kolkata Civil Works', winningBid: 5080000,
    bidSpread: 3.5, historicalMedianSpread: 6.9, riskScore: 55, riskLevel: 'watch', projectType: 'Civil Works', awardDate: '2026-03-02', contractId: 'C-9287',
  },
  {
    id: 'T-9288', projectId: 'MPLADS-1031', projectName: 'Anganwadi Center Construction', state: 'Bihar',
    tenderValue: 1200000, tenderStatus: 'awarded', closingDate: '2026-04-25', publishedDate: '2026-04-15',
    bidderCount: 9, bidders: [], winnerId: 'CTR-012', winnerName: 'Patna Builders', winningBid: 1180000,
    bidSpread: 7.8, historicalMedianSpread: 7.0, riskScore: 38, riskLevel: 'normal', projectType: 'Public Building', awardDate: '2026-04-28', contractId: 'C-9288',
  },
];

export const mockContracts: Contract[] = [
  demoContract,
  {
    id: 'C-9282', projectId: 'MPLADS-1025', projectName: 'Road Construction — Ward 12', tenderId: 'T-9282',
    contractorId: 'CTR-006', contractorName: 'Shree Ram Construction', awardValue: 3380000, awardDate: '2026-02-25',
    startDate: '2026-03-10', expectedCompletionDate: '2026-11-30', currentProgress: 55, expenditure: 2100000,
    status: 'active', riskScore: 74, riskLevel: 'review', state: 'Uttar Pradesh',
  },
  {
    id: 'C-9283', projectId: 'MPLADS-1026', projectName: 'School Building Construction', tenderId: 'T-9283',
    contractorId: 'CTR-007', contractorName: 'Chennai Build Corp', awardValue: 6320000, awardDate: '2025-06-28',
    startDate: '2025-07-15', expectedCompletionDate: '2026-03-15', currentProgress: 100, expenditure: 6320000,
    status: 'completed', riskScore: 28, riskLevel: 'normal', state: 'Tamil Nadu',
  },
  {
    id: 'C-9284', projectId: 'MPLADS-1027', projectName: 'Drainage System Upgrade', tenderId: 'T-9284',
    contractorId: 'CTR-008', contractorName: 'Bengaluru Infra Ltd', awardValue: 2710000, awardDate: '2026-02-05',
    startDate: '2026-02-20', expectedCompletionDate: '2026-07-30', currentProgress: 42, expenditure: 1450000,
    status: 'delayed', riskScore: 61, riskLevel: 'review', state: 'Karnataka',
  },
  {
    id: 'C-9285', projectId: 'MPLADS-1028', projectName: 'Primary Health Centre', tenderId: 'T-9285',
    contractorId: 'CTR-009', contractorName: 'Jaipur Builders Pvt Ltd', awardValue: 4380000, awardDate: '2026-03-25',
    startDate: '2026-04-10', expectedCompletionDate: '2026-12-15', currentProgress: 72, expenditure: 3200000,
    status: 'active', riskScore: 45, riskLevel: 'watch', state: 'Rajasthan',
  },
  {
    id: 'C-9286', projectId: 'MPLADS-1029', projectName: 'Street Lighting Installation', tenderId: 'T-9286',
    contractorId: 'CTR-010', contractorName: 'Surat Electrical Works', awardValue: 1720000, awardDate: '2025-10-28',
    startDate: '2025-11-10', expectedCompletionDate: '2026-02-28', currentProgress: 100, expenditure: 1720000,
    status: 'completed', riskScore: 15, riskLevel: 'normal', state: 'Gujarat',
  },
  {
    id: 'C-9287', projectId: 'MPLADS-1030', projectName: 'Water Supply Pipeline', tenderId: 'T-9287',
    contractorId: 'CTR-011', contractorName: 'Kolkata Civil Works', awardValue: 5080000, awardDate: '2026-03-02',
    startDate: '2026-03-20', expectedCompletionDate: '2026-11-30', currentProgress: 65, expenditure: 3800000,
    status: 'active', riskScore: 55, riskLevel: 'watch', state: 'West Bengal',
  },
  {
    id: 'C-9288', projectId: 'MPLADS-1031', projectName: 'Anganwadi Center Construction', tenderId: 'T-9288',
    contractorId: 'CTR-012', contractorName: 'Patna Builders', awardValue: 1180000, awardDate: '2026-04-28',
    startDate: '2026-05-15', expectedCompletionDate: '2026-10-15', currentProgress: 80, expenditure: 950000,
    status: 'active', riskScore: 38, riskLevel: 'normal', state: 'Bihar',
  },
];

export const mockInvestigationCases: InvestigationCase[] = [
  demoInvestigationCase,
  {
    id: 'AR-2026-001025', projectId: 'MPLADS-1025', projectName: 'Road Construction — Ward 12', contractId: 'C-9282',
    tenderId: 'T-9282', contractorId: 'CTR-006', contractorName: 'Shree Ram Construction', state: 'Uttar Pradesh',
    riskScore: 74, riskLevel: 'review', primarySignal: 'contractor-history', secondarySignals: ['bid-pattern', 'timeline-anomaly'],
    status: 'under-review', detectedDate: '2026-08-20', assignedReviewer: 'R. Sharma', evidenceCount: 8,
    caseValue: 3380000, lastUpdated: '2026-08-30',
  },
  {
    id: 'AR-2026-001026', projectId: 'MPLADS-1027', projectName: 'Drainage System Upgrade', contractId: 'C-9284',
    tenderId: 'T-9284', contractorId: 'CTR-008', contractorName: 'Bengaluru Infra Ltd', state: 'Karnataka',
    riskScore: 61, riskLevel: 'review', primarySignal: 'execution-variance', secondarySignals: ['timeline-anomaly'],
    status: 'open', detectedDate: '2026-08-18', assignedReviewer: 'Unassigned', evidenceCount: 5,
    caseValue: 2710000, lastUpdated: '2026-08-28',
  },
  {
    id: 'AR-2026-001027', projectId: 'MPLADS-1030', projectName: 'Water Supply Pipeline', contractId: 'C-9287',
    tenderId: 'T-9287', contractorId: 'CTR-011', contractorName: 'Kolkata Civil Works', state: 'West Bengal',
    riskScore: 55, riskLevel: 'watch', primarySignal: 'payment-anomaly', secondarySignals: ['execution-variance'],
    status: 'open', detectedDate: '2026-08-22', assignedReviewer: 'Unassigned', evidenceCount: 4,
    caseValue: 5080000, lastUpdated: '2026-08-25',
  },
  {
    id: 'AR-2026-001028', projectId: 'MPLADS-1025', projectName: 'Road Construction — Ward 12', contractId: 'C-9282',
    tenderId: 'T-9282', contractorId: 'CTR-006', contractorName: 'Shree Ram Construction', state: 'Uttar Pradesh',
    riskScore: 68, riskLevel: 'review', primarySignal: 'price-anomaly', secondarySignals: ['contractor-history'],
    status: 'escalated', detectedDate: '2026-07-15', assignedReviewer: 'M. Iyer', evidenceCount: 10,
    caseValue: 3380000, lastUpdated: '2026-08-20',
  },
  {
    id: 'AR-2026-001029', projectId: 'MPLADS-1026', projectName: 'School Building Construction', contractId: 'C-9283',
    tenderId: 'T-9283', contractorId: 'CTR-007', contractorName: 'Chennai Build Corp', state: 'Tamil Nadu',
    riskScore: 28, riskLevel: 'normal', primarySignal: 'document-discrepancy', secondarySignals: [],
    status: 'resolved', detectedDate: '2026-05-10', assignedReviewer: 'K. Nair', evidenceCount: 3,
    caseValue: 6320000, lastUpdated: '2026-07-20',
  },
  {
    id: 'AR-2026-001030', projectId: 'MPLADS-1028', projectName: 'Primary Health Centre', contractId: 'C-9285',
    tenderId: 'T-9285', contractorId: 'CTR-009', contractorName: 'Jaipur Builders Pvt Ltd', state: 'Rajasthan',
    riskScore: 45, riskLevel: 'watch', primarySignal: 'timeline-anomaly', secondarySignals: ['execution-variance'],
    status: 'under-review', detectedDate: '2026-08-05', assignedReviewer: 'S. Jain', evidenceCount: 4,
    caseValue: 4380000, lastUpdated: '2026-08-22',
  },
];

// ============================================================
// AI INVESTIGATOR — Mock Responses
// ============================================================

export const aiQuickQuestions: string[] = [
  'Why was this contract flagged?',
  'Why is the risk score 82?',
  'What evidence supports the price anomaly?',
  'Compare this contractor to peers.',
  'What are the strongest risk signals?',
  'What should an investigator verify first?',
  'Explain the bid pattern anomaly.',
  'Is this proof of fraud?',
];

export const aiMockResponses: Record<string, AIMessage> = {
  'Why was this contract flagged?': {
    id: 'AI-001', role: 'assistant', timestamp: '',
    content: 'Based on the available project and procurement records, Aarambha identified three primary review signals.',
    structured: {
      answer: 'Based on the available project and procurement records, Aarambha identified three primary review signals.',
      signals: [
        { label: '01 — Price Anomaly', description: 'Current unit price is approximately 45.5% above the peer benchmark.' },
        { label: '02 — Contractor History', description: 'The contractor shows a higher historical delay rate than the selected comparison group.' },
        { label: '03 — Bid Pattern', description: 'The tender shows a narrower bid spread than the historical comparison set.' },
      ],
      evidence: ['Price records', 'Bid records', 'Contractor history'],
      recommendation: 'Review the BOQ, bid evaluation record, contractor eligibility documentation and comparable project specifications.',
      disclaimer: 'Risk indicators are analytical signals intended for review and do not independently establish fraud, corruption or criminal liability.',
    },
  },
  'Why is the risk score 82?': {
    id: 'AI-002', role: 'assistant', timestamp: '',
    content: 'The risk score of 82 is a composite of five weighted anomaly signals.',
    structured: {
      answer: 'The risk score of 82 is a composite of five weighted anomaly signals.',
      signals: [
        { label: 'Price Anomaly (92)', description: 'Unit price 45.5% above benchmark — highest contributing factor.' },
        { label: 'Bid Pattern (81)', description: 'Bid spread 64.7% below historical median.' },
        { label: 'Contractor History (76)', description: 'Delay rate 23.8% vs 9.4% peer average.' },
        { label: 'Execution Variance (54)', description: 'Financial utilization ahead of physical progress.' },
        { label: 'Document Consistency (32)', description: 'Minor value inconsistency in agreement document.' },
      ],
      evidence: ['Risk scoring engine', 'Comparable project records', 'Bid records', 'Contractor history', 'Execution & financial records'],
      recommendation: 'The score is dominated by price and bid anomalies. Focus initial verification on BOQ specifications and bid evaluation.',
      disclaimer: 'Risk scores are composite indicators for prioritization and do not establish wrongdoing.',
    },
  },
  'What evidence supports the price anomaly?': {
    id: 'AI-003', role: 'assistant', timestamp: '',
    content: 'The price anomaly is supported by comparison against five comparable community hall projects in the same region.',
    structured: {
      answer: 'The price anomaly is supported by comparison against five comparable community hall projects in the same region.',
      signals: [
        { label: 'Current Unit Price', description: '₹12,000 per unit — 45.5% above the peer benchmark of ₹8,250.' },
        { label: 'Comparison Set', description: '5 comparable projects in Pune region with unit prices ranging ₹7,900–₹8,600.' },
        { label: 'Confidence', description: 'High — multiple comparable projects with similar specifications.' },
      ],
      evidence: ['Comparable project records', 'BOQ document', 'Tender records'],
      recommendation: 'Review BOQ specifications, quantities, location-specific costs and market conditions to explain the deviation.',
      disclaimer: 'Price deviations may have legitimate explanations. This signal indicates a need for verification, not a conclusion.',
    },
  },
  'Compare this contractor to peers.': {
    id: 'AI-004', role: 'assistant', timestamp: '',
    content: 'ABC Infrastructure Pvt Ltd shows a significantly higher delay rate than comparable contractors.',
    structured: {
      answer: 'ABC Infrastructure Pvt Ltd shows a significantly higher delay rate than comparable contractors.',
      signals: [
        { label: 'Delay Rate', description: '23.8% vs 9.4% peer average — approximately 2.5x higher.' },
        { label: 'Contract Volume', description: '42 previous contracts — above median, indicating high activity.' },
        { label: 'Cancellation Rate', description: '3 out of 42 (7.1%) — slightly above peer average.' },
        { label: 'Geographic Spread', description: 'Active in 3 states — Maharashtra, Gujarat, Karnataka.' },
      ],
      evidence: ['Contractor history', 'Past project records', 'Performance reports'],
      recommendation: 'Review past project completion reports, delay justifications and performance ratings from previous contracts.',
      disclaimer: 'Historical performance signals do not imply misconduct. They indicate patterns that warrant further review.',
    },
  },
  'What are the strongest risk signals?': {
    id: 'AI-005', role: 'assistant', timestamp: '',
    content: 'The three strongest risk signals for this case are:',
    structured: {
      answer: 'The three strongest risk signals for this case are:',
      signals: [
        { label: '1. Price Anomaly (92/100)', description: 'Unit price 45.5% above benchmark — highest confidence.' },
        { label: '2. Bid Pattern (81/100)', description: 'Unusually narrow bid spread of 2.4%.' },
        { label: '3. Contractor History (76/100)', description: 'Delay rate well above peer group.' },
      ],
      evidence: ['All three signals are corroborated by multiple evidence records.'],
      recommendation: 'Prioritize verification of pricing justification, bid evaluation process and contractor performance records.',
      disclaimer: 'Multiple risk signals increase review priority but do not collectively establish wrongdoing.',
    },
  },
  'What should an investigator verify first?': {
    id: 'AI-006', role: 'assistant', timestamp: '',
    content: 'Based on the evidence profile, the following verification steps are recommended in priority order:',
    structured: {
      answer: 'Based on the evidence profile, the following verification steps are recommended in priority order:',
      signals: [
        { label: 'Step 1', description: 'Verify BOQ specification and unit rate justification.' },
        { label: 'Step 2', description: 'Compare local market pricing for similar construction.' },
        { label: 'Step 3', description: 'Review bid evaluation record and bidder eligibility.' },
        { label: 'Step 4', description: 'Review contractor performance records from past contracts.' },
        { label: 'Step 5', description: 'Verify payment and expenditure records against physical progress.' },
      ],
      evidence: ['Price records', 'Bid records', 'Contractor history', 'Financial records'],
      recommendation: 'Start with pricing — it has the highest signal score and confidence level.',
      disclaimer: 'These are analytical recommendations. The investigator\'s judgment determines actual verification priority.',
    },
  },
  'Explain the bid pattern anomaly.': {
    id: 'AI-007', role: 'assistant', timestamp: '',
    content: 'The bid pattern anomaly relates to the spread between the lowest and highest bids in this tender.',
    structured: {
      answer: 'The bid pattern anomaly relates to the spread between the lowest and highest bids in this tender.',
      signals: [
        { label: 'Current Spread', description: '2.4% — difference between lowest (₹49.2L) and highest (₹50.4L) bid.' },
        { label: 'Historical Median', description: '6.8% — typical spread for comparable tenders.' },
        { label: 'Deviation', description: '64.7% narrower than historical comparison group.' },
      ],
      evidence: ['Bid records', 'Historical tender data'],
      recommendation: 'Review tender documentation and bidder history. Bid-pattern anomalies do not establish collusion.',
      disclaimer: 'A narrow bid spread can result from competitive market conditions. This signal indicates a need for review, not a conclusion of collusion.',
    },
  },
  'Is this proof of fraud?': {
    id: 'AI-008', role: 'assistant', timestamp: '',
    content: 'No. Aarambha identifies anomalies and risk signals. It does not establish fraud or criminal liability.',
    structured: {
      answer: 'No. Aarambha identifies anomalies and risk signals. It does not establish fraud or criminal liability.',
      signals: [
        { label: 'What Aarambha does', description: 'Detects statistical anomalies, compares against benchmarks and surfaces evidence for human review.' },
        { label: 'What Aarambha does not do', description: 'It does not make accusations, determine guilt or establish criminal liability.' },
      ],
      evidence: ['All signals are analytical indicators requiring human verification.'],
      recommendation: 'A human investigator must review the evidence, verify findings and make determinations based on complete information.',
      disclaimer: 'Risk indicators are analytical signals intended for review and do not independently establish fraud, corruption or criminal liability.',
    },
  },
};

// ============================================================
// OVERVIEW DASHBOARD MOCK DATA
// ============================================================

export const kpiData = {
  totalProjects: 10245,
  activeProjects: 6482,
  totalTenders: 4821,
  contractsAwarded: 3914,
  procurementValue: '₹1,284 Cr',
  highPriorityReviews: 137,
};

export const riskDistribution = [
  { name: 'Normal', value: 6842, color: '#10b981' },
  { name: 'Watch', value: 2421, color: '#f59e0b' },
  { name: 'Review', value: 845, color: '#f97316' },
  { name: 'High Priority', value: 137, color: '#ef4444' },
];

export const topRiskSignals = [
  { label: 'Price anomaly', percentage: 42, description: 'Unit prices significantly above peer benchmarks' },
  { label: 'Contractor history', percentage: 27, description: 'Elevated delay or cancellation rates' },
  { label: 'Bid pattern', percentage: 18, description: 'Unusual bid spreads or participation' },
  { label: 'Execution variance', percentage: 9, description: 'Financial vs physical progress gaps' },
  { label: 'Document mismatch', percentage: 4, description: 'Inconsistencies across documents' },
];

export const recentActivity = [
  { time: '09:42', text: 'Contract T-9281 moved to High Priority Review', type: 'risk' },
  { time: '09:21', text: 'New tender records ingested', type: 'update' },
  { time: '08:54', text: 'Project MPLADS-1024 received expenditure update', type: 'update' },
  { time: '08:31', text: 'Contractor profile updated', type: 'contractor' },
  { time: '08:15', text: 'Document discrepancy detected on MPLADS-1024', type: 'document' },
  { time: '07:58', text: 'Risk engine completed scheduled assessment', type: 'update' },
];

export const riskTrendData = [
  { month: 'Apr', flagged: 892, highPriority: 108 },
  { month: 'May', flagged: 945, highPriority: 115 },
  { month: 'Jun', flagged: 1018, highPriority: 121 },
  { month: 'Jul', flagged: 1102, highPriority: 129 },
  { month: 'Aug', flagged: 1248, highPriority: 134 },
  { month: 'Sep', flagged: 1382, highPriority: 137 },
];

export const bottomInsights = [
  { label: 'Highest Risk State', value: 'Maharashtra', sub: 'Risk index 64' },
  { label: 'Largest Procurement Category', value: 'Infrastructure', sub: '42% of monitored value' },
  { label: 'Fastest Growing Risk Signal', value: 'Price Anomaly', sub: '+18% over 6 months' },
];

export const methodologyWeights = [
  { label: 'Price anomaly', weight: 25 },
  { label: 'Financial vs physical gap', weight: 25 },
  { label: 'Payment/expenditure anomaly', weight: 20 },
  { label: 'Delay/timeline anomaly', weight: 15 },
  { label: 'Duplicate/similar work', weight: 10 },
  { label: 'Data/reconciliation', weight: 5 },
];

export const methodologyPipeline = [
  { stage: 'DATA', description: 'Ingest procurement records from multiple sources' },
  { stage: 'VALIDATE', description: 'Check data completeness and structural integrity' },
  { stage: 'MATCH', description: 'Link projects to tenders, bids, contracts and contractors' },
  { stage: 'FEATURE ENGINEERING', description: 'Compute derived metrics: spreads, deviations, rates' },
  { stage: 'DETECTION', description: 'Apply anomaly detection across signal categories' },
  { stage: 'RISK SCORING', description: 'Aggregate signals into a composite risk score' },
  { stage: 'EVIDENCE', description: 'Generate evidence-backed findings with source traceability' },
  { stage: 'INVESTIGATION', description: 'Surface cases for human review and verification' },
];

export const dataSourceList = [
  { name: 'Project Data', description: 'MPLADS project records, sanctions and metadata', status: 'Available' as const },
  { name: 'Tender Data', description: 'Tender notices, specifications and timelines', status: 'Available' as const },
  { name: 'Bid Data', description: 'Bidder participation, amounts and outcomes', status: 'Available' as const },
  { name: 'Contractor History', description: 'Past contracts, performance and registration data', status: 'Available' as const },
  { name: 'Financial Data', description: 'Sanctions, expenditure, payments and transactions', status: 'Available' as const },
  { name: 'Execution Data', description: 'Physical progress, milestones and completion records', status: 'Partial' as const },
  { name: 'Documents', description: 'Tender documents, BOQs, agreements and certificates', status: 'Partial' as const },
  { name: 'Geo-spatial Data', description: 'Location and geographic reference data', status: 'Future Integration' as const },
];

export const systemStatusList = [
  { name: 'Data Pipeline', status: 'Operational' as const, detail: 'Last sync: 03 Sep 2026, 06:00 IST' },
  { name: 'Analytics Engine', status: 'Operational' as const, detail: 'Processing rate: 1,240 records/min' },
  { name: 'Risk Engine', status: 'Operational' as const, detail: 'Last assessment cycle: 03 Sep 2026, 06:42 IST' },
  { name: 'AI Investigator', status: 'Demo Mode' as const, detail: 'Frontend simulation — no external API' },
  { name: 'Document Verification', status: 'Operational' as const, detail: '7 document types supported' },
  { name: 'Reporting Service', status: 'Operational' as const, detail: '6 report templates available' },
];

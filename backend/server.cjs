const http = require('http');
const fs = require('fs');
const path = require('path');
const {
  evaluatePriceAnomaly,
  evaluateBidPattern,
  evaluateExecutionVariance,
  evaluateContractorRisk,
  evaluateBenfordLaw,
  evaluatePreDisbursementGate,
  computeCompositeRisk,
} = require('./anomalyDetector.cjs');


const PORT = process.env.PORT || 5000;

// Load official 543 constituencies dataset
let constituencies = [];
try {
  const raw = fs.readFileSync(path.join(__dirname, 'data/constituencies.json'), 'utf8');
  constituencies = JSON.parse(raw);
} catch (err) {
  console.warn('Could not load constituencies.json, fallback array used', err.message);
}

// Sample mock cases and projects for API
const mockProjects = [
  {
    id: 'MPLADS-1024',
    name: 'Construction of Community Hall',
    state: 'Maharashtra',
    constituency: 'Pune',
    projectType: 'Infrastructure',
    sanctionedAmount: 5200000,
    awardValue: 4920000,
    expenditure: 4270000,
    physicalProgress: 68,
    status: 'active',
    riskScore: 82,
    riskLevel: 'high',
  },
  {
    id: 'MPLADS-1025',
    name: 'Installation of Solar Street Lights (Phase 2)',
    state: 'Uttar Pradesh',
    constituency: 'Varanasi',
    projectType: 'Public Lighting',
    sanctionedAmount: 3800000,
    awardValue: 3750000,
    expenditure: 3200000,
    physicalProgress: 85,
    status: 'active',
    riskScore: 68,
    riskLevel: 'review',
  },
];

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // 1. Health check
  if (req.method === 'GET' && (pathname === '/' || pathname === '/api/v1/health')) {
    return sendJson(res, 200, {
      status: 'healthy',
      system: 'AARAMBHA Procurement Intelligence API',
      version: '1.0.0',
      psId: '26102',
      ministry: 'MoSPI (DIID)',
      datasetCount: constituencies.length,
      timestamp: new Date().toISOString(),
    });
  }

  // 2. Overview KPIs & Summary
  if (req.method === 'GET' && pathname === '/api/v1/overview/metrics') {
    const totalAllocated = constituencies.reduce((sum, c) => sum + (c.allocatedAmount || 0), 0);
    const baselineCount = constituencies.filter((c) => c.isBaseline).length;
    const augmentedCount = constituencies.filter((c) => !c.isBaseline).length;

    return sendJson(res, 200, {
      totalConstituencies: constituencies.length,
      grandTotalAllocated: totalAllocated,
      standardBaselineAmount: 147000000,
      baselineConstituencies: baselineCount,
      surplusConstituencies: augmentedCount,
      activeProjectsCount: 1284,
      totalMonitoredTenders: 842,
      contractsAwarded: 764,
      aggregateProcurementValue: '₹8,332.7 Cr',
      highPriorityReviewsCount: 38,
      riskDistribution: [
        { label: 'Normal', count: 986, percentage: 76.8 },
        { label: 'Watch', count: 168, percentage: 13.1 },
        { label: 'Review Recommended', count: 92, percentage: 7.2 },
        { label: 'High Priority Review', count: 38, percentage: 2.9 },
      ],
    });
  }

  // 3. Constituencies (543 MPs)
  if (req.method === 'GET' && pathname === '/api/v1/constituencies') {
    const search = (parsedUrl.searchParams.get('q') || '').toLowerCase();
    const state = parsedUrl.searchParams.get('state') || '';
    const surplusOnly = parsedUrl.searchParams.get('surplus') === 'true';

    let results = constituencies;
    if (search) {
      results = results.filter(
        (c) =>
          c.constituency.toLowerCase().includes(search) ||
          c.mpName.toLowerCase().includes(search) ||
          c.state.toLowerCase().includes(search)
      );
    }
    if (state) {
      results = results.filter((c) => c.state.toLowerCase() === state.toLowerCase());
    }
    if (surplusOnly) {
      results = results.filter((c) => !c.isBaseline);
    }

    return sendJson(res, 200, {
      total: results.length,
      source: 'MoSPI MPLADS DigiGov',
      data: results,
    });
  }

  // 4. Projects list
  if (req.method === 'GET' && pathname === '/api/v1/projects') {
    return sendJson(res, 200, {
      total: mockProjects.length,
      data: mockProjects,
    });
  }

  // 5. ML Anomaly Detection Engine Execution
  if (req.method === 'POST' && pathname === '/api/v1/anomalies/detect') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const {
          unitPrice = 12000,
          benchmarkPrice = 8250,
          bids = [
            { bidder: 'ABC Infra', bidAmount: 4920000 },
            { bidder: 'Shree Sai', bidAmount: 4980000 },
            { bidder: 'Apex Civil', bidAmount: 5010000 },
            { bidder: 'Patel Eng', bidAmount: 5030000 },
            { bidder: 'Kaveri Infra', bidAmount: 5040000 },
          ],
          physicalProgress = 68,
          financialUtilization = 86.8,
          contractorDelayRate = 23.8,
        } = payload;

        const priceSignal = evaluatePriceAnomaly(unitPrice, benchmarkPrice);
        const bidSignal = evaluateBidPattern(bids);
        const executionSignal = evaluateExecutionVariance(physicalProgress, financialUtilization);
        const contractorSignal = evaluateContractorRisk(contractorDelayRate);

        const composite = computeCompositeRisk([
          priceSignal,
          bidSignal,
          executionSignal,
          contractorSignal,
        ]);

        return sendJson(res, 200, {
          success: true,
          evaluatedAt: new Date().toISOString(),
          compositeScore: composite.overallScore,
          riskLevel: composite.riskLevel,
          recommendation: composite.label,
          disclaimer: composite.disclaimer,
          signals: [priceSignal, bidSignal, executionSignal, contractorSignal],
        });
      } catch (e) {
        return sendJson(res, 400, { error: 'Invalid JSON payload', details: e.message });
      }
    });
    return;
  }

  // 6. Automated Document OCR Reconciliation
  if (req.method === 'POST' && pathname === '/api/v1/documents/verify') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const doc = JSON.parse(body && body.trim() ? body : '{}');
        return sendJson(res, 200, {
          success: true,
          documentId: doc.id || 'DOC-UPLOADED',
          status: 'verified-with-anomalies',
          matchedFields: 5,
          mismatchesFound: [
            {
              field: 'Contract Value',
              databaseRecord: '₹49,20,000',
              documentExtracted: '₹82,00,000',
              variance: '+₹32,80,000 (+66.7%)',
              confidenceScore: 0.94,
              actionRequired: 'Manual supervisory review required prior to fund release.',
            },
          ],
        });
      } catch (e) {
        return sendJson(res, 400, { error: 'Invalid document payload' });
      }
    });
    return;
  }

  // 7. Grounded AI Investigator query endpoint
  if (req.method === 'POST' && pathname === '/api/v1/ai/query') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const { question, caseId = 'AR-2026-001024' } = JSON.parse(body);
        const answer = `Based on investigation record ${caseId} for Construction of Community Hall (MPLADS-1024):
1. Unit cost of civil items is ₹12,000/unit (+45.5% vs benchmark ₹8,250).
2. Tender T-9281 shows a bid spread of 2.4% between 5 bidders (historical median is 6.8%).
3. Physical execution stands at 68% while ₹42.7L (86.8%) has been disbursed.
4. Agreement Document AGR-9281 indicates ₹82,00,000 vs sanction of ₹52,00,000.
Recommendation: Conduct physical verification before releasing remaining ₹6.5 Lakhs balance.`;

        return sendJson(res, 200, {
          caseId,
          question,
          answer,
          evidenceCited: ['EVD-001', 'EVD-002', 'EVD-003', 'DOC-004'],
          grounded: true,
        });
      } catch (e) {
        return sendJson(res, 400, { error: 'Invalid query payload' });
      }
    });
    return;
  }

  // 8. Benford's Law Forensic Digit Analysis
  if (req.method === 'GET' && pathname === '/api/v1/forensics/benford') {
    const result = evaluateBenfordLaw();
    return sendJson(res, 200, {
      success: true,
      caseId: 'AR-2026-001024',
      analysisType: "Benford's Law Chi-Square Forensic Test",
      ...result,
    });
  }

  // 9. PFMS "Zero-Leakage" Pre-Disbursement Smart Lock
  if (req.method === 'GET' && pathname === '/api/v1/pfms/smart-lock') {
    const lockData = evaluatePreDisbursementGate({ id: 'AR-2026-001024' });
    return sendJson(res, 200, {
      success: true,
      caseId: 'AR-2026-001024',
      evaluatedAt: new Date().toISOString(),
      ...lockData,
    });
  }

  // 10. GFR 2017 & CVC Statutory Show-Cause Notice Generator
  if (req.method === 'POST' && pathname === '/api/v1/legal/show-cause-notice') {
    return sendJson(res, 200, {
      success: true,
      memoNo: 'CVC/MoSPI/MPLADS/2026/SCN-1024',
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
      recipient: {
        firm: 'M/s ABC Infrastructure Ltd.',
        director: 'Sri Rameshwar Rao (DIN: 08472911)',
        address: 'Plot 42, MIDC Bhosari Industrial Area, Pune - 411026',
      },
      subject: 'SHOW CAUSE NOTICE: Irregularities in Execution of Community Hall Works under MPLADS (Ref: MH-PUN-1024)',
      statutoryClausesCited: [
        'Rule 149 of General Financial Rules (GFR) 2017 — Bypass of Mandatory Procurement Portals',
        'Rule 173 of GFR 2017 — Transparency, Competition, Fairness and Elimination of Arbitrariness',
        'Section 10CA of CPWD Works Manual — Unauthorized Variation Beyond Sanctioned Schedule of Rates',
        'Section 199A of Central Vigilance Commission (CVC) Procurement Manual 2021 — Bid Rotation & Director Collusion',
      ],
      quantifiedLoss: '₹14,20,500 (Fourteen Lakhs Twenty Thousand Five Hundred Rupees)',
      replyWindowDays: 14,
      consequence: 'Debarment/Blacklisting from all Central and State Government Tenders under GFR Rule 151.',
      digitalForensicsHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      officerDesignation: 'Superintending Engineer & Competent Vigilance Authority, District Pune',
    });
  }

  // 11. Cross-Constituency Cartel & Syndicate Network
  if (req.method === 'GET' && pathname === '/api/v1/syndicate/network') {
    return sendJson(res, 200, {
      success: true,
      networkName: 'Western Maharashtra MPLADS Civil Syndicate',
      nodes: [
        { id: 'FIRM-01', label: 'ABC Infra Ltd.', type: 'contractor', winRate: '68%', riskScore: 83 },
        { id: 'FIRM-02', label: 'Kaveri Civil Engg', type: 'contractor', winRate: '72%', riskScore: 78 },
        { id: 'FIRM-03', label: 'Apex Civil Works', type: 'contractor', winRate: '24%', riskScore: 65 },
        { id: 'DIR-01', label: 'Rameshwar Rao (DIN: 08472911)', type: 'director', role: 'Common Board Member' },
        { id: 'CONST-01', label: 'Pune (LS-34)', type: 'constituency', winner: 'ABC Infra' },
        { id: 'CONST-02', label: 'Shirur (LS-35)', type: 'constituency', winner: 'Kaveri Civil' },
        { id: 'CONST-03', label: 'Baramati (LS-36)', type: 'constituency', winner: 'ABC Infra' },
      ],
      links: [
        { source: 'DIR-01', target: 'FIRM-01', relationship: 'Managing Director (40% Equity)' },
        { source: 'DIR-01', target: 'FIRM-02', relationship: 'Designated Partner (35% Equity)' },
        { source: 'FIRM-01', target: 'CONST-01', relationship: 'Awarded ₹4.92 Cr' },
        { source: 'FIRM-02', target: 'CONST-02', relationship: 'Awarded ₹5.18 Cr' },
        { source: 'FIRM-01', target: 'FIRM-02', relationship: 'Rotational Cover Bidding (4 Tenders)' },
        { source: 'FIRM-03', target: 'FIRM-01', relationship: 'Dummy Accommodating Bidder' },
      ],
      collusionConfidence: 0.94,
    });
  }

  // Not found
  return sendJson(res, 404, { error: 'Endpoint not found', path: pathname });
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`AARAMBHA Backend & ML Anomaly Service Running!`);
  console.log(`Port: http://localhost:${PORT}`);
  console.log(`Loaded ${constituencies.length} official MoSPI Lok Sabha records.`);
  console.log(`====================================================`);
});

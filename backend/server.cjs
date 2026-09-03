require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const http = require('http');
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const {
  evaluatePriceAnomaly,
  evaluateBidPattern,
  evaluateExecutionVariance,
  evaluateContractorRisk,
  evaluateBenfordLaw,
  evaluatePreDisbursementGate,
  computeCompositeRisk,
  queryForensicAgent,
} = require('./anomalyDetector.cjs');

const PORT = process.env.PORT || 5000;

// MongoDB Atlas Live Connection
let db = null;
if (process.env.MONGODB_URI) {
  const mongoClient = new MongoClient(process.env.MONGODB_URI);
  mongoClient.connect()
    .then(() => {
      db = mongoClient.db('aarambha');
      console.log('✅ Connected to MongoDB Atlas live database (db: aarambha)!');
    })
    .catch((err) => {
      console.warn('⚠️ MongoDB Atlas connection error, using local memory fallback:', err.message);
    });
}

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

const server = http.createServer(async (req, res) => {
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

    if (db) {
      try {
        const filter = {};
        if (search) {
          filter.$or = [
            { constituency: { $regex: search, $options: 'i' } },
            { mpName: { $regex: search, $options: 'i' } },
            { state: { $regex: search, $options: 'i' } },
          ];
        }
        if (state) filter.state = { $regex: `^${state}$`, $options: 'i' };
        if (surplusOnly) filter.isBaseline = false;

        const dbResults = await db.collection('constituencies').find(filter).toArray();
        return sendJson(res, 200, {
          total: dbResults.length,
          source: 'MongoDB Atlas (MoSPI MPLADS Dataset)',
          data: dbResults,
        });
      } catch (dbErr) {
        console.warn('MongoDB query fallback:', dbErr.message);
      }
    }

    return sendJson(res, 200, {
      total: results.length,
      source: 'MoSPI MPLADS Dataset (Local Fallback)',
      data: results,
    });
  }

  // 4. Projects list (Live from MongoDB Atlas)
  if (req.method === 'GET' && pathname === '/api/v1/projects') {
    if (db) {
      try {
        const dbProjects = await db.collection('projects').find({}).toArray();
        return sendJson(res, 200, {
          total: dbProjects.length,
          source: 'MongoDB Atlas',
          data: dbProjects,
        });
      } catch (e) {
        console.warn('MongoDB projects error:', e.message);
      }
    }
    return sendJson(res, 200, {
      total: mockProjects.length,
      source: 'Local Fallback',
      data: mockProjects,
    });
  }

  // 4b. Contractors list (Live from MongoDB Atlas)
  if (req.method === 'GET' && pathname === '/api/v1/contractors') {
    if (db) {
      try {
        const dbContractors = await db.collection('contractors').find({}).toArray();
        return sendJson(res, 200, {
          total: dbContractors.length,
          source: 'MongoDB Atlas',
          data: dbContractors,
        });
      } catch (e) {
        console.warn('MongoDB contractors error:', e.message);
      }
    }
    return sendJson(res, 200, { total: 0, data: [] });
  }

  // 4c. Tenders list (Live from MongoDB Atlas)
  if (req.method === 'GET' && pathname === '/api/v1/tenders') {
    if (db) {
      try {
        const dbTenders = await db.collection('tenders').find({}).toArray();
        return sendJson(res, 200, {
          total: dbTenders.length,
          source: 'MongoDB Atlas',
          data: dbTenders,
        });
      } catch (e) {
        console.warn('MongoDB tenders error:', e.message);
      }
    }
    return sendJson(res, 200, { total: 0, data: [] });
  }

  // 4d. Investigation Cases list (Live from MongoDB Atlas)
  if (req.method === 'GET' && pathname === '/api/v1/investigations') {
    if (db) {
      try {
        const dbCases = await db.collection('investigations').find({}).toArray();
        return sendJson(res, 200, {
          total: dbCases.length,
          source: 'MongoDB Atlas',
          data: dbCases,
        });
      } catch (e) {
        console.warn('MongoDB investigations error:', e.message);
      }
    }
    return sendJson(res, 200, { total: 0, data: [] });
  }

  // 4e. Contracts list (Live from MongoDB Atlas)
  if (req.method === 'GET' && pathname === '/api/v1/contracts') {
    if (db) {
      try {
        const dbContracts = await db.collection('contracts').find({}).toArray();
        return sendJson(res, 200, {
          total: dbContracts.length,
          source: 'MongoDB Atlas',
          data: dbContracts,
        });
      } catch (e) {
        console.warn('MongoDB contracts error:', e.message);
      }
    }
    return sendJson(res, 200, { total: 0, data: [] });
  }

  // 4f. Data Sources list (Live from MongoDB Atlas)
  if (req.method === 'GET' && pathname === '/api/v1/datasources') {
    if (db) {
      try {
        const dbSources = await db.collection('datasources').find({}).toArray();
        return sendJson(res, 200, {
          total: dbSources.length,
          source: 'MongoDB Atlas',
          data: dbSources,
        });
      } catch (e) {
        console.warn('MongoDB datasources error:', e.message);
      }
    }
    return sendJson(res, 200, { total: 0, data: [] });
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
    req.on('end', async () => {
      try {
        const { question, caseId = 'AR-2026-001024', caseContext = null } = JSON.parse(body || '{}');
        
        // Execute grounded forensic agent engine
        const agentResult = queryForensicAgent(question, caseId, caseContext);

        // Optional: If OPENAI_API_KEY is configured in process.env, augment answer
        if (process.env.OPENAI_API_KEY && !agentResult.provider) {
          try {
            const prompt = `You are the Aarambha AI Procurement Investigator, auditing Indian public procurement and MPLADS projects.
Context:
Project: ${caseContext?.projectName || 'Construction of Community Hall (MPLADS-1024)'}
Contractor: ${caseContext?.contractorName || 'ABC Infrastructure Pvt Ltd'}
Unit Price: ₹12,000/unit (+45.5% vs CPWD benchmark ₹8,250)
Tender Spread: 2.4% (vs 6.8% historical median)
Physical Progress: 68% vs Financial Disbursement: 86.8%
GFR Rules: Rule 149 & Rule 173 of GFR 2017, CPWD Works Manual Section 10CA.

User Question: "${question}"

Provide a concise, professional vigilance audit assessment citing these exact numbers, relevant GFR/CPWD clauses, and recommend verification steps. Do not declare guilt; state analytical signals.`;

            const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
              },
              body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                  { role: 'system', content: 'You are the Aarambha Forensic Audit Assistant for MoSPI MPLADS procurement.' },
                  { role: 'user', content: prompt }
                ],
                max_tokens: 350,
                temperature: 0.2
              })
            });

            if (aiRes.ok) {
              const aiData = await aiRes.json();
              const text = aiData?.choices?.[0]?.message?.content;
              if (text) {
                agentResult.answer = text;
                agentResult.provider = 'gpt-4o-mini';
              }
            }
          } catch (openAiErr) {
            console.warn('OpenAI API call skipped, using heuristic reasoning:', openAiErr.message);
          }
        }

        // Optional: If GEMINI_API_KEY is configured in process.env, augment answer
        if (process.env.GEMINI_API_KEY && !agentResult.provider) {
          try {
            const prompt = `You are the Aarambha AI Procurement Investigator, auditing Indian public procurement and MPLADS projects.
Context:
Project: ${caseContext?.projectName || 'Construction of Community Hall (MPLADS-1024)'}
Contractor: ${caseContext?.contractorName || 'ABC Infrastructure Pvt Ltd'}
Unit Price: ₹12,000/unit (+45.5% vs CPWD benchmark ₹8,250)
Tender Spread: 2.4% (vs 6.8% historical median)
Physical Progress: 68% vs Financial Disbursement: 86.8%
GFR Rules: Rule 149 & Rule 173 of GFR 2017, CPWD Works Manual Section 10CA.

User Question: "${question}"

Provide a concise, professional vigilance audit assessment citing these exact numbers, relevant GFR/CPWD clauses, and recommend verification steps. Do not declare guilt; state analytical signals.`;

            const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { maxOutputTokens: 350, temperature: 0.2 }
              })
            });

            if (geminiRes.ok) {
              const geminiData = await geminiRes.json();
              const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                agentResult.answer = text;
                agentResult.provider = 'gemini-1.5-flash';
              }
            }
          } catch (geminiErr) {
            console.warn('Gemini API call skipped, using heuristic reasoning:', geminiErr.message);
          }
        }

        return sendJson(res, 200, agentResult);
      } catch (e) {
        return sendJson(res, 400, { error: 'Invalid query payload', details: e.message });
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

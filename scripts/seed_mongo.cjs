require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('Missing MONGODB_URI in .env');
  process.exit(1);
}

const client = new MongoClient(uri);

async function seed() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas for seeding!');
    const db = client.db('aarambha');

    // 1. Seed 543 Parliamentary Constituencies from MoSPI official data
    console.log('📦 Seeding 543 Parliamentary Constituencies...');
    const rawConst = fs.readFileSync(path.join(__dirname, '../backend/data/constituencies.json'), 'utf8');
    const constituencies = JSON.parse(rawConst);

    const constCol = db.collection('constituencies');
    await constCol.deleteMany({});
    await constCol.insertMany(constituencies);
    console.log(`✅ Seeded ${constituencies.length} official constituencies into Atlas!`);

    // 2. Seed Projects Collection
    console.log('📦 Seeding Projects collection...');
    const projectsCol = db.collection('projects');
    await projectsCol.deleteMany({});
    const projects = [
      {
        id: 'MPLADS-1024',
        name: 'Construction of Community Hall & Skill Center',
        sanctionNo: 'MH/PUN/2025/COMM-1024',
        scheme: 'MPLADS - Special Local Area Development',
        department: 'District Rural Development Agency (DRDA)',
        state: 'Maharashtra',
        constituency: 'Pune',
        sanctionedAmount: 5200000,
        disbursedAmount: 4270000,
        contractValue: 8200000,
        currentProgress: 68,
        status: 'active',
        riskScore: 82,
        riskLevel: 'high',
        contractorName: 'ABC Infrastructure Pvt Ltd',
        contractorId: 'CTR-001',
        createdAt: new Date().toISOString()
      },
      {
        id: 'MPLADS-1025',
        name: 'Rural Connectivity Road & Culvert Works',
        sanctionNo: 'MH/NGP/2025/ROAD-1025',
        scheme: 'PMGSY - State Rural Infrastructure Phase IV',
        department: 'Public Works Department (PWD)',
        state: 'Maharashtra',
        constituency: 'Nagpur',
        sanctionedAmount: 3800000,
        disbursedAmount: 3150000,
        contractValue: 4600000,
        currentProgress: 52,
        status: 'active',
        riskScore: 76,
        riskLevel: 'high',
        contractorName: 'Kalyan Infratech Solutions Ltd',
        contractorId: 'CTR-002',
        createdAt: new Date().toISOString()
      },
      {
        id: 'MPLADS-1026',
        name: 'Smart Classroom & Computer Lab Upgradation',
        sanctionNo: 'UP/VAR/2025/EDU-1026',
        scheme: 'Samagra Shiksha Abhiyan - Tech Infrastructure',
        department: 'Basic Shiksha Adhikari (BSA)',
        state: 'Uttar Pradesh',
        constituency: 'Varanasi',
        sanctionedAmount: 2400000,
        disbursedAmount: 1800000,
        contractValue: 2750000,
        currentProgress: 88,
        status: 'active',
        riskScore: 68,
        riskLevel: 'review',
        contractorName: 'Shree Sai Eduventures & Tech',
        contractorId: 'CTR-003',
        createdAt: new Date().toISOString()
      },
      {
        id: 'MPLADS-1027',
        name: 'Solar Powered Drinking Water Filtration Plant',
        sanctionNo: 'RJ/JAI/2025/WAT-1027',
        scheme: 'Jal Jeevan Mission (JJM) - Rural Solar Augmentation',
        department: 'Public Health Engineering Department (PHED)',
        state: 'Rajasthan',
        constituency: 'Jaipur',
        sanctionedAmount: 4500000,
        disbursedAmount: 4100000,
        contractValue: 4400000,
        currentProgress: 94,
        status: 'completed',
        riskScore: 28,
        riskLevel: 'normal',
        contractorName: 'Marudhar Green Tech Pvt Ltd',
        contractorId: 'CTR-004',
        createdAt: new Date().toISOString()
      },
      {
        id: 'MPLADS-1028',
        name: 'Primary Health Center (PHC) Cold Storage Wing',
        sanctionNo: 'KA/BLR/2025/HLT-1028',
        scheme: 'National Health Mission (NHM) - Infrastructure',
        department: 'Health & Family Welfare Directorate',
        state: 'Karnataka',
        constituency: 'Bengaluru South',
        sanctionedAmount: 3100000,
        disbursedAmount: 1500000,
        contractValue: 3100000,
        currentProgress: 45,
        status: 'active',
        riskScore: 35,
        riskLevel: 'watch',
        contractorName: 'Deccan MediTech Projects',
        contractorId: 'CTR-005',
        createdAt: new Date().toISOString()
      }
    ];
    await projectsCol.insertMany(projects);
    console.log(`✅ Seeded ${projects.length} projects into Atlas!`);

    // 3. Seed Contractors Collection
    console.log('📦 Seeding Contractors collection...');
    const contractorsCol = db.collection('contractors');
    await contractorsCol.deleteMany({});
    const contractors = [
      {
        id: 'CTR-001',
        name: 'ABC Infrastructure Pvt Ltd',
        pan: 'AABCA1234F',
        gstin: '27AABCA1234F1Z5',
        registrationNo: 'MH-PWD-CLASS-A-4491',
        directors: [
          { name: 'Sri Rameshwar Rao', din: '08472911' },
          { name: 'Smt Sunita Rao', din: '08472912' }
        ],
        registeredAddress: 'Plot 42, MIDC Bhosari Industrial Area, Pune - 411026',
        riskScore: 84,
        riskLevel: 'high',
        totalContractsAwarded: 18,
        totalValueAwarded: 142000000,
        delayedProjectsRatio: 34.2,
        activeSanctionsFlagged: 3,
        syndicateLinkageCount: 4
      },
      {
        id: 'CTR-002',
        name: 'Kalyan Infratech Solutions Ltd',
        pan: 'AAACK9821K',
        gstin: '27AAACK9821K1Z3',
        registrationNo: 'MH-PWD-CLASS-B-1120',
        directors: [
          { name: 'Rajendra Kalyan', din: '07199201' },
          { name: 'Rameshwar Rao', din: '08472911' } // Shared DIN with ABC Infra!
        ],
        registeredAddress: 'Plot 43, MIDC Bhosari Industrial Area, Pune - 411026',
        riskScore: 78,
        riskLevel: 'high',
        totalContractsAwarded: 11,
        totalValueAwarded: 89000000,
        delayedProjectsRatio: 28.5,
        activeSanctionsFlagged: 2,
        syndicateLinkageCount: 3
      },
      {
        id: 'CTR-003',
        name: 'Shree Sai Eduventures & Tech',
        pan: 'AAECS4512L',
        gstin: '09AAECS4512L1Z8',
        registrationNo: 'UP-EDU-VENDOR-8831',
        directors: [{ name: 'Amitabh Tripathi', din: '09123841' }],
        registeredAddress: 'B-14, Sigra Commercial Complex, Varanasi - 221002',
        riskScore: 68,
        riskLevel: 'review',
        totalContractsAwarded: 6,
        totalValueAwarded: 19500000,
        delayedProjectsRatio: 18.0,
        activeSanctionsFlagged: 1,
        syndicateLinkageCount: 1
      },
      {
        id: 'CTR-004',
        name: 'Marudhar Green Tech Pvt Ltd',
        pan: 'AAMCG3319P',
        gstin: '08AAMCG3319P1Z2',
        registrationNo: 'RJ-PHED-A1-0091',
        directors: [{ name: 'Vikram Singh Rathore', din: '06811204' }],
        registeredAddress: 'RIICO Industrial Area, Mansarovar, Jaipur - 302020',
        riskScore: 24,
        riskLevel: 'normal',
        totalContractsAwarded: 14,
        totalValueAwarded: 76000000,
        delayedProjectsRatio: 7.2,
        activeSanctionsFlagged: 0,
        syndicateLinkageCount: 0
      }
    ];
    await contractorsCol.insertMany(contractors);
    console.log(`✅ Seeded ${contractors.length} contractors into Atlas!`);

    // 4. Seed Tenders Collection
    console.log('📦 Seeding Tenders collection...');
    const tendersCol = db.collection('tenders');
    await tendersCol.deleteMany({});
    const tenders = [
      {
        id: 'TDR-9281',
        tenderRefNo: 'DRDA/PUN/2025/T-9281',
        title: 'Civil Construction & Electrical Works of Community Hall',
        department: 'District Rural Development Agency, Pune',
        estimatedCost: 4850000,
        winningBidValue: 4920000,
        winningBidder: 'ABC Infrastructure Pvt Ltd',
        winnerId: 'CTR-001',
        status: 'awarded',
        bidSpread: 2.4, // Cartel indicator
        historicalMedianSpread: 6.8,
        participatingBiddersCount: 5,
        bids: [
          { bidder: 'ABC Infrastructure Pvt Ltd', bidAmount: 4920000, lRank: 'L1' },
          { bidder: 'Kalyan Infratech Solutions Ltd', bidAmount: 4950000, lRank: 'L2' },
          { bidder: 'PQR Enterprises', bidAmount: 4980000, lRank: 'L3' },
          { bidder: 'M/s V.K. Builders', bidAmount: 5010000, lRank: 'L4' },
          { bidder: 'Shree Sai Construction', bidAmount: 5040000, lRank: 'L5' }
        ],
        riskScore: 84,
        riskLevel: 'high',
        flaggedAnomalies: [
          'Narrow synthetic bid spread (2.4% vs peer benchmark 6.8%)',
          'Common directorship between L1 winner and L2 cover bidder (DIN: 08472911)',
          'Shared corporate registration address in MIDC Bhosari'
        ]
      },
      {
        id: 'TDR-9282',
        tenderRefNo: 'PWD/NGP/2025/T-9282',
        title: 'Asphalt Road Construction with RCC Box Culverts',
        department: 'Public Works Division, Nagpur',
        estimatedCost: 3750000,
        winningBidValue: 3820000,
        winningBidder: 'Kalyan Infratech Solutions Ltd',
        winnerId: 'CTR-002',
        status: 'awarded',
        bidSpread: 3.1,
        historicalMedianSpread: 6.8,
        participatingBiddersCount: 4,
        bids: [
          { bidder: 'Kalyan Infratech Solutions Ltd', bidAmount: 3820000, lRank: 'L1' },
          { bidder: 'ABC Infrastructure Pvt Ltd', bidAmount: 3860000, lRank: 'L2' },
          { bidder: 'Vidarbha Roads Ltd', bidAmount: 3910000, lRank: 'L3' },
          { bidder: 'Deshmukh & Sons', bidAmount: 3940000, lRank: 'L4' }
        ],
        riskScore: 78,
        riskLevel: 'high',
        flaggedAnomalies: [
          'Bid rotation pattern: ABC Infra bids as cover for Kalyan Infratech',
          'Tender variance +1.8% above estimated cost'
        ]
      }
    ];
    await tendersCol.insertMany(tenders);
    console.log(`✅ Seeded ${tenders.length} tenders into Atlas!`);

    // 5. Seed Investigation Cases Collection
    console.log('📦 Seeding Investigation Cases collection...');
    const casesCol = db.collection('investigations');
    await casesCol.deleteMany({});
    const cases = [
      {
        id: 'AR-2026-001024',
        title: 'Civil Overpricing & Cartel Bidding in Community Hall Works',
        projectId: 'MPLADS-1024',
        projectName: 'Construction of Community Hall (MPLADS-1024)',
        contractorId: 'CTR-001',
        contractorName: 'ABC Infrastructure Pvt Ltd',
        state: 'Maharashtra',
        constituency: 'Pune',
        riskScore: 82,
        riskLevel: 'high',
        status: 'under-investigation',
        priority: 'critical',
        leadInvestigator: 'Central Vigilance Inspection Cell, MoSPI',
        assignedDate: '2026-01-14',
        primarySignals: [
          {
            category: 'price-anomaly',
            finding: 'Civil unit rate ₹12,000/unit (+45.5% vs CPWD benchmark ₹8,250)',
            severity: 'CRITICAL',
            evidenceRef: 'EVD-001'
          },
          {
            category: 'bid-pattern',
            finding: 'Narrow bid spread (2.4%) & director DIN overlap with L2 bidder',
            severity: 'HIGH',
            evidenceRef: 'EVD-002'
          },
          {
            category: 'execution-variance',
            finding: 'Physical execution at 68% while ₹42.7L (86.8%) disbursed',
            severity: 'HIGH',
            evidenceRef: 'EVD-003'
          },
          {
            category: 'document-discrepancy',
            finding: 'Agreement value ₹82,00,000 vs sanction limit ₹49,20,000 (+66.7%)',
            severity: 'CRITICAL',
            evidenceRef: 'DOC-004'
          }
        ],
        smartLockStatus: 'ACTIVE_ESCROW_HOLD',
        blockedAmount: 1840000,
        createdAt: new Date().toISOString()
      },
      {
        id: 'AR-2026-001025',
        title: 'Bid Rotation & Milestone Inflation in Rural Connectivity Road',
        projectId: 'MPLADS-1025',
        projectName: 'Rural Connectivity Road & Culvert Works',
        contractorId: 'CTR-002',
        contractorName: 'Kalyan Infratech Solutions Ltd',
        state: 'Maharashtra',
        constituency: 'Nagpur',
        riskScore: 76,
        riskLevel: 'high',
        status: 'under-investigation',
        priority: 'high',
        leadInvestigator: 'State Vigilance Cell, Maharashtra',
        assignedDate: '2026-01-22',
        primarySignals: [
          {
            category: 'bid-pattern',
            finding: 'Bid rotation pattern observed across 3 district tenders',
            severity: 'HIGH',
            evidenceRef: 'EVD-101'
          },
          {
            category: 'execution-variance',
            finding: 'Culvert foundations uncertified by PWD Assistant Engineer',
            severity: 'HIGH',
            evidenceRef: 'EVD-102'
          }
        ],
        smartLockStatus: 'ACTIVE_ESCROW_HOLD',
        blockedAmount: 950000,
        createdAt: new Date().toISOString()
      }
    ];
    await casesCol.insertMany(cases);
    console.log(`✅ Seeded ${cases.length} investigation cases into Atlas!`);

    console.log('\n🎉 ALL COLLECTIONS SUCCESSFULLY POPULATED IN MONGODB ATLAS!');
    const finalCollections = await db.listCollections().toArray();
    console.log('Atlas Collections in aarambha db:', finalCollections.map(c => c.name));

  } catch (err) {
    console.error('❌ Seeding error:', err);
  } finally {
    await client.close();
  }
}

seed();

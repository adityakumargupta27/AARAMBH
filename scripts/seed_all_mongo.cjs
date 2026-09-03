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

// Data Source Definitions
const dataSources = [
  {
    name: 'MPLADS Portal (MoSPI)',
    type: 'REST API & Scraped Catalog',
    frequency: 'Hourly',
    records: '543 Parliamentary Constituencies',
    status: 'Available',
    coverage: 'All 28 States & 8 UTs',
    sourceUrl: 'https://mplads.gov.in',
    lastSync: 'Live Connected'
  },
  {
    name: 'CPPP (Central Public Procurement Portal)',
    type: 'e-Procurement XML Feed',
    frequency: 'Real-time Webhook',
    records: '842 Tender Packets',
    status: 'Available',
    coverage: 'Central Ministries & State DRDAs',
    sourceUrl: 'https://eprocure.gov.in',
    lastSync: 'Live Connected'
  },
  {
    name: 'CPWD Schedule of Rates (SoR)',
    type: 'Engineering Cost Baseline Database',
    frequency: 'Quarterly Revision',
    records: '1,420 Standard Item Rates',
    status: 'Available',
    coverage: 'Civil, Electrical & Public Works',
    sourceUrl: 'https://cpwd.gov.in',
    lastSync: 'Live Benchmark'
  },
  {
    name: 'PFMS (Public Financial Management System)',
    type: 'Zero-Leakage Escrow Gate API',
    frequency: 'Real-time Event Stream',
    records: '₹8,332.7 Cr Tracked Outlays',
    status: 'Available',
    coverage: 'Direct Benefit & Vendor Disbursements',
    sourceUrl: 'https://pfms.nic.in',
    lastSync: 'Escrow Lock Enabled'
  },
  {
    name: 'Ministry of Corporate Affairs (MCA21)',
    type: 'Director Registry & DIN Graph',
    frequency: 'Daily Batch',
    records: 'Contractor Corporate Linkages',
    status: 'Available',
    coverage: 'Syndicate & Common Directorship',
    sourceUrl: 'https://mca.gov.in',
    lastSync: 'Network Graph Active'
  },
  {
    name: 'State Public Works Divisions (PWD)',
    type: 'Milestone & Measurement Books (MB)',
    frequency: 'Fortnightly',
    records: 'Geo-tagged Progress Photos',
    status: 'Available',
    coverage: 'Ground Execution Milestones',
    sourceUrl: 'https://mahapwd.gov.in',
    lastSync: 'Sync Verified'
  }
];

// Contracts Definitions
const contracts = [
  {
    id: 'C-9281',
    projectId: 'MPLADS-1024',
    projectName: 'Construction of Community Hall & Skill Center',
    tenderId: 'T-9281',
    contractorId: 'CTR-001',
    contractorName: 'ABC Infrastructure Pvt Ltd',
    awardValue: 4920000,
    agreementValue: 8200000,
    sanctionedAmount: 5200000,
    awardDate: '2026-01-20',
    startDate: '2026-02-05',
    expectedCompletionDate: '2026-10-15',
    currentProgress: 68,
    expenditure: 4270000,
    status: 'active',
    riskScore: 82,
    riskLevel: 'high',
    state: 'Maharashtra',
    constituency: 'Pune',
    discrepancyNote: 'Agreement document indicates ₹82,00,000 vs sanction of ₹52,00,000 (+66.7%).'
  },
  {
    id: 'C-9282',
    projectId: 'MPLADS-1025',
    projectName: 'Rural Connectivity Road & Culvert Works',
    tenderId: 'T-9282',
    contractorId: 'CTR-002',
    contractorName: 'Kalyan Infratech Solutions Ltd',
    awardValue: 3820000,
    agreementValue: 3820000,
    sanctionedAmount: 3800000,
    awardDate: '2026-02-25',
    startDate: '2026-03-10',
    expectedCompletionDate: '2026-11-30',
    currentProgress: 52,
    expenditure: 3150000,
    status: 'active',
    riskScore: 76,
    riskLevel: 'high',
    state: 'Maharashtra',
    constituency: 'Nagpur',
    discrepancyNote: 'Culvert foundation works uncertified by Assistant Engineer.'
  },
  {
    id: 'C-9283',
    projectId: 'MPLADS-1026',
    projectName: 'Smart Classroom & Computer Lab Upgradation',
    tenderId: 'T-9283',
    contractorId: 'CTR-003',
    contractorName: 'Shree Sai Eduventures & Tech',
    awardValue: 2710000,
    agreementValue: 2750000,
    sanctionedAmount: 2400000,
    awardDate: '2025-06-28',
    startDate: '2025-07-10',
    expectedCompletionDate: '2026-01-30',
    currentProgress: 88,
    expenditure: 1800000,
    status: 'active',
    riskScore: 68,
    riskLevel: 'review',
    state: 'Uttar Pradesh',
    constituency: 'Varanasi',
    discrepancyNote: 'Equipment supply billing discrepancy of ₹3.5 Lakhs.'
  },
  {
    id: 'C-9284',
    projectId: 'MPLADS-1027',
    projectName: 'Solar Powered Drinking Water Filtration Plant',
    tenderId: 'T-9284',
    contractorId: 'CTR-004',
    contractorName: 'Marudhar Green Tech Pvt Ltd',
    awardValue: 4400000,
    agreementValue: 4400000,
    sanctionedAmount: 4500000,
    awardDate: '2026-02-05',
    startDate: '2026-02-20',
    expectedCompletionDate: '2026-08-30',
    currentProgress: 94,
    expenditure: 4100000,
    status: 'completed',
    riskScore: 28,
    riskLevel: 'normal',
    state: 'Rajasthan',
    constituency: 'Jaipur'
  },
  {
    id: 'C-9285',
    projectId: 'MPLADS-1028',
    projectName: 'Primary Health Center (PHC) Cold Storage Wing',
    tenderId: 'T-9285',
    contractorId: 'CTR-005',
    contractorName: 'Deccan MediTech Projects',
    awardValue: 3100000,
    agreementValue: 3100000,
    sanctionedAmount: 3100000,
    awardDate: '2026-03-25',
    startDate: '2026-04-10',
    expectedCompletionDate: '2026-12-15',
    currentProgress: 45,
    expenditure: 1500000,
    status: 'active',
    riskScore: 35,
    riskLevel: 'watch',
    state: 'Karnataka',
    constituency: 'Bengaluru South'
  }
];

async function seedAll() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas for comprehensive seeding!');
    const db = client.db('aarambha');

    // 1. Seed Contracts
    console.log('📦 Seeding Contracts collection...');
    const contractsCol = db.collection('contracts');
    await contractsCol.deleteMany({});
    await contractsCol.insertMany(contracts);
    console.log(`✅ Seeded ${contracts.length} contracts into Atlas!`);

    // 2. Seed Data Sources
    console.log('📦 Seeding Data Sources collection...');
    const dsCol = db.collection('datasources');
    await dsCol.deleteMany({});
    await dsCol.insertMany(dataSources);
    console.log(`✅ Seeded ${dataSources.length} data sources into Atlas!`);

    const cols = await db.listCollections().toArray();
    console.log('\n🎉 ALL MONGODB ATLAS COLLECTIONS READY:', cols.map(c => c.name));
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await client.close();
  }
}

seedAll();

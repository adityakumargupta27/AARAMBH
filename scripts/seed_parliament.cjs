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
    console.log('✅ Connected to MongoDB Atlas!');
    const db = client.db('aarambha');

    // 1. Seed 543 Lok Sabha Constituencies
    console.log('📦 Seeding 543 Lok Sabha Constituencies...');
    const rawConst = fs.readFileSync(path.join(__dirname, '../backend/data/constituencies.json'), 'utf8');
    const constituencies = JSON.parse(rawConst);
    const constCol = db.collection('constituencies');
    await constCol.deleteMany({});
    await constCol.insertMany(constituencies);
    console.log(`✅ Seeded ${constituencies.length} Lok Sabha constituencies!`);

    // 2. Seed 231 Rajya Sabha Members
    console.log('📦 Seeding 231 Rajya Sabha MPs...');
    const rawRS = fs.readFileSync(path.join(__dirname, '../backend/data/rajya_sabha.json'), 'utf8');
    const rajyaSabha = JSON.parse(rawRS);
    const rsCol = db.collection('rajya_sabha');
    await rsCol.deleteMany({});
    await rsCol.insertMany(rajyaSabha);
    console.log(`✅ Seeded ${rajyaSabha.length} Rajya Sabha MPs!`);

    // 3. Seed 774 Parliamentary MPs
    console.log('📦 Seeding 774 Combined Parliamentary MPs...');
    const rawAll = fs.readFileSync(path.join(__dirname, '../backend/data/all_mps.json'), 'utf8');
    const allMps = JSON.parse(rawAll);
    const allMpsCol = db.collection('all_mps');
    await allMpsCol.deleteMany({});
    await allMpsCol.insertMany(allMps);
    console.log(`✅ Seeded ${allMps.length} Combined Parliamentary MPs!`);

    // 4. Seed 774 Projects (One for every MP)
    console.log('📦 Generating & Seeding 774 Projects into Atlas...');
    const projectsCol = db.collection('projects');
    await projectsCol.deleteMany({});

    const schemes = [
      'MPLADS - Special Local Area Development Scheme',
      'PMGSY - State Rural Connectivity Infrastructure',
      'Samagra Shiksha Abhiyan - Educational Facilities Upgradation',
      'Jal Jeevan Mission (JJM) - Rural Water Augmentation',
      'National Health Mission (NHM) - Community Health Center Expansion',
      'Pradhan Mantri Awas Yojana - Urban Amenities Extension',
      'Smart City Mission - Civic Center & Digital Public Infrastructure'
    ];

    const departments = [
      'District Rural Development Agency (DRDA)',
      'Public Works Department (PWD)',
      'Public Health Engineering Department (PHED)',
      'Municipal Corporation Engineering Wing',
      'Irrigation and Flood Control Directorate',
      'State Technical Education Directorate'
    ];

    const allProjects = allMps.map((mp, index) => {
      const isLS = mp.house === 'Lok Sabha';
      const isAug = !mp.isBaseline;
      const excess = (mp.allocatedAmount - 147000000) / 147000000;
      const riskScore = isAug ? Math.min(96, Math.round(62 + excess * 36)) : 38;
      const riskLevel = riskScore >= 75 ? 'high' : riskScore >= 50 ? 'review' : 'normal';

      const scheme = schemes[index % schemes.length];
      const dept = departments[index % departments.length];
      const sanctioned = mp.allocatedAmount;
      const disbursed = Math.round(sanctioned * (isAug ? 0.74 : 0.68));
      const contractVal = Math.round(sanctioned * 0.94);

      return {
        id: mp.id,
        name: `${mp.house === 'Lok Sabha' ? 'Lok Sabha' : 'Rajya Sabha'} Works — ${mp.constituency}`,
        house: mp.house,
        mpName: mp.mpName,
        mpType: mp.mpType,
        sanctionNo: `${mp.state.slice(0, 2).toUpperCase()}/${mp.house === 'Lok Sabha' ? 'LS' : 'RS'}/2025/DEV-${String(index + 1).padStart(4, '0')}`,
        scheme,
        department: dept,
        state: mp.state,
        constituency: mp.constituency,
        sanctionedAmount: sanctioned,
        disbursedAmount: disbursed,
        contractValue: contractVal,
        currentProgress: isAug ? 58 : 82,
        status: isAug ? 'active' : 'completed',
        riskScore,
        riskLevel,
        contractorName: `${mp.state} Regional Infrastructure Agency`,
        contractorId: `CTR-${String((index % 25) + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString()
      };
    });

    await projectsCol.insertMany(allProjects);
    console.log(`✅ Seeded ${allProjects.length} projects into Atlas!`);

    console.log('🎉 Seeding completed successfully!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await client.close();
  }
}

seed();

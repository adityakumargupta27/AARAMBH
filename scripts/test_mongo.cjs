require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const { MongoClient } = require('mongodb');

// Try with auth options to avoid URI percent-encoding issues
async function testAuth(username, password) {
  console.log(`Testing auth with username: "${username}" and password length: ${password.length}...`);
  const client = new MongoClient('mongodb+srv://cluster0.avhbay8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    auth: {
      username,
      password
    }
  });

  try {
    await client.connect();
    console.log('🎉 SUCCESS! Connected to MongoDB Atlas!');
    const db = client.db('aarambha');
    const cols = await db.listCollections().toArray();
    console.log('Collections:', cols.map(c => c.name));
    return true;
  } catch (err) {
    console.error('Failed:', err.message);
    return false;
  } finally {
    await client.close();
  }
}

async function run() {
  // Test candidate 1: "aditya@32805"
  let ok = await testAuth('ag6787670_db_user', 'aditya@32805');
  if (!ok) {
    // Test candidate 2: "<aditya@32805>"
    console.log('Trying with angle brackets...');
    await testAuth('ag6787670_db_user', '<aditya@32805>');
  }
}

run();

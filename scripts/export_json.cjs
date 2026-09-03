const fs = require('fs');
const path = require('path');

// Read officialMpladsData.ts and extract the JSON array
const content = fs.readFileSync(path.join(__dirname, '../src/data/officialMpladsData.ts'), 'utf8');

const matchArray = content.match(/export const officialMPAllocations: MPAllocation\[\] = (\[[\s\S]*\]);\s*$/);
if (matchArray) {
  const jsonText = matchArray[1];
  const destDir = path.join(__dirname, '../backend/data');
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.writeFileSync(path.join(destDir, 'constituencies.json'), jsonText);
  console.log('Saved backend/data/constituencies.json');
} else {
  console.error('Could not match officialMPAllocations');
}


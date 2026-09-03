const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/officialMpladsData.ts');
const content = fs.readFileSync(filePath, 'utf8');

const splitIndex = content.indexOf('export const officialMPAllocations: MPAllocation[] = [');
if (splitIndex !== -1) {
  const topPart = content.slice(0, splitIndex);
  const newContent = `${topPart}
import constituenciesJson from './constituencies.json';

export const officialMPAllocations: MPAllocation[] = constituenciesJson as MPAllocation[];
`;
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log('Successfully optimized officialMpladsData.ts!');
} else {
  console.error('Could not find officialMPAllocations start');
}

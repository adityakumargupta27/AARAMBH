// ============================================================
// OFFICIAL MoSPI MPLADS DATASET — 543 LOK SABHA CONSTITUENCIES
// Source: Ministry of Statistics and Programme Implementation (MoSPI)
// Document: "Allocated Limit for Hon'ble MPs"
// Grand Total: ₹83,18,05,53,325.71 (~₹8,318.05 Crores)
// ============================================================

import type { MPAllocation } from '@/types';

export interface StateSummary {
  state: string;
  constituenciesCount: number;
  totalAllocated: number;
  baselineCount: number;
  augmentedCount: number;
  highestConstituency: string;
  highestAmount: number;
}

export const officialMpladsSummary = {
  source: 'Ministry of Statistics and Programme Implementation (MoSPI) - DigiGov',
  documentTitle: 'Allocated Limit for Hon\'ble MPs',
  totalConstituencies: 543,
  grandTotalAllocated: 83327553325.71004,
  standardBaselineAmount: 147000000, // ₹14.70 Cr standard
  baselineCount: 387,
  augmentedCount: 156,
  topAccumulatedConstituencies: [
    { rank: 1, constituency: 'MALKAJGIRI', state: 'Telangana', mp: 'EATALA RAJENDER', amount: 327477390.86, excessRatio: '+122.8%' },
    { rank: 2, constituency: 'NIZAMABAD', state: 'Telangana', mp: 'Arvind Dharmapuri', amount: 281396355.11, excessRatio: '+91.4%' },
    { rank: 3, constituency: 'BOLPUR(SC)', state: 'West Bengal', mp: 'Asit Kumar Mal', amount: 275694456.74, excessRatio: '+87.5%' },
    { rank: 4, constituency: 'BIJAPUR(SC)', state: 'Karnataka', mp: 'Ramesh Chandappa Jigajinagi', amount: 269500000.00, excessRatio: '+83.3%' },
    { rank: 5, constituency: 'KORAPUT(ST)', state: 'Odisha', mp: 'Saptagiri Sankar Ulaka', amount: 269500000.00, excessRatio: '+83.3%' },
    { rank: 6, constituency: 'SIDHI', state: 'Madhya Pradesh', mp: 'DR. RAJESH MISHRA', amount: 262724510.35, excessRatio: '+78.7%' },
    { rank: 7, constituency: 'AMBALA (SC)', state: 'Haryana', mp: 'VARUN CHAUDHRY', amount: 255454264.00, excessRatio: '+73.8%' },
    { rank: 8, constituency: 'DAMAN and DIU', state: 'The Dadra And Nagar Haveli And Daman And Diu', mp: 'PATEL UMESHBHAI BABUBHAI', amount: 245063957.00, excessRatio: '+66.7%' },
  ]
};

export const stateAllocationSummaries: StateSummary[] = [
  {
    "state": "Uttar Pradesh",
    "constituenciesCount": 80,
    "totalAllocated": 12111756374.810001,
    "baselineCount": 63,
    "augmentedCount": 17,
    "highestConstituency": "GHAZIPUR",
    "highestAmount": 220500000
  },
  {
    "state": "Maharashtra",
    "constituenciesCount": 49,
    "totalAllocated": 7489285090.939998,
    "baselineCount": 37,
    "augmentedCount": 12,
    "highestConstituency": "AMRAVATI(SC)",
    "highestAmount": 198293678
  },
  {
    "state": "West Bengal",
    "constituenciesCount": 42,
    "totalAllocated": 6391333259.29,
    "baselineCount": 34,
    "augmentedCount": 8,
    "highestConstituency": "BOLPUR(SC)",
    "highestAmount": 275694456.74
  },
  {
    "state": "Tamil Nadu",
    "constituenciesCount": 39,
    "totalAllocated": 6138473649.83,
    "baselineCount": 20,
    "augmentedCount": 19,
    "highestConstituency": "KALLAKURICHI",
    "highestAmount": 201599593
  },
  {
    "state": "Bihar",
    "constituenciesCount": 40,
    "totalAllocated": 5999462522.87,
    "baselineCount": 33,
    "augmentedCount": 7,
    "highestConstituency": "JAMUI(SC)",
    "highestAmount": 194924621.11
  },
  {
    "state": "Madhya Pradesh",
    "constituenciesCount": 29,
    "totalAllocated": 4430471672.8,
    "baselineCount": 20,
    "augmentedCount": 9,
    "highestConstituency": "SIDHI",
    "highestAmount": 262724510.35
  },
  {
    "state": "Karnataka",
    "constituenciesCount": 28,
    "totalAllocated": 4272103415.3300004,
    "baselineCount": 24,
    "augmentedCount": 4,
    "highestConstituency": "BIJAPUR(SC)",
    "highestAmount": 269500000
  },
  {
    "state": "Andhra Pradesh",
    "constituenciesCount": 25,
    "totalAllocated": 4047877732.0800014,
    "baselineCount": 10,
    "augmentedCount": 15,
    "highestConstituency": "ANAKAPALLE",
    "highestAmount": 202531656.11
  },
  {
    "state": "Gujarat",
    "constituenciesCount": 26,
    "totalAllocated": 3846967459.4700003,
    "baselineCount": 24,
    "augmentedCount": 2,
    "highestConstituency": "WEST(SC)",
    "highestAmount": 160434965.11
  },
  {
    "state": "Rajasthan",
    "constituenciesCount": 25,
    "totalAllocated": 3767573544.82,
    "baselineCount": 21,
    "augmentedCount": 4,
    "highestConstituency": "RAJSAMAND",
    "highestAmount": 183892143
  },
  {
    "state": "Odisha",
    "constituenciesCount": 21,
    "totalAllocated": 3288850789.9800005,
    "baselineCount": 12,
    "augmentedCount": 9,
    "highestConstituency": "KORAPUT(ST)",
    "highestAmount": 269500000
  },
  {
    "state": "Kerala",
    "constituenciesCount": 20,
    "totalAllocated": 3110874325.9900007,
    "baselineCount": 10,
    "augmentedCount": 10,
    "highestConstituency": "KOTTAYAM",
    "highestAmount": 188722256.11
  },
  {
    "state": "Telangana",
    "constituenciesCount": 17,
    "totalAllocated": 2943774227.1500006,
    "baselineCount": 11,
    "augmentedCount": 6,
    "highestConstituency": "MALKAJGIRI",
    "highestAmount": 327477390.86
  },
  {
    "state": "Jharkhand",
    "constituenciesCount": 14,
    "totalAllocated": 2114316383.3500004,
    "baselineCount": 8,
    "augmentedCount": 6,
    "highestConstituency": "LOHARDAGA(ST)",
    "highestAmount": 171821957.11
  },
  {
    "state": "Assam",
    "constituenciesCount": 14,
    "totalAllocated": 2010300157.1100001,
    "baselineCount": 12,
    "augmentedCount": 2,
    "highestConstituency": "SILCHAR",
    "highestAmount": 148300157.11
  },
  {
    "state": "Punjab",
    "constituenciesCount": 12,
    "totalAllocated": 1780626330.54,
    "baselineCount": 10,
    "augmentedCount": 2,
    "highestConstituency": "BHATINDA",
    "highestAmount": 159775982.39
  },
  {
    "state": "Chhattisgarh",
    "constituenciesCount": 11,
    "totalAllocated": 1671719691.53,
    "baselineCount": 5,
    "augmentedCount": 6,
    "highestConstituency": "KANKER(ST)",
    "highestAmount": 164672734.11
  },
  {
    "state": "Haryana",
    "constituenciesCount": 10,
    "totalAllocated": 1578454264,
    "baselineCount": 9,
    "augmentedCount": 1,
    "highestConstituency": "(SC)",
    "highestAmount": 255454264
  },
  {
    "state": "Delhi",
    "constituenciesCount": 7,
    "totalAllocated": 1117190622,
    "baselineCount": 1,
    "augmentedCount": 6,
    "highestConstituency": "EAST DELHI",
    "highestAmount": 225843858
  },
  {
    "state": "Jammu And Kashmir",
    "constituenciesCount": 5,
    "totalAllocated": 742773472.11,
    "baselineCount": 4,
    "augmentedCount": 1,
    "highestConstituency": "BARAMULLAH",
    "highestAmount": 154773472.11
  },
  {
    "state": "Uttarakhand",
    "constituenciesCount": 5,
    "totalAllocated": 735000000,
    "baselineCount": 5,
    "augmentedCount": 0,
    "highestConstituency": "NAG.",
    "highestAmount": 147000000
  },
  {
    "state": "Himachal Pradesh",
    "constituenciesCount": 4,
    "totalAllocated": 629523041.33,
    "baselineCount": 1,
    "augmentedCount": 3,
    "highestConstituency": "KANGRA",
    "highestAmount": 179388967.11
  },
  {
    "state": "The Dadra And Nagar Haveli And Daman And Diu",
    "constituenciesCount": 2,
    "totalAllocated": 392063957,
    "baselineCount": 1,
    "augmentedCount": 1,
    "highestConstituency": "DIU",
    "highestAmount": 245063957
  },
  {
    "state": "Manipur",
    "constituenciesCount": 2,
    "totalAllocated": 294000000,
    "baselineCount": 2,
    "augmentedCount": 0,
    "highestConstituency": "MANIPUR(ST)",
    "highestAmount": 147000000
  },
  {
    "state": "Tripura",
    "constituenciesCount": 2,
    "totalAllocated": 294000000,
    "baselineCount": 2,
    "augmentedCount": 0,
    "highestConstituency": "WEST",
    "highestAmount": 147000000
  },
  {
    "state": "Goa",
    "constituenciesCount": 2,
    "totalAllocated": 294000000,
    "baselineCount": 2,
    "augmentedCount": 0,
    "highestConstituency": "GOA",
    "highestAmount": 147000000
  },
  {
    "state": "Arunachal Pradesh",
    "constituenciesCount": 2,
    "totalAllocated": 294000000,
    "baselineCount": 2,
    "augmentedCount": 0,
    "highestConstituency": "WEST",
    "highestAmount": 147000000
  },
  {
    "state": "Meghalaya",
    "constituenciesCount": 2,
    "totalAllocated": 245000000,
    "baselineCount": 1,
    "augmentedCount": 1,
    "highestConstituency": "TURA",
    "highestAmount": 147000000
  },
  {
    "state": "Puducherry",
    "constituenciesCount": 1,
    "totalAllocated": 209368972.11,
    "baselineCount": 0,
    "augmentedCount": 1,
    "highestConstituency": "Puducherry",
    "highestAmount": 209368972.11
  },
  {
    "state": "Chandigarh",
    "constituenciesCount": 1,
    "totalAllocated": 178351443.75,
    "baselineCount": 0,
    "augmentedCount": 1,
    "highestConstituency": "CHANDIGARH",
    "highestAmount": 178351443.75
  },
  {
    "state": "Ladakh",
    "constituenciesCount": 1,
    "totalAllocated": 161114542,
    "baselineCount": 0,
    "augmentedCount": 1,
    "highestConstituency": "LADAKH",
    "highestAmount": 161114542
  },
  {
    "state": "Lakshadweep",
    "constituenciesCount": 1,
    "totalAllocated": 153942460.41,
    "baselineCount": 0,
    "augmentedCount": 1,
    "highestConstituency": "LAKSHADWEEP(ST)",
    "highestAmount": 153942460.41
  },
  {
    "state": "Sikkim",
    "constituenciesCount": 1,
    "totalAllocated": 152003923.11,
    "baselineCount": 0,
    "augmentedCount": 1,
    "highestConstituency": "SIKKIM",
    "highestAmount": 152003923.11
  },
  {
    "state": "Andaman And Nicobar Islands",
    "constituenciesCount": 1,
    "totalAllocated": 147000000,
    "baselineCount": 1,
    "augmentedCount": 0,
    "highestConstituency": "ANDAMAN AND NICOBAR ISLANDS",
    "highestAmount": 147000000
  },
  {
    "state": "Mizoram",
    "constituenciesCount": 1,
    "totalAllocated": 147000000,
    "baselineCount": 1,
    "augmentedCount": 0,
    "highestConstituency": "(ST)",
    "highestAmount": 147000000
  },
  {
    "state": "Nagaland",
    "constituenciesCount": 1,
    "totalAllocated": 147000000,
    "baselineCount": 1,
    "augmentedCount": 0,
    "highestConstituency": "NAGALAND",
    "highestAmount": 147000000
  }
];


import constituenciesJson from './constituencies.json';
import rajyaSabhaJson from './rajya_sabha.json';
import allMpsJson from './all_mps.json';

export interface RajyaSabhaAllocation {
  srNo: number;
  state: string;
  mpName: string;
  house: 'Rajya Sabha';
  mpType: 'Elected MP' | 'Nominated MP';
  allocatedAmount: number;
  isBaseline: boolean;
}

export interface CombinedParliamentAllocation {
  id: string;
  house: 'Lok Sabha' | 'Rajya Sabha';
  srNo: number;
  state: string;
  mpName: string;
  constituency: string;
  allocatedAmount: number;
  isBaseline: boolean;
  mpType: string;
}

export const officialMPAllocations: MPAllocation[] = constituenciesJson as MPAllocation[];
export const officialRajyaSabhaAllocations: RajyaSabhaAllocation[] = rajyaSabhaJson as RajyaSabhaAllocation[];
export const allParliamentAllocations: CombinedParliamentAllocation[] = allMpsJson as CombinedParliamentAllocation[];

export const parliamentSummary = {
  lokSabhaTotal: 83336673298.01,
  lokSabhaCount: 543,
  rajyaSabhaTotal: 33638482301.82,
  rajyaSabhaCount: 231,
  grandTotal: 116975155599.83,
  grandTotalMPs: 774,
};

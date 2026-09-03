export interface MPLADSAllocation {
  id: string;
  serialNumber: number;
  state: string;
  mpName: string;
  constituency: string;
  allocatedAmount: number;
  sourceName: string;
  sourceUrl: string;
  sourceRetrievedAt: string;
  sourceRow?: string;
  dataQualityFlags: string[];
}

export interface AllocationQuery {
  search?: string;
  state?: string;
  page?: number;
  pageSize?: number;
}

export interface AllocationDatasetSummary {
  sourceRecordCount: number;
  localRecordCount: number;
  officialGrandTotal: number;
  sourceName: string;
  sourceUrl: string;
  coverageLabel: string;
  isPartial: boolean;
}

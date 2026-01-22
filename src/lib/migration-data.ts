
export interface ReconDataItem {
  sourceObj: string;
  sourceTab: string;
  sourceCount: number;
  targetObj: string;
  targetTab: string;
  targetCount: number;
  notOkCount: number;
  totalCount: number;
  toLoadCount: number;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}

export const RECON_DATA: ReconDataItem[] = [
  { sourceObj: 'ANAMBANK', sourceTab: 'BNKA', sourceCount: 23115, targetObj: 'BANK_MASTER', targetTab: 'S_BNKA', targetCount: 23115, notOkCount: 29, totalCount: 23115, toLoadCount: 29, status: 'SUCCESS' },
  { sourceObj: 'ANACUSTOMER', sourceTab: 'KNA1', sourceCount: 8086, targetObj: 'CUSTOMER_2', targetTab: 'S_ADDRESS', targetCount: 8086, notOkCount: 3, totalCount: 8086, toLoadCount: 0, status: 'SUCCESS' },
  { sourceObj: 'ANACUSTOMER', sourceTab: 'KNBW', sourceCount: 11, targetObj: 'CUSTOMER_2', targetTab: 'S_CUS_WITH_TAX', targetCount: 11, notOkCount: 12, totalCount: 11, toLoadCount: 0, status: 'SUCCESS' },
  { sourceObj: 'ANACUSTOMER', sourceTab: 'KNBK', sourceCount: 284, targetObj: 'CUSTOMER_2', targetTab: 'S_CUST_BANK_DATA', targetCount: 284, notOkCount: 274, totalCount: 284, toLoadCount: 0, status: 'SUCCESS' },
  { sourceObj: 'ANACUSTOMER', sourceTab: 'KNB1', sourceCount: 13648, targetObj: 'CUSTOMER_2', targetTab: 'S_CUST_COMPANY', targetCount: 13648, notOkCount: 9507, totalCount: 13648, toLoadCount: 0, status: 'SUCCESS' },
  { sourceObj: 'ANAPRODUCT', sourceTab: 'MARA', sourceCount: 14541, targetObj: 'PRODUCT', targetTab: 'S_MARA', targetCount: 14200, notOkCount: 3163, totalCount: 14200, toLoadCount: 12335, status: 'WARNING' },
  { sourceObj: 'ANAPRODUCT', sourceTab: 'MARC', sourceCount: 21869, targetObj: 'PRODUCT', targetTab: 'S_MARC', targetCount: 21305, notOkCount: 0, totalCount: 21305, toLoadCount: 18913, status: 'SUCCESS' },
  { sourceObj: 'ANASUPPLIER', sourceTab: 'LFA1', sourceCount: 1833, targetObj: 'VENDOR_2', targetTab: 'S_ROLES', targetCount: 2583, notOkCount: 0, totalCount: 2583, toLoadCount: 2579, status: 'SUCCESS' },
  { sourceObj: 'BATCHES', sourceTab: 'MCH1', sourceCount: 32, targetObj: 'BATCHES', targetTab: 'S_BATCH', targetCount: 32, notOkCount: 0, totalCount: 32, toLoadCount: 0, status: 'SUCCESS' },
];

export interface TestRuleDataItem {
  targetObj: string;
  targetTable: string;
  targetField: string;
  ruleName: string;
  sqlCode: string;
  notOkCount: number;
  totalCount: number;
}

export const TEST_RULE_DATA: TestRuleDataItem[] = [
  { targetObj: 'BANK_MASTER', targetTable: 'S_BNKA', targetField: 'BANKA', ruleName: 'Default Testing Rule', sqlCode: "ISNULL(BANKA, '') != ''", notOkCount: 29, totalCount: 23115 },
  { targetObj: 'BATCHES', targetTable: 'S_BATCH', targetField: 'BATCH', ruleName: 'Default Testing Rule', sqlCode: "ISNULL(BATCH, '') != ''", notOkCount: 0, totalCount: 32 },
  { targetObj: 'PRODUCT', targetTable: 'S_MARA', targetField: 'MATNR', ruleName: 'Default Testing Rule', sqlCode: "ISNULL(MATNR, '') != ''", notOkCount: 3163, totalCount: 14200 },
  { targetObj: 'CUSTOMER_2', targetTable: 'S_ADDRESS', targetField: 'NAME1', ruleName: 'Null Check', sqlCode: "NAME1 IS NOT NULL", notOkCount: 3, totalCount: 8086 },
  { targetObj: 'CUSTOMER_2', targetTable: 'S_CUST_COMPANY', targetField: 'BUKRS', ruleName: 'Company Code Validation', sqlCode: "BUKRS IN ('1000', '2000')", notOkCount: 9507, totalCount: 13648 },
];

export type MigrationStatus = 'success' | 'warning' | 'failed' | 'in_progress' | 'pending';

export interface MigrationObject {
  id: string;
  name: string;
  tables: number;
  active: boolean;
  type: string;
  sapName: string;
  count: string;
  size: string;
  status: MigrationStatus;
  dependencies: string[];
  records: number;
  failedRecords: number;
  reconciled: boolean;
  error?: boolean;
  details?: {
    tables?: string[];
  };
}

export const MIGRATION_OBJECTS: MigrationObject[] = [
  { 
    id: 'BANK_MASTER', 
    name: 'BANK_MASTER', 
    tables: 1, 
    active: true, 
    type: 'Master Data', 
    sapName: 'Bank Master', 
    count: '23,115', 
    size: '1.2 GB',
    status: 'success',
    dependencies: [],
    records: 23115,
    failedRecords: 29,
    reconciled: true,
    details: { tables: ['BNKA'] }
  },
  { 
    id: 'GL_BALANCE', 
    name: 'GL_BALANCE', 
    tables: 3, 
    active: true, 
    type: 'Master Data', 
    sapName: 'General Ledger', 
    count: '145,230', 
    size: '12.4 GB',
    status: 'success',
    dependencies: ['BANK_MASTER'],
    records: 145230,
    failedRecords: 0,
    reconciled: true,
    details: { tables: ['SKA1', 'SKB1', 'SKAT'] }
  },
  { 
    id: 'PRODUCT', 
    name: 'PRODUCT', 
    tables: 4, 
    active: true, 
    type: 'Master Data', 
    sapName: 'Product', 
    count: '14,541', 
    size: '23.3 GB', 
    status: 'warning',
    dependencies: ['GL_BALANCE'],
    records: 14541,
    failedRecords: 3163,
    reconciled: false,
    details: { tables: ['MARA', 'MARC', 'MARD', 'MAKT'] } 
  },
  { 
    id: 'VENDOR_2', 
    name: 'VENDOR_2', 
    tables: 3, 
    active: true, 
    type: 'Master Data', 
    sapName: 'Vendor', 
    count: '2,583', 
    size: '2.1 GB',
    status: 'success',
    dependencies: ['GL_BALANCE'],
    records: 2583,
    failedRecords: 0,
    reconciled: true,
    details: { tables: ['LFA1', 'LFB1', 'LFM1'] }
  },
  { 
    id: 'CUSTOMER_2', 
    name: 'CUSTOMER_2', 
    tables: 4, 
    active: true, 
    type: 'Master Data', 
    sapName: 'Customer', 
    count: '8,086', 
    size: '4.5 GB',
    status: 'warning',
    dependencies: ['GL_BALANCE'],
    records: 8086,
    failedRecords: 9507,
    reconciled: false,
    details: { tables: ['KNA1', 'KNB1', 'KNBK', 'KNVV'] }
  },
  { 
    id: 'BATCHES', 
    name: 'BATCHES', 
    tables: 2, 
    active: true, 
    type: 'Master Data', 
    sapName: 'Batches', 
    count: '32', 
    size: '0.1 GB',
    status: 'success',
    dependencies: ['PRODUCT'],
    records: 32,
    failedRecords: 0,
    reconciled: true,
    details: { tables: ['MCH1', 'MCHA'] }
  },
  { 
    id: 'CUST_EXT_2', 
    name: 'CUST_EXT_2', 
    tables: 1, 
    active: true, 
    type: 'Master Data', 
    sapName: 'Customer Extension', 
    count: '24,560', 
    size: '8.4 GB',
    status: 'failed',
    dependencies: ['CUSTOMER_2'],
    records: 24560,
    failedRecords: 12500,
    reconciled: false
  },
  { 
    id: 'OPEN_ITEM_AP', 
    name: 'OPEN_ITEM_AP', 
    tables: 2, 
    active: false, 
    type: 'Transactional', 
    sapName: 'Open Items AP', 
    count: '540,230', 
    size: '145.6 GB',
    status: 'pending',
    dependencies: ['VENDOR_2'],
    records: 540230,
    failedRecords: 0,
    reconciled: false
  },
  { 
    id: 'BOM', 
    name: 'BOM', 
    tables: 2, 
    active: false, 
    type: 'Master Data', 
    sapName: 'Bill of Materials', 
    count: '15,600', 
    size: '4.2 GB', 
    status: 'failed',
    dependencies: ['PRODUCT'],
    records: 15600,
    failedRecords: 15600,
    reconciled: false,
    error: true
  },
  { 
    id: 'ROUTING', 
    name: 'ROUTING', 
    tables: 2, 
    active: false, 
    type: 'Master Data', 
    sapName: 'Routing', 
    count: '8,400', 
    size: '2.8 GB', 
    status: 'failed',
    dependencies: ['PRODUCT'],
    records: 8400,
    failedRecords: 8400,
    reconciled: false,
    error: true
  },
];

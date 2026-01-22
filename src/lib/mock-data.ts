
export type MigrationStatus = 'success' | 'warning' | 'failed' | 'in_progress' | 'pending';

export interface MigrationStep {
  id: string;
  name: string;
  status: MigrationStatus;
  recordsProcessed: number;
  totalRecords: number;
  errors: number;
  duration: string;
  description: string;
}

export interface MigrationObject {
  id: string;
  name: string;
  type: string;
  status: MigrationStatus;
  dependencies: string[];
  records: number;
  failedRecords: number;
  reconciled: boolean;
}

export const MOCK_STEPS: MigrationStep[] = [
  {
    id: 'extract',
    name: 'Extract',
    status: 'success',
    recordsProcessed: 1250000,
    totalRecords: 1250000,
    errors: 0,
    duration: '45m',
    description: 'Source data extraction from SAP legacy system.'
  },
  {
    id: 'transform',
    name: 'Transform',
    status: 'success',
    recordsProcessed: 1250000,
    totalRecords: 1250000,
    errors: 1240,
    duration: '1h 20m',
    description: 'Mapping rules application and data formatting.'
  },
  {
    id: 'validate',
    name: 'Validate',
    status: 'warning',
    recordsProcessed: 1248760,
    totalRecords: 1250000,
    errors: 8420,
    duration: '35m',
    description: 'Schema validation and business logic checks.'
  },
  {
    id: 'reconcile',
    name: 'Reconcile',
    status: 'in_progress',
    recordsProcessed: 850000,
    totalRecords: 1250000,
    errors: 450,
    duration: 'Running...',
    description: 'Comparing source vs target record integrity.'
  },
  {
    id: 'load',
    name: 'Load',
    status: 'pending',
    recordsProcessed: 0,
    totalRecords: 1250000,
    errors: 0,
    duration: '-',
    description: 'Final data injection into target environment.'
  }
];

export const MOCK_OBJECTS: MigrationObject[] = [
  {
    id: 'BANK_MASTER',
    name: 'Bank Master',
    type: 'Financial',
    status: 'success',
    dependencies: [],
    records: 23115,
    failedRecords: 0,
    reconciled: true
  },
  {
    id: 'GL_BALANCE',
    name: 'G/L Accounts',
    type: 'Financial',
    status: 'success',
    dependencies: ['BANK_MASTER'],
    records: 145230,
    failedRecords: 0,
    reconciled: true
  },
  {
    id: 'PRODUCT',
    name: 'Product',
    type: 'Master Data',
    status: 'warning',
    dependencies: ['GL_BALANCE'],
    records: 132230,
    failedRecords: 3163,
    reconciled: false
  },
  {
    id: 'VENDOR_2',
    name: 'Vendor',
    type: 'Purchasing',
    status: 'success',
    dependencies: ['GL_BALANCE'],
    records: 45670,
    failedRecords: 0,
    reconciled: true
  },
  {
    id: 'CUSTOMER_2',
    name: 'Customer',
    type: 'Sales',
    status: 'warning',
    dependencies: ['GL_BALANCE'],
    records: 85120,
    failedRecords: 9507,
    reconciled: false
  },
  {
    id: 'CUST_EXT_2',
    name: 'Customer Extension',
    type: 'Sales',
    status: 'failed',
    dependencies: ['CUSTOMER_2'],
    records: 24560,
    failedRecords: 12500,
    reconciled: false
  }
];

export const MOCK_RECONCILIATION = {
  total: 1250000,
  matched: 1180000,
  mismatched: 70000,
  rootCauses: [
    { category: 'DataType Mismatch', count: 25000, impact: 'High' },
    { category: 'Missing Keys', count: 15000, impact: 'Medium' },
    { category: 'Formatting', count: 30000, impact: 'Low' }
  ],
  aiInsights: [
    'Most mismatches (35%) originate from the "Customer Extension" object due to legacy date formats.',
    'Adjusting mapping rule "R-402" could resolve 12,000 formatting errors in Product.',
    'High correlation detected between "Bank Master" validation delays and "Customer" load failures.'
  ]
};

export const MOCK_HEALTH = {
  overallScore: 78,
  errorDensity: 5.6,
  integrityIndex: 94.2,
  riskLevel: 'Medium',
  trends: [
    { date: '2026-01-15', errors: 12000, health: 72 },
    { date: '2026-01-16', errors: 10500, health: 75 },
    { date: '2026-01-17', errors: 15000, health: 68 },
    { date: '2026-01-18', errors: 9800, health: 80 },
    { date: '2026-01-19', errors: 8420, health: 78 }
  ]
};

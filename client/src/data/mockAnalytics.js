export const mockAnalytics = {
  overview: {
    totalVillages: 5,
    totalHouseholds: 850,
    totalPumps: 24,
    workingPumps: 21,
    waterSupplyReliability: 92.5, // %
    waterQualitySafeRate: 88.0, // %
    complaintResolutionRate: 76.4, // %
    maintenanceCompletionRate: 85.0, // %
    feeCollectionRate: 68.5, // %
  },
  waterSupply: {
    scheduledSupplies: 150,
    completedSupplies: 138,
    missedSupplies: 12,
    trend: [
      { name: 'Mar', value: 88 },
      { name: 'Apr', value: 90 },
      { name: 'May', value: 89 },
      { name: 'Jun', value: 91 },
      { name: 'Jul', value: 93 },
      { name: 'Aug', value: 92.5 }
    ]
  },
  complaints: {
    total: 45,
    new: 5,
    inProgress: 8,
    resolved: 20,
    closed: 10,
    overdue: 2,
    byStatus: [
      { name: 'New', value: 5 },
      { name: 'In Progress', value: 8 },
      { name: 'Resolved', value: 20 },
      { name: 'Closed', value: 10 },
      { name: 'Overdue', value: 2 }
    ],
    byCategory: [
      { name: 'No Water', value: 15 },
      { name: 'Pump Issue', value: 12 },
      { name: 'Leakage', value: 8 },
      { name: 'Quality', value: 6 },
      { name: 'Other', value: 4 }
    ],
    trend: [
      { name: 'Mar', value: 8 },
      { name: 'Apr', value: 12 },
      { name: 'May', value: 7 },
      { name: 'Jun', value: 15 },
      { name: 'Jul', value: 9 },
      { name: 'Aug', value: 5 }
    ]
  },
  pumps: {
    total: 24,
    working: 21,
    underMaintenance: 2,
    notWorking: 1,
    statusDistribution: [
      { name: 'Working', value: 21 },
      { name: 'Under Maint.', value: 2 },
      { name: 'Not Working', value: 1 }
    ]
  },
  waterQuality: {
    totalTests: 120,
    safe: 105,
    needsAttention: 10,
    critical: 5,
    statusDistribution: [
      { name: 'Safe', value: 105 },
      { name: 'Needs Attention', value: 10 },
      { name: 'Critical', value: 5 }
    ]
  },
  maintenance: {
    total: 35,
    pending: 4,
    inProgress: 3,
    completed: 26,
    overdue: 1,
    emergency: 1,
    trend: [
      { name: 'Mar', value: 4 },
      { name: 'Apr', value: 6 },
      { name: 'May', value: 5 },
      { name: 'Jun', value: 8 },
      { name: 'Jul', value: 7 },
      { name: 'Aug', value: 5 }
    ]
  },
  payments: {
    amountDue: 127500, // INR
    amountCollected: 87300, // INR
    outstanding: 40200, // INR
    trend: [
      { name: 'Mar', value: 12000 },
      { name: 'Apr', value: 14500 },
      { name: 'May', value: 13200 },
      { name: 'Jun', value: 15800 },
      { name: 'Jul', value: 16500 },
      { name: 'Aug', value: 15300 }
    ],
    byVillage: [
      { name: 'Sonapur', value: 25000 },
      { name: 'Raha', value: 18500 },
      { name: 'Hajo', value: 15200 },
      { name: 'Kamalpur', value: 20000 },
      { name: 'Baihata', value: 8600 }
    ]
  },
  villagesPerformance: [
    {
      id: 'V-001',
      village: 'Sonapur',
      households: 250,
      pumps: 6,
      workingPumps: 6,
      supplyReliability: 96,
      waterQualityStatus: 'Good',
      openComplaints: 2,
      maintenancePending: 0,
      collectionRate: 85,
      overallStatus: 'Good'
    },
    {
      id: 'V-002',
      village: 'Raha',
      households: 180,
      pumps: 5,
      workingPumps: 4,
      supplyReliability: 88,
      waterQualityStatus: 'Needs Attention',
      openComplaints: 5,
      maintenancePending: 2,
      collectionRate: 60,
      overallStatus: 'Needs Attention'
    },
    {
      id: 'V-003',
      village: 'Hajo',
      households: 150,
      pumps: 4,
      workingPumps: 4,
      supplyReliability: 94,
      waterQualityStatus: 'Good',
      openComplaints: 1,
      maintenancePending: 1,
      collectionRate: 75,
      overallStatus: 'Good'
    },
    {
      id: 'V-004',
      village: 'Kamalpur',
      households: 200,
      pumps: 6,
      workingPumps: 5,
      supplyReliability: 82,
      waterQualityStatus: 'Critical',
      openComplaints: 8,
      maintenancePending: 3,
      collectionRate: 55,
      overallStatus: 'Critical'
    },
    {
      id: 'V-005',
      village: 'Baihata',
      households: 70,
      pumps: 3,
      workingPumps: 2,
      supplyReliability: 78,
      waterQualityStatus: 'Good',
      openComplaints: 3,
      maintenancePending: 1,
      collectionRate: 45,
      overallStatus: 'Needs Attention'
    }
  ]
};

export const districtsList = [
  'Kamrup',
  'Kamrup Metropolitan',
  'Nagaon'
];

export const dateRangeOptions = [
  'Last 7 Days',
  'Last 30 Days',
  'Last 3 Months',
  'Last 6 Months',
  'Year to Date'
];

export const mockWaterQuality = [
  {
    id: 'WQT-6001',
    village: 'Sonapur',
    testDate: '2026-08-10',
    testedBy: 'Operator Raj',
    ph: 7.2,
    turbidity: 1.5,
    tds: 150,
    chlorine: 0.5,
    status: 'Safe',
    remarks: 'All parameters within normal range.',
    lastUpdated: '2026-08-10T14:30:00Z'
  },
  {
    id: 'WQT-6002',
    village: 'Raha',
    testDate: '2026-08-11',
    testedBy: 'Operator Amit',
    ph: 6.4,
    turbidity: 5.2,
    tds: 320,
    chlorine: 0.1,
    status: 'Needs Attention',
    remarks: 'High turbidity. Need to check filter.',
    lastUpdated: '2026-08-11T09:15:00Z'
  },
  {
    id: 'WQT-6003',
    village: 'Hajo',
    testDate: '2026-08-12',
    testedBy: 'Operator Raj',
    ph: 7.5,
    turbidity: 0.8,
    tds: 180,
    chlorine: 0.6,
    status: 'Safe',
    remarks: 'Excellent water quality.',
    lastUpdated: '2026-08-12T11:00:00Z'
  },
  {
    id: 'WQT-6004',
    village: 'Kamalpur',
    testDate: '2026-08-13',
    testedBy: 'Tech Priya',
    ph: 8.6,
    turbidity: 8.5,
    tds: 550,
    chlorine: 0.0,
    status: 'Critical',
    remarks: 'High pH and turbidity. Chlorination required immediately.',
    lastUpdated: '2026-08-13T08:45:00Z'
  },
  {
    id: 'WQT-6005',
    village: 'Baihata',
    testDate: '2026-08-09',
    testedBy: 'Tech Priya',
    ph: 7.0,
    turbidity: 2.1,
    tds: 210,
    chlorine: 0.4,
    status: 'Safe',
    remarks: 'Sample tested at main reservoir.',
    lastUpdated: '2026-08-09T16:20:00Z'
  },
  {
    id: 'WQT-6006',
    village: 'Sonapur',
    testDate: '2026-07-28',
    testedBy: 'Operator Raj',
    ph: 6.8,
    turbidity: 3.5,
    tds: 290,
    chlorine: 0.2,
    status: 'Needs Attention',
    remarks: 'TDS slightly elevated.',
    lastUpdated: '2026-07-28T10:10:00Z'
  }
];

export const waterQualityStatusList = [
  'Safe',
  'Needs Attention',
  'Critical'
];

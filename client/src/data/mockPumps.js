export const mockPumps = [
  {
    id: 'PMP-3001',
    name: 'Sonapur Main Bazaar Pump',
    village: 'Sonapur',
    pumpType: 'Submersible',
    installationDate: '2022-04-15',
    status: 'Working',
    lastMaintenance: '2026-06-10',
    operator: 'Operator Raj',
    lastUpdated: '2026-08-12T09:30:00Z',
    maintenanceHistory: [
      { date: '2026-06-10', issue: 'Filter replacement', handledBy: 'Operator Raj' },
      { date: '2025-11-22', issue: 'Routine inspection', handledBy: 'Tech Priya' }
    ]
  },
  {
    id: 'PMP-3002',
    name: 'Raha East Ward Hand Pump',
    village: 'Raha',
    pumpType: 'Hand Pump',
    installationDate: '2019-08-20',
    status: 'Under Maintenance',
    lastMaintenance: '2026-08-13',
    operator: 'Operator Amit',
    lastUpdated: '2026-08-13T10:15:00Z',
    maintenanceHistory: [
      { date: '2026-08-13', issue: 'Handle broken', handledBy: 'Operator Amit' },
      { date: '2024-03-14', issue: 'Washer replaced', handledBy: 'Operator Amit' }
    ]
  },
  {
    id: 'PMP-3003',
    name: 'Hajo Temple Road Pump',
    village: 'Hajo',
    pumpType: 'Solar Powered',
    installationDate: '2023-11-05',
    status: 'Working',
    lastMaintenance: '2026-05-20',
    operator: 'Operator Raj',
    lastUpdated: '2026-08-10T14:20:00Z',
    maintenanceHistory: [
      { date: '2026-05-20', issue: 'Solar panel cleaning', handledBy: 'Operator Raj' }
    ]
  },
  {
    id: 'PMP-3004',
    name: 'Kamalpur School Submersible',
    village: 'Kamalpur',
    pumpType: 'Submersible',
    installationDate: '2021-02-18',
    status: 'Working',
    lastMaintenance: '2026-07-02',
    operator: 'Tech Priya',
    lastUpdated: '2026-08-11T08:45:00Z',
    maintenanceHistory: [
      { date: '2026-07-02', issue: 'Motor servicing', handledBy: 'Tech Priya' },
      { date: '2023-09-12', issue: 'Pipe leakage fixed', handledBy: 'Tech Priya' }
    ]
  },
  {
    id: 'PMP-3005',
    name: 'Baihata North Hand Pump',
    village: 'Baihata',
    pumpType: 'Hand Pump',
    installationDate: '2018-05-30',
    status: 'Not Working',
    lastMaintenance: '2025-12-11',
    operator: 'Tech Priya',
    lastUpdated: '2026-08-13T07:10:00Z',
    maintenanceHistory: [
      { date: '2025-12-11', issue: 'Cylinder replaced', handledBy: 'Tech Priya' }
    ]
  },
  {
    id: 'PMP-3006',
    name: 'Raha Central Market Pump',
    village: 'Raha',
    pumpType: 'Submersible',
    installationDate: '2020-10-10',
    status: 'Unavailable',
    lastMaintenance: '2026-01-05',
    operator: 'Operator Amit',
    lastUpdated: '2026-07-20T11:00:00Z',
    maintenanceHistory: [
      { date: '2026-01-05', issue: 'Electrical fault', handledBy: 'Operator Amit' }
    ]
  }
];

export const pumpTypes = [
  'Submersible',
  'Hand Pump',
  'Solar Powered',
  'Overhead Tank Pump'
];

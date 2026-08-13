export const mockMaintenance = [
  {
    id: 'MNT-8001',
    pumpId: 'PMP-3001',
    pumpName: 'Sonapur Main Bazaar Pump',
    village: 'Sonapur',
    maintenanceType: 'Preventive',
    problemDescription: 'Routine 6-month cleaning and filter check.',
    priority: 'Low',
    assignedOperator: 'Operator Raj',
    requestDate: '2026-08-01',
    scheduledDate: '2026-08-10',
    startDate: '2026-08-10',
    completionDate: '2026-08-10',
    status: 'Completed',
    resolutionDescription: 'Filter cleaned, pressure checked. All normal.',
    remarks: 'Next routine check in Feb 2027.',
    lastUpdated: '2026-08-10T16:00:00Z'
  },
  {
    id: 'MNT-8002',
    pumpId: 'PMP-3002',
    pumpName: 'Raha East Ward Hand Pump',
    village: 'Raha',
    maintenanceType: 'Corrective',
    problemDescription: 'Handle is broken and water is not lifting.',
    priority: 'High',
    assignedOperator: 'Operator Amit',
    requestDate: '2026-08-09',
    scheduledDate: '2026-08-11',
    startDate: '2026-08-11',
    completionDate: null,
    status: 'In Progress', // Overdue since today is Aug 13 and scheduled was Aug 11
    resolutionDescription: '',
    remarks: 'Awaiting spare handle delivery.',
    lastUpdated: '2026-08-11T10:30:00Z'
  },
  {
    id: 'MNT-8003',
    pumpId: 'PMP-3005',
    pumpName: 'Baihata North Hand Pump',
    village: 'Baihata',
    maintenanceType: 'Emergency',
    problemDescription: 'Pump completely failed, major leak flooding area.',
    priority: 'Emergency',
    assignedOperator: 'Tech Priya',
    requestDate: '2026-08-13',
    scheduledDate: '2026-08-13',
    startDate: null,
    completionDate: null,
    status: 'Assigned',
    resolutionDescription: '',
    remarks: 'Immediate action required.',
    lastUpdated: '2026-08-13T09:15:00Z'
  },
  {
    id: 'MNT-8004',
    pumpId: 'PMP-3004',
    pumpName: 'Kamalpur School Submersible',
    village: 'Kamalpur',
    maintenanceType: 'Preventive',
    problemDescription: 'Annual motor servicing.',
    priority: 'Medium',
    assignedOperator: null,
    requestDate: '2026-08-12',
    scheduledDate: '2026-08-20',
    startDate: null,
    completionDate: null,
    status: 'Pending',
    resolutionDescription: '',
    remarks: 'Assign operator before the 18th.',
    lastUpdated: '2026-08-12T11:00:00Z'
  },
  {
    id: 'MNT-8005',
    pumpId: 'PMP-3006',
    pumpName: 'Raha Central Market Pump',
    village: 'Raha',
    maintenanceType: 'Corrective',
    problemDescription: 'Electrical fault causing intermittent power.',
    priority: 'High',
    assignedOperator: 'Operator Amit',
    requestDate: '2026-08-05',
    scheduledDate: '2026-08-07',
    startDate: null,
    completionDate: null,
    status: 'Pending', // Overdue
    resolutionDescription: '',
    remarks: 'Requires electrician assistance.',
    lastUpdated: '2026-08-05T14:20:00Z'
  }
];

export const maintenanceTypes = [
  'Preventive',
  'Corrective',
  'Emergency'
];

export const maintenancePriorities = [
  'Low',
  'Medium',
  'High',
  'Emergency'
];

export const maintenanceStatuses = [
  'Pending',
  'Assigned',
  'In Progress',
  'Completed',
  'Cancelled'
];

// Configuration for Overdue threshold (in days)
export const OVERDUE_THRESHOLD_DAYS = 3;

export const mockComplaints = [
  {
    id: 'CMP-7001',
    submittedDate: '2026-08-10',
    villagerName: 'Ramesh Das',
    village: 'Sonapur',
    category: 'No Water Supply',
    subject: 'No water since morning',
    description: 'The main supply line is not giving any water today. Our neighborhood is completely dry.',
    priority: 'High',
    assignedOperator: 'Operator Raj',
    status: 'In Progress',
    createdAt: '2026-08-10T08:15:00Z',
    updatedAt: '2026-08-11T09:00:00Z',
    resolvedAt: null,
    resolutionRemarks: ''
  },
  {
    id: 'CMP-7002',
    submittedDate: '2026-08-08',
    villagerName: 'Sunita Devi',
    village: 'Raha',
    category: 'Pump Problem',
    subject: 'Hand pump handle broken',
    description: 'The hand pump near the school has a broken handle. We cannot pump water.',
    priority: 'Medium',
    assignedOperator: 'Operator Amit',
    status: 'Resolved',
    createdAt: '2026-08-08T14:30:00Z',
    updatedAt: '2026-08-10T11:00:00Z',
    resolvedAt: '2026-08-10T10:45:00Z',
    resolutionRemarks: 'Replaced the broken handle with a new spare part.'
  },
  {
    id: 'CMP-7003',
    submittedDate: '2026-08-05',
    villagerName: 'Kamal Barman',
    village: 'Hajo',
    category: 'Pipeline Problem',
    subject: 'Major pipe leak',
    description: 'There is a huge leak in the main pipe near the temple road.',
    priority: 'Critical',
    assignedOperator: 'Operator Raj',
    status: 'In Progress', // Overdue based on threshold
    createdAt: '2026-08-05T09:20:00Z',
    updatedAt: '2026-08-06T10:15:00Z',
    resolvedAt: null,
    resolutionRemarks: ''
  },
  {
    id: 'CMP-7004',
    submittedDate: '2026-08-12',
    villagerName: 'Anil Kumar',
    village: 'Kamalpur',
    category: 'Water Quality',
    subject: 'Water tastes muddy',
    description: 'The water from the submersible pump tastes muddy and has high turbidity today.',
    priority: 'High',
    assignedOperator: 'Tech Priya',
    status: 'New',
    createdAt: '2026-08-12T16:45:00Z',
    updatedAt: '2026-08-12T16:45:00Z',
    resolvedAt: null,
    resolutionRemarks: ''
  },
  {
    id: 'CMP-7005',
    submittedDate: '2026-08-01',
    villagerName: 'Bina Das',
    village: 'Baihata',
    category: 'Payment/Fee Issue',
    subject: 'Monthly fee payment not updated',
    description: 'I paid the operator last week but it is not showing on my receipt.',
    priority: 'Low',
    assignedOperator: 'Tech Priya',
    status: 'Closed',
    createdAt: '2026-08-01T11:10:00Z',
    updatedAt: '2026-08-03T14:20:00Z',
    resolvedAt: '2026-08-03T14:00:00Z',
    resolutionRemarks: 'Payment successfully synchronized in the local ledger.'
  },
  {
    id: 'CMP-7006',
    submittedDate: '2026-08-09',
    villagerName: 'Rahul Sen',
    village: 'Sonapur',
    category: 'Leakage',
    subject: 'Small leak at household tap',
    description: 'My household tap is leaking continuously.',
    priority: 'Low',
    assignedOperator: 'Operator Raj',
    status: 'New', // Overdue
    createdAt: '2026-08-09T07:30:00Z',
    updatedAt: '2026-08-09T07:30:00Z',
    resolvedAt: null,
    resolutionRemarks: ''
  }
];

export const complaintCategories = [
  'No Water Supply',
  'Pump Problem',
  'Water Quality',
  'Pipeline Problem',
  'Leakage',
  'Payment/Fee Issue',
  'Other'
];

export const complaintPriorities = [
  'Low',
  'Medium',
  'High',
  'Critical'
];

export const complaintStatuses = [
  'New',
  'In Progress',
  'Resolved',
  'Closed',
  'Reopened'
];

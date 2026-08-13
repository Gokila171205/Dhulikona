export const mockAuditLogs = [
  {
    id: 'AUD-501',
    dateTime: '2026-08-13T10:42:00Z',
    userId: 'U-001',
    userName: 'Admin User',
    role: 'Admin',
    action: 'Update',
    module: 'Pumps',
    village: 'Raha',
    description: 'Updated pump status from Working to Under Maintenance for PMP-005',
    result: 'Success',
    relatedRecordId: 'PMP-005'
  },
  {
    id: 'AUD-502',
    dateTime: '2026-08-13T10:35:00Z',
    userId: 'U-012',
    userName: 'Operator Hari',
    role: 'Operator',
    action: 'Create',
    module: 'Water Supply',
    village: 'Sonapur',
    description: 'Recorded completed water supply for morning schedule',
    result: 'Success',
    relatedRecordId: 'WS-145'
  },
  {
    id: 'AUD-503',
    dateTime: '2026-08-13T10:21:00Z',
    userId: 'U-089',
    userName: 'Ramesh Das',
    role: 'Villager',
    action: 'Create',
    module: 'Complaints',
    village: 'Kamalpur',
    description: 'Submitted new complaint regarding dirty water',
    result: 'Success',
    relatedRecordId: 'CMP-881'
  },
  {
    id: 'AUD-504',
    dateTime: '2026-08-13T10:05:00Z',
    userId: 'U-001',
    userName: 'Admin User',
    role: 'Admin',
    action: 'Generate Report',
    module: 'Reports',
    village: 'All Villages',
    description: 'Generated Monthly Summary Report for July 2026',
    result: 'Success',
    relatedRecordId: 'RPT-001'
  },
  {
    id: 'AUD-505',
    dateTime: '2026-08-13T09:15:00Z',
    userId: 'U-001',
    userName: 'Admin User',
    role: 'Admin',
    action: 'Mark as Read',
    module: 'Notifications',
    village: 'System',
    description: 'Marked critical notification NOT-1001 as read',
    result: 'Success',
    relatedRecordId: 'NOT-1001'
  },
  {
    id: 'AUD-506',
    dateTime: '2026-08-12T16:30:00Z',
    userId: 'U-014',
    userName: 'Tech Priya',
    role: 'Operator',
    action: 'Login',
    module: 'Authentication',
    village: 'Hajo',
    description: 'User login from mobile device',
    result: 'Success',
    relatedRecordId: 'AUTH-902'
  },
  {
    id: 'AUD-507',
    dateTime: '2026-08-12T14:45:00Z',
    userId: 'U-003',
    userName: 'Ranjan Kalita',
    role: 'Villager',
    action: 'Login',
    module: 'Authentication',
    village: 'Baihata',
    description: 'Failed login attempt (Invalid credentials)',
    result: 'Failed',
    relatedRecordId: 'AUTH-903'
  },
  {
    id: 'AUD-508',
    dateTime: '2026-08-12T11:20:00Z',
    userId: 'U-001',
    userName: 'Admin User',
    role: 'Admin',
    action: 'Update',
    module: 'Payments',
    village: 'Sonapur',
    description: 'Recorded batch payment for 45 households',
    result: 'Success',
    relatedRecordId: 'BATCH-45'
  }
];

export const roleOptions = [
  'Admin',
  'Operator',
  'Villager'
];

export const moduleOptions = [
  'Authentication',
  'Users',
  'Villages',
  'Pumps',
  'Water Supply',
  'Water Quality',
  'Complaints',
  'Maintenance',
  'Payments',
  'Reports',
  'Notifications'
];

export const actionOptions = [
  'Login',
  'Create',
  'Update',
  'Delete',
  'Status Change',
  'View',
  'Generate Report',
  'Mark as Read'
];

export const resultOptions = [
  'Success',
  'Failed'
];

export const dateRangeOptions = [
  'Today',
  'Last 7 Days',
  'Last 30 Days'
];

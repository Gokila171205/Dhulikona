export const mockNotifications = [
  {
    id: 'NOT-1001',
    type: 'Water Quality',
    title: 'Critical E. Coli Detection',
    message: 'Recent water quality test at Kamalpur Village shows critical E. Coli levels. Immediate action required to chlorinate the main reservoir.',
    village: 'Kamalpur',
    priority: 'Critical',
    status: 'Unread',
    createdDate: '2026-08-13T09:15:00Z',
    createdBy: 'System Alert',
    relatedType: 'waterQuality',
    relatedId: 'WQ-5042',
    lastUpdated: '2026-08-13T09:15:00Z'
  },
  {
    id: 'NOT-1002',
    type: 'Pump',
    title: 'Pump Failure - Submersible Motor',
    message: 'Pump PMP-005 in Raha village has stopped responding to electrical inputs. Suspected motor burnout.',
    village: 'Raha',
    priority: 'High',
    status: 'Unread',
    createdDate: '2026-08-12T14:30:00Z',
    createdBy: 'Operator Hari',
    relatedType: 'pump',
    relatedId: 'PMP-005',
    lastUpdated: '2026-08-12T14:30:00Z'
  },
  {
    id: 'NOT-1003',
    type: 'Maintenance',
    title: 'Overdue Maintenance - Filter Replacement',
    message: 'Routine filter replacement at Sonapur Water Treatment Plant is overdue by 5 days.',
    village: 'Sonapur',
    priority: 'Medium',
    status: 'Read',
    createdDate: '2026-08-10T08:00:00Z',
    createdBy: 'System Alert',
    relatedType: 'maintenance',
    relatedId: 'MNT-209',
    lastUpdated: '2026-08-10T11:20:00Z'
  },
  {
    id: 'NOT-1004',
    type: 'Complaint',
    title: 'Escalated Complaint - No Water Supply',
    message: 'Complaint CMP-880 has been open for more than 7 days without resolution. Automatically escalated to Administrator.',
    village: 'Hajo',
    priority: 'High',
    status: 'Unread',
    createdDate: '2026-08-13T10:05:00Z',
    createdBy: 'System Escalation',
    relatedType: 'complaint',
    relatedId: 'CMP-880',
    lastUpdated: '2026-08-13T10:05:00Z'
  },
  {
    id: 'NOT-1005',
    type: 'Payment',
    title: 'Mass Fee Collection Update',
    message: 'Batch payment processing complete. 45 households marked as paid in Sonapur.',
    village: 'Sonapur',
    priority: 'Low',
    status: 'Read',
    createdDate: '2026-08-11T16:00:00Z',
    createdBy: 'Admin User',
    relatedType: 'payment',
    relatedId: 'BATCH-45',
    lastUpdated: '2026-08-11T16:15:00Z'
  },
  {
    id: 'NOT-1006',
    type: 'Water Supply',
    title: 'Scheduled Supply Interruption',
    message: 'Water supply to Baihata will be interrupted tomorrow between 10 AM and 2 PM due to main pipeline flushing.',
    village: 'Baihata',
    priority: 'Medium',
    status: 'Unread',
    createdDate: '2026-08-13T07:45:00Z',
    createdBy: 'Admin User',
    relatedType: 'waterSupply',
    relatedId: 'WS-801',
    lastUpdated: '2026-08-13T07:45:00Z'
  },
  {
    id: 'NOT-1007',
    type: 'System',
    title: 'Monthly Analytics Report Generated',
    message: 'The system has automatically generated the July 2026 analytical summary report.',
    village: 'All Villages',
    priority: 'Low',
    status: 'Read',
    createdDate: '2026-08-01T09:05:00Z',
    createdBy: 'System Scheduler',
    relatedType: 'report',
    relatedId: 'RPT-001',
    lastUpdated: '2026-08-01T09:30:00Z'
  }
];

export const notificationTypes = [
  'Pump',
  'Water Supply',
  'Water Quality',
  'Complaint',
  'Maintenance',
  'Payment',
  'System'
];

export const priorityLevels = [
  'Critical',
  'High',
  'Medium',
  'Low'
];

export const statusOptions = [
  'Read',
  'Unread'
];

export const dateRangeOptions = [
  'Last 24 Hours',
  'Last 7 Days',
  'Last 30 Days',
  'Older'
];

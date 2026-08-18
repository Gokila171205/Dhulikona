export const mockWaterSupply = [
  {
    id: 'WS-5001',
    village: 'Sonapur',
    supplyDate: '2026-08-13',
    scheduledStart: '06:00',
    scheduledEnd: '08:00',
    actualStart: '06:15',
    actualEnd: '08:15',
    frequency: 'Daily',
    status: 'Completed',
    recordedBy: 'Operator Raj',
    remarks: 'Slight delay due to power cut',
    lastUpdated: '2026-08-13T08:20:00Z'
  },
  {
    id: 'WS-5002',
    village: 'Raha',
    supplyDate: '2026-08-13',
    scheduledStart: '07:00',
    scheduledEnd: '09:00',
    actualStart: '07:00',
    actualEnd: '09:00',
    frequency: 'Twice Daily',
    status: 'Completed',
    recordedBy: 'Operator Amit',
    remarks: 'Normal supply',
    lastUpdated: '2026-08-13T09:10:00Z'
  },
  {
    id: 'WS-5003',
    village: 'Hajo',
    supplyDate: '2026-08-13',
    scheduledStart: '06:30',
    scheduledEnd: '08:30',
    actualStart: '-',
    actualEnd: '-',
    frequency: 'Daily',
    status: 'Missed',
    recordedBy: 'Operator Raj',
    remarks: 'Pump failure',
    lastUpdated: '2026-08-13T07:00:00Z'
  },
  {
    id: 'WS-5004',
    village: 'Kamalpur',
    supplyDate: '2026-08-13',
    scheduledStart: '16:00',
    scheduledEnd: '18:00',
    actualStart: '-',
    actualEnd: '-',
    frequency: 'Weekly',
    status: 'Scheduled',
    recordedBy: 'Tech Priya',
    remarks: '',
    lastUpdated: '2026-08-12T18:00:00Z'
  },
  {
    id: 'WS-5005',
    village: 'Baihata',
    supplyDate: '2026-08-12',
    scheduledStart: '06:00',
    scheduledEnd: '08:00',
    actualStart: '06:00',
    actualEnd: '07:30',
    frequency: 'Daily',
    status: 'Completed',
    recordedBy: 'Tech Priya',
    remarks: 'Stopped early due to low pressure',
    lastUpdated: '2026-08-12T07:45:00Z'
  },
  {
    id: 'WS-5006',
    village: 'Sonapur',
    supplyDate: '2026-08-12',
    scheduledStart: '17:00',
    scheduledEnd: '19:00',
    actualStart: '-',
    actualEnd: '-',
    frequency: 'Twice Daily',
    status: 'Cancelled',
    recordedBy: 'Operator Raj',
    remarks: 'Pipeline repair work',
    lastUpdated: '2026-08-12T16:00:00Z'
  },
  {
    id: 'WS-5007',
    village: 'Raha',
    supplyDate: '2026-08-12',
    scheduledStart: '16:00',
    scheduledEnd: '18:00',
    actualStart: '16:05',
    actualEnd: '18:10',
    frequency: 'Twice Daily',
    status: 'Completed',
    recordedBy: 'Operator Amit',
    remarks: 'Evening supply',
    lastUpdated: '2026-08-12T18:15:00Z'
  }
];

export const frequencyList = [
  'Daily',
  'Twice Daily',
  'Weekly',
  'Other'
];

export const statusList = [
  'Scheduled',
  'Completed',
  'Missed',
  'Cancelled'
];

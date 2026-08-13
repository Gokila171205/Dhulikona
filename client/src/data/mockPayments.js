export const mockPayments = [
  {
    id: 'PAY-9001',
    householdId: 'HH-101',
    householdName: 'Ramesh Das',
    village: 'Sonapur',
    billingPeriod: 'July 2026',
    amountDue: 150,
    amountPaid: 150,
    paymentDate: '2026-08-05',
    paymentMethod: 'UPI',
    status: 'Paid',
    recordedBy: 'Operator Raj',
    remarks: 'Paid via GPay.',
    lastUpdated: '2026-08-05T14:30:00Z'
  },
  {
    id: 'PAY-9002',
    householdId: 'HH-105',
    householdName: 'Sunita Devi',
    village: 'Raha',
    billingPeriod: 'July 2026',
    amountDue: 150,
    amountPaid: 0,
    paymentDate: null,
    paymentMethod: null,
    status: 'Overdue',
    recordedBy: 'System',
    remarks: 'Did not pay by 10th of August.',
    lastUpdated: '2026-08-11T00:00:00Z'
  },
  {
    id: 'PAY-9003',
    householdId: 'HH-110',
    householdName: 'Kamal Barman',
    village: 'Hajo',
    billingPeriod: 'July 2026',
    amountDue: 300, // Two months due
    amountPaid: 150,
    paymentDate: '2026-08-12',
    paymentMethod: 'Cash',
    status: 'Partially Paid',
    recordedBy: 'Tech Priya',
    remarks: 'Paid one month, promised remaining next week.',
    lastUpdated: '2026-08-12T09:15:00Z'
  },
  {
    id: 'PAY-9004',
    householdId: 'HH-102',
    householdName: 'Anil Kumar',
    village: 'Kamalpur',
    billingPeriod: 'August 2026',
    amountDue: 150,
    amountPaid: 0,
    paymentDate: null,
    paymentMethod: null,
    status: 'Pending',
    recordedBy: 'System',
    remarks: '',
    lastUpdated: '2026-08-01T00:00:00Z'
  },
  {
    id: 'PAY-9005',
    householdId: 'HH-125',
    householdName: 'Bina Das',
    village: 'Baihata',
    billingPeriod: 'July 2026',
    amountDue: 150,
    amountPaid: 150,
    paymentDate: '2026-08-02',
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    recordedBy: 'Operator Amit',
    remarks: 'Transferred to Panchayat account.',
    lastUpdated: '2026-08-02T11:20:00Z'
  }
];

export const paymentStatuses = [
  'Paid',
  'Pending',
  'Partially Paid',
  'Overdue'
];

export const paymentMethods = [
  'Cash',
  'UPI',
  'Bank Transfer',
  'Other'
];

export const billingPeriods = [
  'June 2026',
  'July 2026',
  'August 2026',
  'September 2026'
];

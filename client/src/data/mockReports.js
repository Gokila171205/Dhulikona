export const mockReportsHistory = [
  {
    id: 'RPT-001',
    reportType: 'Monthly Summary Report',
    generatedDate: '2026-08-01T09:00:00Z',
    generatedBy: 'Admin User',
    dateRange: 'July 2026',
    village: 'All Villages',
    district: 'All Districts',
    status: 'Completed'
  },
  {
    id: 'RPT-002',
    reportType: 'Complaint Report',
    generatedDate: '2026-08-05T14:30:00Z',
    generatedBy: 'Admin User',
    dateRange: 'Last 7 Days',
    village: 'Sonapur',
    district: 'All Districts',
    status: 'Completed'
  },
  {
    id: 'RPT-003',
    reportType: 'Fee Collection Report',
    generatedDate: '2026-08-10T11:15:00Z',
    generatedBy: 'Admin User',
    dateRange: 'Last 30 Days',
    village: 'All Villages',
    district: 'All Districts',
    status: 'Completed'
  },
  {
    id: 'RPT-004',
    reportType: 'Water Quality Report',
    generatedDate: '2026-08-12T16:45:00Z',
    generatedBy: 'Admin User',
    dateRange: 'Last 30 Days',
    village: 'Raha',
    district: 'All Districts',
    status: 'Completed'
  },
  {
    id: 'RPT-005',
    reportType: 'Pump & Maintenance Report',
    generatedDate: '2026-08-13T08:20:00Z',
    generatedBy: 'Admin User',
    dateRange: 'Last 7 Days',
    village: 'All Villages',
    district: 'All Districts',
    status: 'Failed'
  }
];

export const reportTypes = [
  'Village Performance Report',
  'Water Supply Report',
  'Water Quality Report',
  'Complaint Report',
  'Pump & Maintenance Report',
  'Fee Collection Report',
  'Monthly Summary Report'
];

export const dateRangeOptions = [
  'Last 7 Days',
  'Last 30 Days',
  'Last 3 Months',
  'Last 6 Months',
  'Year to Date'
];

// Mock data generator for previews based on report type
export const getMockReportPreviewData = (reportType, village, dateRange) => {
  // Returns generic aggregated mock data suitable for the preview section
  switch(reportType) {
    case 'Village Performance Report':
      return {
        summary: { totalVillages: 5, households: 850, pumps: 24, workingPumps: 21, supplyReliability: '92.5%', complaints: 45, collectionRate: '68.5%' },
        columns: ['Village', 'Households', 'Pumps', 'Working', 'Reliability', 'Complaints', 'Collection'],
        data: [
          { village: 'Sonapur', households: 250, pumps: 6, working: 6, reliability: '96%', complaints: 2, collection: '85%' },
          { village: 'Raha', households: 180, pumps: 5, working: 4, reliability: '88%', complaints: 5, collection: '60%' }
        ]
      };
    case 'Water Supply Report':
      return {
        summary: { scheduled: 150, completed: 138, missed: 12, cancelled: 0, reliability: '92.0%' },
        columns: ['Village', 'Scheduled', 'Completed', 'Missed', 'Reliability'],
        data: [
          { village: 'Sonapur', scheduled: 30, completed: 29, missed: 1, reliability: '96.6%' },
          { village: 'Raha', scheduled: 30, completed: 25, missed: 5, reliability: '83.3%' }
        ]
      };
    case 'Water Quality Report':
      return {
        summary: { totalTests: 120, safe: 105, needsAttention: 10, critical: 5 },
        columns: ['Village', 'Total Tests', 'Safe', 'Needs Attention', 'Critical'],
        data: [
          { village: 'Sonapur', total: 40, safe: 38, needsAttention: 2, critical: 0 },
          { village: 'Kamalpur', total: 35, safe: 25, needsAttention: 5, critical: 5 }
        ]
      };
    case 'Complaint Report':
      return {
        summary: { total: 45, new: 5, inProgress: 8, resolved: 20, closed: 10, overdue: 2 },
        columns: ['Category', 'Total', 'Resolved', 'Open', 'Avg Resolution Time (Days)'],
        data: [
          { category: 'No Water Supply', total: 15, resolved: 10, open: 5, time: 2.5 },
          { category: 'Pump Problem', total: 12, resolved: 8, open: 4, time: 3.1 }
        ]
      };
    case 'Pump & Maintenance Report':
      return {
        summary: { totalPumps: 24, working: 21, underMaintenance: 2, notWorking: 1, totalRecords: 35, completed: 26, pending: 8, overdue: 1 },
        columns: ['Village', 'Total Pumps', 'Working', 'Maint. Records', 'Pending Maint.'],
        data: [
          { village: 'Sonapur', pumps: 6, working: 6, records: 5, pending: 0 },
          { village: 'Raha', pumps: 5, working: 4, records: 8, pending: 2 }
        ]
      };
    case 'Fee Collection Report':
      return {
        summary: { amountDue: '₹1,27,500', amountCollected: '₹87,300', outstanding: '₹40,200', paidHouseholds: 582, pendingPayments: 268, collectionRate: '68.5%' },
        columns: ['Village', 'Amount Due', 'Collected', 'Outstanding', 'Rate'],
        data: [
          { village: 'Sonapur', due: '₹37,500', collected: '₹25,000', outstanding: '₹12,500', rate: '66.6%' },
          { village: 'Raha', due: '₹27,000', collected: '₹18,500', outstanding: '₹8,500', rate: '68.5%' }
        ]
      };
    case 'Monthly Summary Report':
      return {
        summary: { 
          period: dateRange,
          villages: 5, households: 850, pumps: 24, 
          supplyReliability: '92.5%', waterQualitySafe: '88%',
          complaintsResolved: '66%', maintenanceCompleted: '74%',
          collectionRate: '68.5%'
        },
        columns: ['Metric', 'Value', 'Status'],
        data: [
          { metric: 'Overall Supply Reliability', value: '92.5%', status: 'Good' },
          { metric: 'Water Quality Safe Rate', value: '88.0%', status: 'Warning' },
          { metric: 'Fee Collection Rate', value: '68.5%', status: 'Warning' }
        ]
      };
    default:
      return null;
  }
};

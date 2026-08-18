// src/services/mockData.js
import { 
  MapPin, 
  Users, 
  Droplet, 
  Wrench, 
  AlertTriangle, 
  CheckCircle, 
  IndianRupee, 
  Activity,
  Home,
  Settings
} from 'lucide-react';

export const dashboardMetrics = {
  totalVillages: { value: '24', icon: MapPin, color: 'text-gov-blue', bg: 'bg-gov-blue/10' },
  totalUsers: { value: '1,432', icon: Users, color: 'text-water-blue', bg: 'bg-water-blue/10' },
  totalHouseholds: { value: '8,450', icon: Home, color: 'text-indigo-600', bg: 'bg-indigo-600/10' },
  totalPumps: { value: '124', icon: Wrench, color: 'text-gray-600', bg: 'bg-gray-100' },
  workingPumps: { value: '108', icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
  pumpsUnderMaintenance: { value: '12', icon: Settings, color: 'text-warning', bg: 'bg-warning/10' },
  pendingComplaints: { value: '14', icon: AlertTriangle, color: 'text-danger', bg: 'bg-danger/10' },
  resolvedComplaints: { value: '118', icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
  waterSupplyReliability: { value: '94%', icon: Droplet, color: 'text-water-light', bg: 'bg-water-light/10' },
  waterQualityStatus: { value: '98% Safe', icon: Activity, color: 'text-success', bg: 'bg-success/10' },
  feeCollection: { value: '86%', icon: IndianRupee, color: 'text-green-600', bg: 'bg-green-600/10' }
};

export const waterSupplyData = [
  { name: 'Mon', supply: 42000, target: 45000 },
  { name: 'Tue', supply: 43500, target: 45000 },
  { name: 'Wed', supply: 45000, target: 45000 },
  { name: 'Thu', supply: 41000, target: 45000 },
  { name: 'Fri', supply: 46000, target: 45000 },
  { name: 'Sat', supply: 48000, target: 45000 },
  { name: 'Sun', supply: 44000, target: 45000 },
];

export const complaintsData = [
  { name: 'Resolved', value: 118, color: '#166534' },
  { name: 'Pending', value: 14, color: '#DC2626' },
  { name: 'In Progress', value: 10, color: '#D97706' },
];

export const pumpStatusData = [
  { name: 'Working', value: 108, color: '#166534' },
  { name: 'Under Maintenance', value: 12, color: '#D97706' },
  { name: 'Not Working', value: 4, color: '#DC2626' },
];

export const recentComplaints = [
  { id: 'CMP-1042', village: 'Sonapur', issue: 'Pump yielding muddy water', status: 'Pending', date: '2026-08-13', reporter: 'Ramesh Das' },
  { id: 'CMP-1041', village: 'Raha', issue: 'Low water pressure', status: 'In Progress', date: '2026-08-12', reporter: 'Sunita Devi' },
  { id: 'CMP-1040', village: 'Hajo', issue: 'Hand pump handle broken', status: 'Resolved', date: '2026-08-11', reporter: 'Kamal Barman' },
  { id: 'CMP-1039', village: 'Kamalpur', issue: 'No water supply for 2 days', status: 'Resolved', date: '2026-08-10', reporter: 'Biren Kalita' },
  { id: 'CMP-1038', village: 'Baihata', issue: 'Pipe leakage near school', status: 'Pending', date: '2026-08-13', reporter: 'Anjali Boro' },
];

export const recentActivity = [
  { id: 1, action: 'Complaint resolved', entity: 'CMP-1040 (Hajo)', time: '2 hours ago', user: 'Operator Raj' },
  { id: 2, action: 'Water quality tested', entity: 'Village: Kamalpur - pH 7.2', time: '4 hours ago', user: 'Tech Priya' },
  { id: 3, action: 'New pump installed', entity: 'Village: Sonapur', time: '1 day ago', user: 'Admin User' },
  { id: 4, action: 'Maintenance started', entity: 'Pump #15 (Raha)', time: '1 day ago', user: 'Operator Amit' },
  { id: 5, action: 'Payment received', entity: 'Rs 150 from Baihata', time: '1 day ago', user: 'System' },
];

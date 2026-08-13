export const mockVillages = [
  {
    id: 'VLG-2001',
    name: 'Sonapur',
    district: 'Kamrup Metropolitan',
    block: 'Dimoria',
    households: 450,
    population: 2100,
    pumps: 12,
    workingPumps: 10,
    pendingComplaints: 3,
    operator: 'Operator Raj',
    operatorId: 'USR-1002',
    waterSupplyStatus: 'Normal',
    status: 'Active'
  },
  {
    id: 'VLG-2002',
    name: 'Raha',
    district: 'Nagaon',
    block: 'Raha',
    households: 820,
    population: 4100,
    pumps: 24,
    workingPumps: 22,
    pendingComplaints: 5,
    operator: 'Operator Amit',
    operatorId: 'USR-1003',
    waterSupplyStatus: 'Interrupted',
    status: 'Active'
  },
  {
    id: 'VLG-2003',
    name: 'Hajo',
    district: 'Kamrup',
    block: 'Hajo',
    households: 630,
    population: 3200,
    pumps: 18,
    workingPumps: 18,
    pendingComplaints: 0,
    operator: 'Operator Raj',
    operatorId: 'USR-1002',
    waterSupplyStatus: 'Excellent',
    status: 'Active'
  },
  {
    id: 'VLG-2004',
    name: 'Kamalpur',
    district: 'Kamrup',
    block: 'Kamalpur',
    households: 340,
    population: 1800,
    pumps: 8,
    workingPumps: 6,
    pendingComplaints: 2,
    operator: 'Tech Priya',
    operatorId: 'USR-1007',
    waterSupplyStatus: 'Normal',
    status: 'Active'
  },
  {
    id: 'VLG-2005',
    name: 'Baihata',
    district: 'Kamrup',
    block: 'Baihata Chariali',
    households: 510,
    population: 2600,
    pumps: 14,
    workingPumps: 14,
    pendingComplaints: 1,
    operator: 'Tech Priya',
    operatorId: 'USR-1007',
    waterSupplyStatus: 'Normal',
    status: 'Inactive'
  }
];

export const districtsList = [
  'Kamrup',
  'Kamrup Metropolitan',
  'Nagaon',
  'Nalbari',
  'Barpeta',
  'Darrang',
  'Morigaon'
];

export const operatorsList = [
  { id: 'USR-1002', name: 'Operator Raj' },
  { id: 'USR-1003', name: 'Operator Amit' },
  { id: 'USR-1007', name: 'Tech Priya' }
];

import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import { Activity, AlertTriangle } from 'lucide-react';
import { 
  dashboardMetrics, 
  waterSupplyData, 
  complaintsData, 
  pumpStatusData, 
  recentComplaints, 
  recentActivity 
} from '../../services/mockData';

const AdminDashboard = () => {
  // Ordered metrics as requested
  const summaryCards = [
    { id: 'totalVillages', title: 'Total Villages', ...dashboardMetrics.totalVillages },
    { id: 'totalUsers', title: 'Total Users', ...dashboardMetrics.totalUsers },
    { id: 'totalHouseholds', title: 'Total Households', ...dashboardMetrics.totalHouseholds },
    { id: 'totalPumps', title: 'Total Pumps', ...dashboardMetrics.totalPumps },
    { id: 'workingPumps', title: 'Working Pumps', ...dashboardMetrics.workingPumps },
    { id: 'pumpsUnderMaintenance', title: 'Pumps Under Maintenance', ...dashboardMetrics.pumpsUnderMaintenance },
    { id: 'pendingComplaints', title: 'Pending Complaints', ...dashboardMetrics.pendingComplaints },
    { id: 'resolvedComplaints', title: 'Resolved Complaints', ...dashboardMetrics.resolvedComplaints },
    { id: 'waterSupplyReliability', title: 'Water Supply Reliability', ...dashboardMetrics.waterSupplyReliability },
    { id: 'waterQualityStatus', title: 'Water Quality Status', ...dashboardMetrics.waterQualityStatus },
    { id: 'feeCollection', title: 'Fee Collection', ...dashboardMetrics.feeCollection },
  ];

  const complaintColumns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Village', accessor: 'village' },
    { header: 'Issue', accessor: 'issue' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => {
        let variant = 'default';
        if (row.status === 'Resolved') variant = 'success';
        if (row.status === 'Pending') variant = 'danger';
        if (row.status === 'In Progress') variant = 'warning';
        return <Badge variant={variant}>{row.status}</Badge>;
      }
    },
    { header: 'Date', accessor: 'date' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
          <p className="text-gray-500 text-sm">System-wide monitoring overview</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {summaryCards.map((item) => (
          <Card key={item.id} className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-medium text-gray-500">{item.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{item.value}</h3>
            </div>
            <div className={`p-3 rounded-full ${item.bg} ${item.color}`}>
              <item.icon size={24} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Water Supply Performance */}
        <Card className="p-5 lg:col-span-2 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Water Supply Performance</h3>
          <div className="flex-1 min-h-[300px]">
            <BarChart 
              data={waterSupplyData} 
              xAxisKey="name" 
              dataKey="supply" 
              name="Supply (Liters)" 
              fill="#0085CA" 
            />
          </div>
        </Card>

        {/* Pump Status Chart */}
        <Card className="p-5 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pump Status</h3>
          <div className="flex-1 min-h-[300px] flex items-center justify-center">
            <PieChart data={pumpStatusData} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Complaints Table */}
        <Card className="p-5 lg:col-span-2 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Complaints</h3>
          </div>
          <div className="flex-1 overflow-auto">
            <Table columns={complaintColumns} data={recentComplaints} keyExtractor={(row) => row.id} />
          </div>
        </Card>

        {/* Complaint Statistics & Recent Activity */}
        <div className="space-y-6">
          <Card className="p-5 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Complaint Statistics</h3>
            <div className="flex-1 min-h-[250px] flex items-center justify-center">
              <PieChart data={complaintsData} />
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Activity size={20} className="text-gov-blue" />
              Recent System Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                  <div className="bg-gray-100 p-2 rounded-full mt-1 text-gray-600 flex-shrink-0">
                    <Activity size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1 truncate">{activity.entity}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-medium text-gray-500">{activity.time}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

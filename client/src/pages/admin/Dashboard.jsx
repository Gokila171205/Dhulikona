import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import { Activity, AlertTriangle, Users, Home, Map, CheckCircle, Clock } from 'lucide-react';
import api from '../../services/api';

const SkeletonCard = () => (
  <Card className="p-4 flex items-center justify-between animate-pulse border border-gray-100">
    <div className="space-y-2 flex-1">
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      <div className="h-8 bg-gray-300 rounded w-1/3"></div>
    </div>
    <div className="p-3 rounded-full bg-gray-200 h-12 w-12"></div>
  </Card>
);

const SkeletonChart = () => (
  <div className="w-full h-64 bg-gray-50 rounded-lg animate-pulse flex items-center justify-center border border-gray-100">
    <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-gov-blue animate-spin"></div>
  </div>
);

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/analytics/dashboard');
        setAnalytics(res.data);
      } catch (err) {
        setError('Unable to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [retryTrigger]);

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

  if (error) {
    return (
      <div className="p-8 text-center max-w-md mx-auto bg-red-50 text-red-700 rounded-lg border border-red-200 mt-10 space-y-4">
        <AlertTriangle className="mx-auto text-red-500" size={48} />
        <h3 className="text-lg font-bold">Error</h3>
        <p className="text-sm">{error}</p>
        <Button variant="primary" onClick={() => setRetryTrigger(prev => prev + 1)}>
          Retry Loading
        </Button>
      </div>
    );
  }

  // Map real data for available modules
  const summaryCards = [
    { id: 'totalUsers', title: 'Total Users', value: analytics?.users?.total ?? 0, icon: Users, bg: 'bg-blue-100', color: 'text-blue-600', available: true },
    { id: 'activeUsers', title: 'Active Users', value: analytics?.users?.active ?? 0, icon: Users, bg: 'bg-green-100', color: 'text-green-600', available: true },
    { id: 'inactiveUsers', title: 'Inactive Users', value: analytics?.users?.inactive ?? 0, icon: Users, bg: 'bg-red-100', color: 'text-red-600', available: true },
    
    { id: 'totalVillages', title: 'Total Villages', value: analytics?.villages?.total ?? 0, icon: Map, bg: 'bg-indigo-100', color: 'text-indigo-600', available: true },
    { id: 'activeVillages', title: 'Active Villages', value: analytics?.villages?.active ?? 0, icon: Map, bg: 'bg-green-100', color: 'text-green-600', available: true },
    { id: 'inactiveVillages', title: 'Inactive Villages', value: analytics?.villages?.inactive ?? 0, icon: Map, bg: 'bg-red-100', color: 'text-red-600', available: true },

    { id: 'totalHouseholds', title: 'Total Households', value: analytics?.households?.total ?? 0, icon: Home, bg: 'bg-teal-100', color: 'text-teal-600', available: true },
    
    // Future modules with backend available checks
    { 
      id: 'totalPumps', 
      title: 'Total Pumps', 
      value: analytics?.pumps?.available ? (analytics?.pumps?.total ?? 0) : 'Data not available', 
      icon: Activity, 
      bg: 'bg-gray-100', 
      color: 'text-gray-400', 
      available: !!analytics?.pumps?.available 
    },
    { 
      id: 'workingPumps', 
      title: 'Working Pumps', 
      value: analytics?.pumps?.available ? (analytics?.pumps?.working ?? 0) : 'Data not available', 
      icon: CheckCircle, 
      bg: 'bg-gray-100', 
      color: 'text-gray-400', 
      available: !!analytics?.pumps?.available 
    },
    { 
      id: 'pumpsUnderMaintenance', 
      title: 'Pumps Under Maintenance', 
      value: analytics?.pumps?.available ? (analytics?.pumps?.maintenance ?? 0) : 'Data not available', 
      icon: AlertTriangle, 
      bg: 'bg-gray-100', 
      color: 'text-gray-400', 
      available: !!analytics?.pumps?.available 
    },
    { 
      id: 'pendingComplaints', 
      title: 'Pending Complaints', 
      value: analytics?.complaints?.available ? (analytics?.complaints?.pending ?? 0) : 'Data not available', 
      icon: Clock, 
      bg: 'bg-gray-100', 
      color: 'text-gray-400', 
      available: !!analytics?.complaints?.available 
    },
    { 
      id: 'resolvedComplaints', 
      title: 'Resolved Complaints', 
      value: analytics?.complaints?.available ? (analytics?.complaints?.resolved ?? 0) : 'Data not available', 
      icon: CheckCircle, 
      bg: 'bg-gray-100', 
      color: 'text-gray-400', 
      available: !!analytics?.complaints?.available 
    },
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
        {loading
          ? Array.from({ length: 12 }).map((_, index) => <SkeletonCard key={index} />)
          : summaryCards.map((item) => (
              <Card key={item.id} className={`p-4 flex items-center justify-between transition-shadow ${item.available ? 'hover:shadow-md' : 'opacity-75'}`}>
                <div>
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    {item.title}
                    {!item.available && <Badge variant="default" className="text-[10px]">Coming Soon</Badge>}
                  </p>
                  <h3 className={`text-2xl font-bold mt-1 ${item.available ? 'text-gray-900' : 'text-gray-400'}`}>{item.value}</h3>
                </div>
                <div className={`p-3 rounded-full ${item.bg} ${item.color}`}>
                  <item.icon size={24} />
                </div>
              </Card>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real Users Role Chart */}
        <Card className="p-5 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Users by Role</h3>
          <div className="flex-1 min-h-[300px] flex items-center justify-center">
            {loading ? (
              <SkeletonChart />
            ) : analytics?.charts?.usersByRole ? (
              <PieChart data={[
                { name: 'Admins', value: analytics.charts.usersByRole.admins, color: '#ef4444' },
                { name: 'Operators', value: analytics.charts.usersByRole.operators, color: '#3b82f6' },
                { name: 'Villagers', value: analytics.charts.usersByRole.villagers, color: '#10b981' }
              ].filter(d => d.value > 0)} />
            ) : (
              <p className="text-gray-400 text-sm">No data available</p>
            )}
          </div>
        </Card>

        {/* Real Villages Status Chart */}
        <Card className="p-5 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Villages by Status</h3>
          <div className="flex-1 min-h-[300px] flex items-center justify-center">
            {loading ? (
              <SkeletonChart />
            ) : analytics?.charts?.villagesByStatus ? (
              <PieChart data={[
                { name: 'Active', value: analytics.charts.villagesByStatus.active, color: '#10b981' },
                { name: 'Inactive', value: analytics.charts.villagesByStatus.inactive, color: '#f59e0b' }
              ].filter(d => d.value > 0)} />
            ) : (
              <p className="text-gray-400 text-sm">No data available</p>
            )}
          </div>
        </Card>

        {/* Placeholder for Water Supply */}
        <Card className="p-5 flex flex-col relative overflow-hidden bg-gray-50 border-dashed border-gray-300">
          {(!loading && !analytics?.waterSupply?.available) && (
            <div className="absolute inset-0 bg-white/50 z-10 flex flex-col items-center justify-center backdrop-blur-[1px]">
              <Badge variant="default" className="mb-2">Coming Soon</Badge>
              <p className="text-sm font-medium text-gray-600 text-center px-4">Water Supply tracking will be available in Phase 2.</p>
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-800 mb-4 opacity-30">Water Supply Performance</h3>
          <div className="flex-1 min-h-[250px] opacity-20">
            {loading ? (
              <SkeletonChart />
            ) : (
              <BarChart 
                data={[{name: 'Jan', supply: 100}, {name: 'Feb', supply: 120}]} 
                xAxisKey="name" 
                dataKey="supply" 
                name="Supply (Liters)" 
                fill="#0085CA" 
              />
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placeholder for Complaints */}
        <Card className="p-5 overflow-hidden flex flex-col relative bg-gray-50 border-dashed border-gray-300">
          {(!loading && !analytics?.complaints?.available) && (
            <div className="absolute inset-0 bg-white/50 z-10 flex flex-col items-center justify-center backdrop-blur-[1px]">
              <Badge variant="default" className="mb-2">Coming Soon</Badge>
              <p className="text-sm font-medium text-gray-600 text-center px-4">Complaint Management will be available in Phase 2.</p>
            </div>
          )}
          <div className="flex items-center justify-between mb-4 opacity-30">
            <h3 className="text-lg font-semibold text-gray-800">Recent Complaints</h3>
          </div>
          <div className="flex-1 overflow-auto opacity-30">
            {loading ? (
              <div className="h-32 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <Table columns={complaintColumns} data={[]} keyExtractor={(row) => row.id} />
            )}
          </div>
        </Card>

        {/* System Activity */}
        <Card className="p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Activity size={20} className="text-gov-blue" />
            System Activity Tracking
          </h3>
          <div className="flex-1 min-h-[200px] flex flex-col items-center justify-center text-center p-6 bg-blue-50 rounded-lg border border-blue-100">
            <Activity size={32} className="text-blue-300 mb-2" />
            <p className="text-gray-600 text-sm">System activity is tracked centrally via Audit Logs.</p>
            <p className="text-gov-blue font-medium mt-2 cursor-pointer hover:underline" onClick={() => window.location.href='/admin/audit-logs'}>
              View Audit Logs →
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

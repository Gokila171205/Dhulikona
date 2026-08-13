import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import Card from '../../components/ui/Card';
import { MapPin, Users, Droplet, Wrench, AlertTriangle, CheckCircle, IndianRupee, Activity } from 'lucide-react';

const AdminDashboard = () => {
  // Mock Data
  const summaryData = [
    { title: 'Total Villages', value: '24', icon: MapPin, color: 'text-gov-blue', bg: 'bg-gov-blue/10' },
    { title: 'Total Users', value: '1,432', icon: Users, color: 'text-water-blue', bg: 'bg-water-blue/10' },
    { title: 'Total Pumps', value: '86', icon: Wrench, color: 'text-indigo-600', bg: 'bg-indigo-600/10' },
    { title: 'Working Pumps', value: '72', icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
    { title: 'Pending Complaints', value: '14', icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
    { title: 'Water Quality Alerts', value: '2', icon: Activity, color: 'text-danger', bg: 'bg-danger/10' },
    { title: 'Daily Supply (L)', value: '45,000', icon: Droplet, color: 'text-water-light', bg: 'bg-water-light/10' },
    { title: 'Fee Collection', value: '86%', icon: IndianRupee, color: 'text-green-600', bg: 'bg-green-600/10' },
  ];

  const waterSupplyData = [
    { name: 'Mon', supply: 42000 },
    { name: 'Tue', supply: 43500 },
    { name: 'Wed', supply: 45000 },
    { name: 'Thu', supply: 41000 },
    { name: 'Fri', supply: 46000 },
    { name: 'Sat', supply: 48000 },
    { name: 'Sun', supply: 44000 },
  ];

  const complaintsData = [
    { name: 'Resolved', value: 118 },
    { name: 'Pending', value: 14 },
    { name: 'In Progress', value: 10 },
  ];
  
  const COLORS = ['#166534', '#DC2626', '#D97706'];

  const recentActivity = [
    { id: 1, action: 'Complaint resolved', entity: 'Pump #42 (Sonapur)', time: '2 hours ago', user: 'Operator Raj' },
    { id: 2, action: 'Water quality tested', entity: 'Village: Kamalpur - pH 7.2', time: '4 hours ago', user: 'Tech Priya' },
    { id: 3, action: 'New pump installed', entity: 'Village: Hajo', time: '1 day ago', user: 'Admin User' },
    { id: 4, action: 'Maintenance started', entity: 'Pump #15 (Raha)', time: '1 day ago', user: 'Operator Amit' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
          <p className="text-gray-500 text-sm">Overview of JalTrack system performance</p>
        </div>
        <div className="text-sm bg-white border border-gray-200 px-4 py-2 rounded-md shadow-sm">
          <span className="font-medium">Date: </span> {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryData.map((item, index) => (
          <Card key={index} className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
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
        {/* Water Supply Chart */}
        <Card className="p-5 lg:col-span-2 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Water Supply Performance</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterSupplyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                <Tooltip 
                  cursor={{ fill: '#F3F4F6' }} 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Bar dataKey="supply" fill="#0085CA" radius={[4, 4, 0, 0]} name="Supply (Liters)" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Complaints Chart */}
        <Card className="p-5 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Complaint Status</h3>
          <div className="flex-1 min-h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={complaintsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {complaintsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity List */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent System Activity</h3>
            <button className="text-sm text-gov-blue hover:underline font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                <div className="bg-gray-100 p-2 rounded-full mt-1 text-gray-600">
                  <Activity size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.entity}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-500">{activity.time}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.user}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Alerts/Notifications */}
        <Card className="p-5 bg-gov-blue text-white">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle size={20} className="text-warning" />
            Attention Required
          </h3>
          <ul className="space-y-3">
            <li className="bg-white/10 p-3 rounded-md border border-white/20">
              <p className="font-medium text-sm">Pump failure in Sonapur Village</p>
              <p className="text-xs text-blue-200 mt-1">Reported 2 hours ago. Affecting 45 households.</p>
            </li>
            <li className="bg-white/10 p-3 rounded-md border border-white/20">
              <p className="font-medium text-sm">Low fee collection in Raha</p>
              <p className="text-xs text-blue-200 mt-1">Current collection is at 45% for the month.</p>
            </li>
            <li className="bg-white/10 p-3 rounded-md border border-white/20">
              <p className="font-medium text-sm">Pending Verification</p>
              <p className="text-xs text-blue-200 mt-1">3 new users waiting for approval.</p>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

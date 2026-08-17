import React, { useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Droplets,
  Wrench,
  Clock,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import api from '../../api/axios';

const statusStyles = {
  Working: 'bg-green-50 text-green-700',
  'Not Working': 'bg-red-50 text-red-700',
  'Under Maintenance': 'bg-orange-50 text-orange-700',
  Unavailable: 'bg-slate-100 text-slate-700',
  Submitted: 'bg-orange-50 text-orange-700',
  Verified: 'bg-blue-50 text-blue-700',
  'Maintenance Started': 'bg-blue-50 text-blue-700',
  Completed: 'bg-green-50 text-green-700',
  Upcoming: 'bg-blue-50 text-blue-700',
  'In Progress': 'bg-blue-50 text-blue-700',
};

const StatusBadge = ({ status }) => {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${
        statusStyles[status] || 'bg-slate-100 text-slate-700'
      }`}
    >
      {status}
    </span>
  );
};

const formatTimeAgo = (dateString) => {
  const now = new Date();
  const then = new Date(dateString);
  const diffMs = now - then;

  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  return `${diffDays} days ago`;
};

const Dashboard = () => {
  const [pumps, setPumps] = useState([]);
  const [supplyRecords, setSupplyRecords] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);

      const [pumpsRes, supplyRes, complaintsRes, maintenanceRes] =
        await Promise.all([
          api.get('/pumps'),
          api.get('/water-supply'),
          api.get('/complaints'),
          api.get('/maintenance'),
        ]);

      setPumps(pumpsRes.data);
      setSupplyRecords(supplyRes.data);
      setComplaints(complaintsRes.data);
      setMaintenanceRecords(maintenanceRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const workingPumps = pumps.filter(
    (p) => p.status === 'Working'
  ).length;

  const todaySupplyRecords = supplyRecords.filter(
    (record) => record.date === today
  );

  const pendingComplaints = complaints.filter(
    (c) =>
      c.status === 'Submitted' ||
      c.status === 'Verified'
  ).length;

  const activeMaintenance = maintenanceRecords.filter(
    (r) =>
      r.status === 'Scheduled' ||
      r.status === 'In Progress'
  ).length;

  const recentComplaints = [...complaints]
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .slice(0, 5);

  const stats = [
    {
      title: 'Total Pumps',
      value: String(pumps.length),
      description: `${workingPumps} working`,
      icon: Activity,
    },
    {
      title: "Today's Supply",
      value: String(todaySupplyRecords.length),
      description: 'Supply sessions',
      icon: Droplets,
    },
    {
      title: 'Pending Complaints',
      value: String(pendingComplaints),
      description: 'Need attention',
      icon: AlertTriangle,
    },
    {
      title: 'Active Maintenance',
      value: String(activeMaintenance),
      description: 'Currently active',
      icon: Wrench,
    },
  ];

  return (
    <div className="min-h-full bg-[#F8FAFC] p-6">

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0F172A]">
          Operator Dashboard
        </h1>

        <p className="mt-1 text-sm text-[#64748B]">
          Monitor and manage your village water system.
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-12 text-center text-sm text-[#64748B]">
          Loading dashboard...
        </div>
      ) : (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#64748B]">
                        {stat.title}
                      </p>

                      <p className="mt-2 text-3xl font-bold text-[#0F172A]">
                        {stat.value}
                      </p>

                      <p className="mt-1 text-xs text-[#64748B]">
                        {stat.description}
                      </p>
                    </div>

                    <div className="rounded-lg bg-[#E0F2FE] p-2.5">
                      <Icon
                        size={21}
                        className="text-[#0284C7]"
                        strokeWidth={2}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Grid */}
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">

            {/* Pump Status */}
            <section className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
                <div>
                  <h2 className="text-lg font-semibold text-[#0F172A]">
                    Pump Status
                  </h2>

                  <p className="mt-1 text-xs text-[#64748B]">
                    Current status of village pumps
                  </p>
                </div>

                <Activity
                  size={20}
                  className="text-[#0F766E]"
                />
              </div>

              <div className="divide-y divide-[#E2E8F0]">
                {pumps.length > 0 ? (
                  pumps.map((pump) => (
                    <div
                      key={pump._id}
                      className="flex items-center justify-between gap-4 px-5 py-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#0F172A]">
                          {pump.name}
                        </p>

                        <p className="mt-1 text-xs text-[#64748B]">
                          {pump.type}
                        </p>
                      </div>

                      <StatusBadge status={pump.status} />
                    </div>
                  ))
                ) : (
                  <p className="px-5 py-6 text-center text-sm text-[#64748B]">
                    No pumps added yet.
                  </p>
                )}
              </div>

              <div className="border-t border-[#E2E8F0] px-5 py-3">
                <a
                  href="/operator/pumps"
                  className="inline-flex items-center gap-1 text-sm font-medium text-[#0F766E] hover:text-[#115E59]"
                >
                  Manage Pumps
                  <ArrowRight size={16} />
                </a>
              </div>
            </section>

            {/* Today's Supply */}
            <section className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
                <div>
                  <h2 className="text-lg font-semibold text-[#0F172A]">
                    Today's Water Supply
                  </h2>

                  <p className="mt-1 text-xs text-[#64748B]">
                    Scheduled supply sessions
                  </p>
                </div>

                <Droplets
                  size={20}
                  className="text-[#0284C7]"
                />
              </div>

              <div className="divide-y divide-[#E2E8F0]">
                {todaySupplyRecords.length > 0 ? (
                  todaySupplyRecords.map((supply) => (
                    <div
                      key={supply._id}
                      className="flex items-center justify-between gap-4 px-5 py-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-md bg-[#E0F2FE] p-2">
                          <Clock
                            size={16}
                            className="text-[#0284C7]"
                          />
                        </div>

                        <div>
                          <p className="text-sm font-medium text-[#0F172A]">
                            {supply.startTime} - {supply.endTime}
                          </p>

                          <p className="mt-1 text-xs text-[#64748B]">
                            {supply.area}
                          </p>
                        </div>
                      </div>

                      <StatusBadge status={supply.status} />
                    </div>
                  ))
                ) : (
                  <p className="px-5 py-6 text-center text-sm text-[#64748B]">
                    No supply sessions scheduled for today.
                  </p>
                )}
              </div>

              <div className="border-t border-[#E2E8F0] px-5 py-3">
                <a
                  href="/operator/water-supply"
                  className="inline-flex items-center gap-1 text-sm font-medium text-[#0F766E] hover:text-[#115E59]"
                >
                  Manage Supply
                  <ArrowRight size={16} />
                </a>
              </div>
            </section>
          </div>

          {/* Complaints */}
          <section className="mt-6 rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-[#0F172A]">
                  Recent Complaints
                </h2>

                <p className="mt-1 text-xs text-[#64748B]">
                  Complaints requiring operator attention
                </p>
              </div>

              <AlertTriangle
                size={20}
                className="text-[#D97706]"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px]">
                <thead>
                  <tr className="bg-[#F8FAFC] text-left">
                    <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                      Complaint
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                      Location
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                      Status
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                      Reported
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E2E8F0]">
                  {recentComplaints.length > 0 ? (
                    recentComplaints.map((complaint) => (
                      <tr
                        key={complaint._id}
                        className="hover:bg-[#F8FAFC]"
                      >
                        <td className="px-5 py-4 text-sm font-medium text-[#0F172A]">
                          {complaint.title}
                        </td>

                        <td className="px-5 py-4 text-sm text-[#64748B]">
                          {complaint.village?.name || 'Unknown'}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={complaint.status} />
                        </td>

                        <td className="px-5 py-4 text-sm text-[#64748B]">
                          {formatTimeAgo(complaint.createdAt)}
                        </td>

                        <td className="px-5 py-4">
                          <a
                            href="/operator/complaints"
                            className="text-sm font-medium text-[#0F766E] hover:text-[#115E59]"
                          >
                            View
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-5 py-8 text-center text-sm text-[#64748B]"
                      >
                        No complaints yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-[#E2E8F0] px-5 py-3">
              <div className="flex items-center gap-2 text-xs text-[#64748B]">
                <CheckCircle2
                  size={15}
                  className="text-[#16A34A]"
                />
                Keep complaints updated for better accountability.
              </div>

              <a
                href="/operator/complaints"
                className="inline-flex items-center gap-1 text-sm font-medium text-[#0F766E] hover:text-[#115E59]"
              >
                View All
                <ArrowRight size={16} />
              </a>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard;
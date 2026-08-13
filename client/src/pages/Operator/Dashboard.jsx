import React from 'react';
import {
  Activity,
  AlertTriangle,
  Droplets,
  Wrench,
  Clock,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

const stats = [
  {
    title: 'Total Pumps',
    value: '4',
    description: '3 working',
    icon: Activity,
  },
  {
    title: "Today's Supply",
    value: '2',
    description: 'Supply sessions',
    icon: Droplets,
  },
  {
    title: 'Pending Complaints',
    value: '5',
    description: 'Need attention',
    icon: AlertTriangle,
  },
  {
    title: 'Active Maintenance',
    value: '1',
    description: 'Currently active',
    icon: Wrench,
  },
];

const pumps = [
  {
    name: 'Main Village Pump',
    type: 'Submersible',
    status: 'Working',
  },
  {
    name: 'North Area Pump',
    type: 'Hand Pump',
    status: 'Working',
  },
  {
    name: 'School Pump',
    type: 'Submersible',
    status: 'Under Maintenance',
  },
  {
    name: 'Community Pump',
    type: 'Hand Pump',
    status: 'Not Working',
  },
];

const complaints = [
  {
    title: 'No water supply',
    location: 'Main Village',
    status: 'Submitted',
    time: '10 minutes ago',
  },
  {
    title: 'Low water pressure',
    location: 'North Area',
    status: 'Verified',
    time: '1 hour ago',
  },
  {
    title: 'Pump stopped working',
    location: 'School Area',
    status: 'Maintenance Started',
    time: '2 hours ago',
  },
];

const supplySchedule = [
  {
    time: '06:00 AM - 08:00 AM',
    area: 'Main Village',
    status: 'Completed',
  },
  {
    time: '12:00 PM - 01:00 PM',
    area: 'North Area',
    status: 'Upcoming',
  },
  {
    time: '05:00 PM - 07:00 PM',
    area: 'Main Village',
    status: 'Upcoming',
  },
];

const statusStyles = {
  Working: 'bg-green-50 text-green-700',
  'Not Working': 'bg-red-50 text-red-700',
  'Under Maintenance': 'bg-orange-50 text-orange-700',
  Submitted: 'bg-orange-50 text-orange-700',
  Verified: 'bg-blue-50 text-blue-700',
  'Maintenance Started': 'bg-blue-50 text-blue-700',
  Completed: 'bg-green-50 text-green-700',
  Upcoming: 'bg-blue-50 text-blue-700',
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

const Dashboard = () => {
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

            <Activity size={20} className="text-[#0F766E]" />
          </div>

          <div className="divide-y divide-[#E2E8F0]">
            {pumps.map((pump) => (
              <div
                key={pump.name}
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
            ))}
          </div>

          <div className="border-t border-[#E2E8F0] px-5 py-3">
            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#0F766E] hover:text-[#115E59]"
            >
              Manage Pumps
              <ArrowRight size={16} />
            </button>
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

            <Droplets size={20} className="text-[#0284C7]" />
          </div>

          <div className="divide-y divide-[#E2E8F0]">
            {supplySchedule.map((supply) => (
              <div
                key={`${supply.time}-${supply.area}`}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-md bg-[#E0F2FE] p-2">
                    <Clock size={16} className="text-[#0284C7]" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-[#0F172A]">
                      {supply.time}
                    </p>

                    <p className="mt-1 text-xs text-[#64748B]">
                      {supply.area}
                    </p>
                  </div>
                </div>

                <StatusBadge status={supply.status} />
              </div>
            ))}
          </div>

          <div className="border-t border-[#E2E8F0] px-5 py-3">
            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#0F766E] hover:text-[#115E59]"
            >
              Manage Supply
              <ArrowRight size={16} />
            </button>
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

          <AlertTriangle size={20} className="text-[#D97706]" />
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
              {complaints.map((complaint) => (
                <tr
                  key={`${complaint.title}-${complaint.location}`}
                  className="hover:bg-[#F8FAFC]"
                >
                  <td className="px-5 py-4 text-sm font-medium text-[#0F172A]">
                    {complaint.title}
                  </td>

                  <td className="px-5 py-4 text-sm text-[#64748B]">
                    {complaint.location}
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={complaint.status} />
                  </td>

                  <td className="px-5 py-4 text-sm text-[#64748B]">
                    {complaint.time}
                  </td>

                  <td className="px-5 py-4">
                    <button
                      type="button"
                      className="text-sm font-medium text-[#0F766E] hover:text-[#115E59]"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[#E2E8F0] px-5 py-3">
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <CheckCircle2 size={15} className="text-[#16A34A]" />
            Keep complaints updated for better accountability.
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm font-medium text-[#0F766E] hover:text-[#115E59]"
          >
            View All
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
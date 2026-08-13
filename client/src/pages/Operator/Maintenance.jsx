import React, { useState } from 'react';
import {
  CalendarDays,
  CheckCircle,
  Clock,
  Plus,
  Search,
  Wrench,
} from 'lucide-react';

const initialMaintenance = [
  {
    id: 1,
    pump: 'Main Village Pump',
    issue: 'Motor overheating',
    priority: 'High',
    status: 'In Progress',
    scheduledDate: '2026-08-14',
    technician: 'Village Maintenance Team',
    notes: 'Motor requires inspection.',
  },
  {
    id: 2,
    pump: 'North Area Pump',
    issue: 'Low water pressure',
    priority: 'Medium',
    status: 'Scheduled',
    scheduledDate: '2026-08-15',
    technician: 'Village Maintenance Team',
    notes: 'Check pipe connection.',
  },
  {
    id: 3,
    pump: 'Community Pump',
    issue: 'Pump stopped',
    priority: 'High',
    status: 'Completed',
    scheduledDate: '2026-08-11',
    technician: 'Village Maintenance Team',
    notes: 'Motor replaced successfully.',
  },
];

const statusStyles = {
  Scheduled: 'bg-blue-50 text-blue-700',
  'In Progress': 'bg-orange-50 text-orange-700',
  Completed: 'bg-green-50 text-green-700',
};

const priorityStyles = {
  High: 'bg-red-50 text-red-700',
  Medium: 'bg-orange-50 text-orange-700',
  Low: 'bg-green-50 text-green-700',
};

const Maintenance = () => {
  const [records, setRecords] = useState(initialMaintenance);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    pump: '',
    issue: '',
    priority: 'Medium',
    scheduledDate: '',
    technician: '',
    notes: '',
  });

  const filteredRecords = records.filter((record) => {
    const text = search.toLowerCase();

    return (
      record.pump.toLowerCase().includes(text) ||
      record.issue.toLowerCase().includes(text)
    );
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.pump ||
      !formData.issue ||
      !formData.scheduledDate
    ) {
      alert('Please fill all required fields.');
      return;
    }

    const newRecord = {
      id: Date.now(),
      ...formData,
      status: 'Scheduled',
    };

    setRecords((previous) => [
      newRecord,
      ...previous,
    ]);

    setFormData({
      pump: '',
      issue: '',
      priority: 'Medium',
      scheduledDate: '',
      technician: '',
      notes: '',
    });

    setShowForm(false);
  };

  const markCompleted = (id) => {
    setRecords((previous) =>
      previous.map((record) =>
        record.id === id
          ? { ...record, status: 'Completed' }
          : record
      )
    );
  };

  return (
    <div className="min-h-full bg-[#F8FAFC] p-6">

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">
            Maintenance
          </h1>

          <p className="mt-1 text-sm text-[#64748B]">
            Schedule and track water-system maintenance.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#0F766E] px-4 text-sm font-medium text-white hover:bg-[#115E59]"
        >
          <Plus size={18} />
          Schedule Maintenance
        </button>

      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#64748B]">
            Scheduled
          </p>

          <p className="mt-2 text-2xl font-bold">
            {records.filter(
              (r) => r.status === 'Scheduled'
            ).length}
          </p>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#64748B]">
            In Progress
          </p>

          <p className="mt-2 text-2xl font-bold">
            {records.filter(
              (r) => r.status === 'In Progress'
            ).length}
          </p>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#64748B]">
            Completed
          </p>

          <p className="mt-2 text-2xl font-bold">
            {records.filter(
              (r) => r.status === 'Completed'
            ).length}
          </p>
        </div>

      </div>

      <section className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm">

        <div className="border-b border-[#E2E8F0] p-5">

          <h2 className="text-lg font-semibold">
            Maintenance Records
          </h2>

          <div className="relative mt-4 max-w-md">

            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]"
            />

            <input
              type="text"
              placeholder="Search pump or issue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-[#E2E8F0] pl-9 pr-3 text-sm outline-none focus:border-[#0F766E]"
            />

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px]">

            <thead>
              <tr className="bg-[#F8FAFC] text-left">

                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  Pump
                </th>

                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  Issue
                </th>

                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  Priority
                </th>

                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  Scheduled
                </th>

                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  Status
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold text-[#64748B]">
                  Action
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-[#E2E8F0]">

              {filteredRecords.map((record) => (

                <tr
                  key={record.id}
                  className="hover:bg-[#F8FAFC]"
                >

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div className="rounded-lg bg-[#E0F2FE] p-2">
                        <Wrench
                          size={17}
                          className="text-[#0284C7]"
                        />
                      </div>

                      <span className="text-sm font-medium">
                        {record.pump}
                      </span>

                    </div>

                  </td>

                  <td className="px-5 py-4 text-sm text-[#64748B]">
                    {record.issue}
                  </td>

                  <td className="px-5 py-4">

                    <span
                      className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                        priorityStyles[record.priority]
                      }`}
                    >
                      {record.priority}
                    </span>

                  </td>

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2 text-sm text-[#64748B]">
                      <CalendarDays size={15} />
                      {record.scheduledDate}
                    </div>

                  </td>

                  <td className="px-5 py-4">

                    <span
                      className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                        statusStyles[record.status]
                      }`}
                    >
                      {record.status}
                    </span>

                  </td>

                  <td className="px-5 py-4 text-right">

                    {record.status !== 'Completed' && (

                      <button
                        onClick={() =>
                          markCompleted(record.id)
                        }
                        className="inline-flex items-center gap-1.5 rounded-md border border-[#E2E8F0] px-3 py-1.5 text-sm font-medium hover:border-[#16A34A] hover:text-[#16A34A]"
                      >
                        <CheckCircle size={15} />
                        Complete
                      </button>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>

      {/* Form Modal */}
      {showForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">

          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">

            <div className="border-b border-[#E2E8F0] p-5">

              <h2 className="text-lg font-semibold">
                Schedule Maintenance
              </h2>

              <p className="mt-1 text-xs text-[#64748B]">
                Create a maintenance task for a pump or water system.
              </p>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="space-y-4 p-5">

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Pump
                  </label>

                  <select
                    name="pump"
                    value={formData.pump}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-[#E2E8F0] px-3 text-sm outline-none focus:border-[#0F766E]"
                  >
                    <option value="">Select pump</option>
                    <option>Main Village Pump</option>
                    <option>North Area Pump</option>
                    <option>School Pump</option>
                    <option>Community Pump</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Issue
                  </label>

                  <input
                    name="issue"
                    value={formData.issue}
                    onChange={handleChange}
                    placeholder="Describe the issue"
                    className="h-10 w-full rounded-lg border border-[#E2E8F0] px-3 text-sm outline-none focus:border-[#0F766E]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Priority
                    </label>

                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="h-10 w-full rounded-lg border border-[#E2E8F0] px-3 text-sm outline-none focus:border-[#0F766E]"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Scheduled Date
                    </label>

                    <input
                      type="date"
                      name="scheduledDate"
                      value={formData.scheduledDate}
                      onChange={handleChange}
                      className="h-10 w-full rounded-lg border border-[#E2E8F0] px-3 text-sm outline-none focus:border-[#0F766E]"
                    />
                  </div>

                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Maintenance Team
                  </label>

                  <input
                    name="technician"
                    value={formData.technician}
                    onChange={handleChange}
                    placeholder="e.g. Village Maintenance Team"
                    className="h-10 w-full rounded-lg border border-[#E2E8F0] px-3 text-sm outline-none focus:border-[#0F766E]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Notes
                  </label>

                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Additional notes..."
                    className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm outline-none focus:border-[#0F766E]"
                  />
                </div>

              </div>

              <div className="flex justify-end gap-3 border-t border-[#E2E8F0] p-5">

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="h-10 rounded-lg border border-[#E2E8F0] px-4 text-sm font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="h-10 rounded-lg bg-[#0F766E] px-4 text-sm font-medium text-white hover:bg-[#115E59]"
                >
                  Schedule
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Maintenance;
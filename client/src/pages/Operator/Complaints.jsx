import React, { useMemo, useState } from 'react';
import {
  CheckCircle,
  Clock,
  Eye,
  FileWarning,
  Search,
  Wrench,
  XCircle,
} from 'lucide-react';

const initialComplaints = [
  {
    id: 1,
    title: 'No water supply',
    description: 'No water has been supplied to the household since morning.',
    reportedBy: 'Anita Das',
    village: 'Borbari',
    date: '2026-08-13',
    status: 'Submitted',
    priority: 'High',
  },
  {
    id: 2,
    title: 'Low water pressure',
    description: 'Water pressure is very low in the north area.',
    reportedBy: 'Rakesh Das',
    village: 'Borbari',
    date: '2026-08-12',
    status: 'Verified',
    priority: 'Medium',
  },
  {
    id: 3,
    title: 'Pump not working',
    description: 'The community pump has stopped working.',
    reportedBy: 'Mina Devi',
    village: 'Borbari',
    date: '2026-08-11',
    status: 'Maintenance Started',
    priority: 'High',
  },
  {
    id: 4,
    title: 'Irregular water timing',
    description: 'Water supply timing has been inconsistent.',
    reportedBy: 'Rahul Das',
    village: 'Borbari',
    date: '2026-08-09',
    status: 'Resolved',
    priority: 'Low',
  },
];

const statusStyles = {
  Submitted: 'bg-orange-50 text-orange-700',
  Verified: 'bg-blue-50 text-blue-700',
  'Maintenance Started': 'bg-orange-50 text-orange-700',
  Resolved: 'bg-green-50 text-green-700',
  Confirmed: 'bg-green-50 text-green-700',
};

const priorityStyles = {
  High: 'bg-red-50 text-red-700',
  Medium: 'bg-orange-50 text-orange-700',
  Low: 'bg-green-50 text-green-700',
};

const Complaints = () => {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        complaint.title.toLowerCase().includes(searchText) ||
        complaint.reportedBy.toLowerCase().includes(searchText) ||
        complaint.village.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === 'All' ||
        complaint.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [complaints, search, statusFilter]);

  const updateStatus = (id, status) => {
    setComplaints((previous) =>
      previous.map((complaint) =>
        complaint.id === id
          ? { ...complaint, status }
          : complaint
      )
    );

    setSelectedComplaint((previous) =>
      previous
        ? { ...previous, status }
        : previous
    );
  };

  return (
    <div className="min-h-full bg-[#F8FAFC] p-6">

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0F172A]">
          Complaint Verification
        </h1>

        <p className="mt-1 text-sm text-[#64748B]">
          Verify complaints and track resolution progress.
        </p>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#64748B]">
            Pending Verification
          </p>

          <p className="mt-2 text-2xl font-bold text-[#0F172A]">
            {complaints.filter(
              (c) => c.status === 'Submitted'
            ).length}
          </p>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#64748B]">
            Under Maintenance
          </p>

          <p className="mt-2 text-2xl font-bold text-[#0F172A]">
            {complaints.filter(
              (c) => c.status === 'Maintenance Started'
            ).length}
          </p>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#64748B]">
            Resolved
          </p>

          <p className="mt-2 text-2xl font-bold text-[#0F172A]">
            {complaints.filter(
              (c) =>
                c.status === 'Resolved' ||
                c.status === 'Confirmed'
            ).length}
          </p>
        </div>

      </div>

      {/* Main */}
      <section className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm">

        <div className="flex flex-col gap-4 border-b border-[#E2E8F0] p-5">

          <div>
            <h2 className="text-lg font-semibold text-[#0F172A]">
              Complaints
            </h2>

            <p className="mt-1 text-xs text-[#64748B]">
              Review and update complaints reported by villagers.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">

            <div className="relative flex-1">

              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]"
              />

              <input
                type="text"
                placeholder="Search complaints..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#E2E8F0] pl-9 pr-3 text-sm outline-none focus:border-[#0F766E]"
              />

            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-lg border border-[#E2E8F0] px-3 text-sm outline-none focus:border-[#0F766E]"
            >
              <option value="All">All Status</option>
              <option value="Submitted">Submitted</option>
              <option value="Verified">Verified</option>
              <option value="Maintenance Started">
                Maintenance Started
              </option>
              <option value="Resolved">Resolved</option>
              <option value="Confirmed">Confirmed</option>
            </select>

          </div>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px]">

            <thead>
              <tr className="bg-[#F8FAFC] text-left">

                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  Complaint
                </th>

                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  Reported By
                </th>

                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  Date
                </th>

                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  Priority
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

              {filteredComplaints.map((complaint) => (

                <tr
                  key={complaint.id}
                  className="hover:bg-[#F8FAFC]"
                >

                  <td className="px-5 py-4">

                    <div className="flex items-start gap-3">

                      <div className="rounded-lg bg-[#E0F2FE] p-2">
                        <FileWarning
                          size={17}
                          className="text-[#0284C7]"
                        />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-[#0F172A]">
                          {complaint.title}
                        </p>

                        <p className="mt-1 text-xs text-[#64748B]">
                          {complaint.village}
                        </p>
                      </div>

                    </div>

                  </td>

                  <td className="px-5 py-4 text-sm text-[#64748B]">
                    {complaint.reportedBy}
                  </td>

                  <td className="px-5 py-4 text-sm text-[#64748B]">
                    {complaint.date}
                  </td>

                  <td className="px-5 py-4">

                    <span
                      className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                        priorityStyles[complaint.priority]
                      }`}
                    >
                      {complaint.priority}
                    </span>

                  </td>

                  <td className="px-5 py-4">

                    <span
                      className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                        statusStyles[complaint.status]
                      }`}
                    >
                      {complaint.status}
                    </span>

                  </td>

                  <td className="px-5 py-4 text-right">

                    <button
                      onClick={() =>
                        setSelectedComplaint(complaint)
                      }
                      className="inline-flex items-center gap-1.5 rounded-md border border-[#E2E8F0] px-3 py-1.5 text-sm font-medium hover:border-[#0F766E] hover:text-[#0F766E]"
                    >
                      <Eye size={15} />
                      View
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>

      {/* Complaint Modal */}
      {selectedComplaint && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">

          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">

            <div className="border-b border-[#E2E8F0] p-5">

              <div className="flex items-start justify-between">

                <div>
                  <h2 className="text-lg font-semibold text-[#0F172A]">
                    {selectedComplaint.title}
                  </h2>

                  <p className="mt-1 text-xs text-[#64748B]">
                    Reported by {selectedComplaint.reportedBy}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="text-[#64748B] hover:text-[#0F172A]"
                >
                  <XCircle size={20} />
                </button>

              </div>

            </div>

            <div className="space-y-4 p-5">

              <div>
                <p className="text-xs font-medium text-[#64748B]">
                  Description
                </p>

                <p className="mt-1 text-sm text-[#0F172A]">
                  {selectedComplaint.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <p className="text-xs text-[#64748B]">
                    Village
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {selectedComplaint.village}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#64748B]">
                    Priority
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {selectedComplaint.priority}
                  </p>
                </div>

              </div>

              <div className="rounded-lg bg-[#F8FAFC] p-4">

                <p className="mb-3 text-sm font-semibold text-[#0F172A]">
                  Update Status
                </p>

                <div className="grid grid-cols-1 gap-2">

                  {selectedComplaint.status === 'Submitted' && (
                    <button
                      onClick={() =>
                        updateStatus(
                          selectedComplaint.id,
                          'Verified'
                        )
                      }
                      className="flex items-center justify-center gap-2 rounded-lg bg-[#0F766E] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#115E59]"
                    >
                      <CheckCircle size={17} />
                      Verify Complaint
                    </button>
                  )}

                  {selectedComplaint.status === 'Verified' && (
                    <button
                      onClick={() =>
                        updateStatus(
                          selectedComplaint.id,
                          'Maintenance Started'
                        )
                      }
                      className="flex items-center justify-center gap-2 rounded-lg bg-[#D97706] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
                    >
                      <Wrench size={17} />
                      Start Maintenance
                    </button>
                  )}

                  {selectedComplaint.status === 'Maintenance Started' && (
                    <button
                      onClick={() =>
                        updateStatus(
                          selectedComplaint.id,
                          'Resolved'
                        )
                      }
                      className="flex items-center justify-center gap-2 rounded-lg bg-[#16A34A] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
                    >
                      <CheckCircle size={17} />
                      Mark Resolved
                    </button>
                  )}

                  {(selectedComplaint.status === 'Resolved' ||
                    selectedComplaint.status === 'Confirmed') && (
                    <div className="flex items-center justify-center gap-2 rounded-lg bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700">
                      <CheckCircle size={17} />
                      Complaint Resolved
                    </div>
                  )}

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Complaints;
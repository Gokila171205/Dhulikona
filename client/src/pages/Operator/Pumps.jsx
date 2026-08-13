import React, { useMemo, useState } from 'react';
import {
  Activity,
  CalendarDays,
  Edit,
  Plus,
  Search,
  Wrench,
} from 'lucide-react';

const initialPumps = [
  {
    id: 1,
    name: 'Main Village Pump',
    type: 'Submersible',
    status: 'Working',
    installationDate: '2024-02-15',
    lastMaintenanceDate: '2026-07-20',
  },
  {
    id: 2,
    name: 'North Area Pump',
    type: 'Hand Pump',
    status: 'Working',
    installationDate: '2023-08-10',
    lastMaintenanceDate: '2026-06-18',
  },
  {
    id: 3,
    name: 'School Pump',
    type: 'Submersible',
    status: 'Under Maintenance',
    installationDate: '2024-05-22',
    lastMaintenanceDate: '2026-08-05',
  },
  {
    id: 4,
    name: 'Community Pump',
    type: 'Hand Pump',
    status: 'Not Working',
    installationDate: '2022-11-03',
    lastMaintenanceDate: '2026-05-12',
  },
];

const statusStyles = {
  Working: 'bg-green-50 text-green-700',
  'Under Maintenance': 'bg-orange-50 text-orange-700',
  'Not Working': 'bg-red-50 text-red-700',
  Unavailable: 'bg-slate-100 text-slate-700',
};

const formatDate = (date) => {
  if (!date) return '-';

  return new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const Pumps = () => {
  const [pumps, setPumps] = useState(initialPumps);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingPump, setEditingPump] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Submersible',
    status: 'Working',
    installationDate: '',
    lastMaintenanceDate: '',
  });

  const filteredPumps = useMemo(() => {
    return pumps.filter((pump) => {
      const matchesSearch =
        pump.name.toLowerCase().includes(search.toLowerCase()) ||
        pump.type.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' || pump.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [pumps, search, statusFilter]);

  const openAddForm = () => {
    setEditingPump(null);

    setFormData({
      name: '',
      type: 'Submersible',
      status: 'Working',
      installationDate: '',
      lastMaintenanceDate: '',
    });

    setShowForm(true);
  };

  const openEditForm = (pump) => {
    setEditingPump(pump);

    setFormData({
      name: pump.name,
      type: pump.type,
      status: pump.status,
      installationDate: pump.installationDate,
      lastMaintenanceDate: pump.lastMaintenanceDate,
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingPump(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      return;
    }

    if (editingPump) {
      setPumps((previous) =>
        previous.map((pump) =>
          pump.id === editingPump.id
            ? {
                ...pump,
                ...formData,
                name: formData.name.trim(),
              }
            : pump
        )
      );
    } else {
      const newPump = {
        id: Date.now(),
        ...formData,
        name: formData.name.trim(),
      };

      setPumps((previous) => [newPump, ...previous]);
    }

    closeForm();
  };

  return (
    <div className="min-h-full bg-[#F8FAFC] p-6">
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">
            Pump Management
          </h1>

          <p className="mt-1 text-sm text-[#64748B]">
            Monitor and manage pumps in your village.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#0F766E] px-4 text-sm font-medium text-white transition hover:bg-[#115E59]"
        >
          <Plus size={18} />
          Add Pump
        </button>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#64748B]">Total Pumps</p>
              <p className="mt-2 text-2xl font-bold text-[#0F172A]">
                {pumps.length}
              </p>
            </div>

            <div className="rounded-lg bg-[#E0F2FE] p-2.5">
              <Activity size={20} className="text-[#0284C7]" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#64748B]">Working</p>
              <p className="mt-2 text-2xl font-bold text-[#0F172A]">
                {pumps.filter((pump) => pump.status === 'Working').length}
              </p>
            </div>

            <div className="rounded-lg bg-green-50 p-2.5">
              <Activity size={20} className="text-[#16A34A]" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#64748B]">Under Maintenance</p>
              <p className="mt-2 text-2xl font-bold text-[#0F172A]">
                {
                  pumps.filter(
                    (pump) => pump.status === 'Under Maintenance'
                  ).length
                }
              </p>
            </div>

            <div className="rounded-lg bg-orange-50 p-2.5">
              <Wrench size={20} className="text-[#D97706]" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#64748B]">Not Working</p>
              <p className="mt-2 text-2xl font-bold text-[#0F172A]">
                {
                  pumps.filter((pump) => pump.status === 'Not Working')
                    .length
                }
              </p>
            </div>

            <div className="rounded-lg bg-red-50 p-2.5">
              <Activity size={20} className="text-[#DC2626]" />
            </div>
          </div>
        </div>
      </div>

      {/* Pump Table */}
      <section className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        {/* Filters */}
        <div className="flex flex-col gap-4 border-b border-[#E2E8F0] p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#0F172A]">
              Village Pumps
            </h2>

            <p className="mt-1 text-xs text-[#64748B]">
              View and update pump information.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]"
              />

              <input
                type="text"
                placeholder="Search pumps..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white pl-9 pr-3 text-sm text-[#0F172A] outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 sm:w-56"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
            >
              <option value="All">All Status</option>
              <option value="Working">Working</option>
              <option value="Under Maintenance">
                Under Maintenance
              </option>
              <option value="Not Working">Not Working</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-[#F8FAFC] text-left">
                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  Pump
                </th>

                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  Type
                </th>

                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  Status
                </th>

                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  Installation Date
                </th>

                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  Last Maintenance
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold text-[#64748B]">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredPumps.length > 0 ? (
                filteredPumps.map((pump) => (
                  <tr
                    key={pump.id}
                    className="transition hover:bg-[#F8FAFC]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-[#E0F2FE] p-2">
                          <Wrench
                            size={17}
                            className="text-[#0284C7]"
                          />
                        </div>

                        <span className="text-sm font-medium text-[#0F172A]">
                          {pump.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#64748B]">
                      {pump.type}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${
                          statusStyles[pump.status] ||
                          'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {pump.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-[#64748B]">
                        <CalendarDays size={15} />
                        {formatDate(pump.installationDate)}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#64748B]">
                      {formatDate(pump.lastMaintenanceDate)}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => openEditForm(pump)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-[#E2E8F0] bg-white px-3 py-1.5 text-sm font-medium text-[#0F172A] transition hover:border-[#0F766E] hover:text-[#0F766E]"
                      >
                        <Edit size={15} />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Search
                        size={28}
                        className="text-[#64748B]"
                      />

                      <p className="mt-3 text-sm font-medium text-[#0F172A]">
                        No pumps found
                      </p>

                      <p className="mt-1 text-xs text-[#64748B]">
                        Try changing your search or status filter.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-[#E2E8F0] px-5 py-3">
          <p className="text-xs text-[#64748B]">
            Showing {filteredPumps.length} of {pumps.length} pumps
          </p>
        </div>
      </section>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-lg rounded-xl border border-[#E2E8F0] bg-white shadow-xl">
            <div className="border-b border-[#E2E8F0] px-6 py-4">
              <h2 className="text-lg font-semibold text-[#0F172A]">
                {editingPump ? 'Edit Pump' : 'Add Pump'}
              </h2>

              <p className="mt-1 text-xs text-[#64748B]">
                Enter the pump information below.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 p-6">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-medium text-[#0F172A]"
                  >
                    Pump Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter pump name"
                    required
                    className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="type"
                    className="mb-1.5 block text-sm font-medium text-[#0F172A]"
                  >
                    Pump Type
                  </label>

                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                  >
                    <option value="Submersible">Submersible</option>
                    <option value="Hand Pump">Hand Pump</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="status"
                    className="mb-1.5 block text-sm font-medium text-[#0F172A]"
                  >
                    Status
                  </label>

                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                  >
                    <option value="Working">Working</option>
                    <option value="Not Working">Not Working</option>
                    <option value="Under Maintenance">
                      Under Maintenance
                    </option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="installationDate"
                      className="mb-1.5 block text-sm font-medium text-[#0F172A]"
                    >
                      Installation Date
                    </label>

                    <input
                      id="installationDate"
                      name="installationDate"
                      type="date"
                      value={formData.installationDate}
                      onChange={handleChange}
                      className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastMaintenanceDate"
                      className="mb-1.5 block text-sm font-medium text-[#0F172A]"
                    >
                      Last Maintenance
                    </label>

                    <input
                      id="lastMaintenanceDate"
                      name="lastMaintenanceDate"
                      type="date"
                      value={formData.lastMaintenanceDate}
                      onChange={handleChange}
                      className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-[#E2E8F0] px-6 py-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-4 text-sm font-medium text-[#0F172A] transition hover:bg-[#F8FAFC]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="h-10 rounded-lg bg-[#0F766E] px-4 text-sm font-medium text-white transition hover:bg-[#115E59]"
                >
                  {editingPump ? 'Save Changes' : 'Add Pump'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pumps;
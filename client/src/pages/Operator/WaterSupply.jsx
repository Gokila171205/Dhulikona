import React, { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';
import {
  CalendarDays,
  Clock3,
  Droplets,
  Edit,
  Plus,
  Search,
} from 'lucide-react';

const statusStyles = {
  Completed: 'bg-green-50 text-green-700',
  Upcoming: 'bg-blue-50 text-blue-700',
  'In Progress': 'bg-blue-50 text-blue-700',
  Cancelled: 'bg-red-50 text-red-700',
};

const formatDate = (date) => {
  if (!date) return '-';

  const dateValue =
    typeof date === 'string' && date.includes('T')
      ? date.split('T')[0]
      : date;

  return new Date(`${dateValue}T00:00:00`).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime = (time) => {
  if (!time) return '-';

  const [hours, minutes] = time.split(':');
  const date = new Date();

  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const WaterSupply = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    area: '',
    pump: '',
    status: 'Upcoming',
    remarks: '',
  });

  // =========================
  // FETCH RECORDS
  // =========================
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);

      const res = await api.get('/water-supply');

      // Handle both:
      // res.data = [...]
      // OR
      // res.data = { data: [...] }
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      setRecords(data);
    } catch (err) {
      console.error('Failed to fetch supply records:', err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FILTER RECORDS
  // =========================
  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const searchText = search.toLowerCase();

      const areaText = String(record.area || '').toLowerCase();

      // Supports both:
      // pump: "Main Pump"
      // pump: { name: "Main Pump" }
      const pumpText =
        typeof record.pump === 'object'
          ? String(record.pump?.name || '').toLowerCase()
          : String(record.pump || '').toLowerCase();

      const matchesSearch =
        areaText.includes(searchText) ||
        pumpText.includes(searchText);

      const matchesStatus =
        statusFilter === 'All' || record.status === statusFilter;

      const recordDate =
        typeof record.date === 'string' && record.date.includes('T')
          ? record.date.split('T')[0]
          : record.date;

      const matchesDate =
        !dateFilter || recordDate === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [records, search, statusFilter, dateFilter]);

  // =========================
  // ADD FORM
  // =========================
  const openAddForm = () => {
    setEditingRecord(null);

    setFormData({
      date: '',
      startTime: '',
      endTime: '',
      area: '',
      pump: '',
      status: 'Upcoming',
      remarks: '',
    });

    setShowForm(true);
  };

  // =========================
  // EDIT FORM
  // =========================
  const openEditForm = (record) => {
    setEditingRecord(record);

    setFormData({
      date: record.date
        ? String(record.date).split('T')[0]
        : '',
      startTime: record.startTime || '',
      endTime: record.endTime || '',
      area: record.area || '',
      pump:
        typeof record.pump === 'object'
          ? record.pump?._id || ''
          : record.pump || '',
      status: record.status || 'Upcoming',
      remarks: record.remarks || '',
    });

    setShowForm(true);
  };

  // =========================
  // CLOSE FORM
  // =========================
  const closeForm = () => {
    setShowForm(false);
    setEditingRecord(null);
  };

  // =========================
  // HANDLE FORM CHANGE
  // =========================
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // SUBMIT FORM
  // =========================
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.date ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.area.trim() ||
      !formData.pump.trim()
    ) {
      return;
    }

    if (formData.endTime <= formData.startTime) {
      alert('End time must be after start time.');
      return;
    }

    try {
      const payload = {
        ...formData,
        area: formData.area.trim(),
        pump: formData.pump.trim(),
        remarks: formData.remarks.trim(),
      };

      if (editingRecord) {
        await api.put(
          `/water-supply/${editingRecord._id}`,
          payload
        );
      } else {
        await api.post('/water-supply', payload);
      }

      await fetchRecords();
      closeForm();
    } catch (err) {
      console.error('Failed to save supply record:', err);
      alert('Something went wrong while saving.');
    }
  };

  // =========================
  // TODAY
  // =========================
  const today = new Date().toISOString().split('T')[0];

  const todayRecords = records.filter((record) => {
    const recordDate =
      typeof record.date === 'string' && record.date.includes('T')
        ? record.date.split('T')[0]
        : record.date;

    return recordDate === today;
  });

  const completedToday = todayRecords.filter(
    (record) => record.status === 'Completed'
  ).length;

  const upcomingToday = todayRecords.filter(
    (record) => record.status === 'Upcoming'
  ).length;

  // =========================
  // RENDER
  // =========================
  return (
    <div className="min-h-full bg-[#F8FAFC] p-6">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">
            Water Supply Management
          </h1>

          <p className="mt-1 text-sm text-[#64748B]">
            Record and monitor water supply sessions for your village.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#0F766E] px-4 text-sm font-medium text-white transition hover:bg-[#115E59]"
        >
          <Plus size={18} />
          Record Supply
        </button>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#64748B]">
                Today's Sessions
              </p>

              <p className="mt-2 text-2xl font-bold text-[#0F172A]">
                {todayRecords.length}
              </p>
            </div>

            <div className="rounded-lg bg-[#E0F2FE] p-2.5">
              <Droplets
                size={20}
                className="text-[#0284C7]"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#64748B]">
                Completed Today
              </p>

              <p className="mt-2 text-2xl font-bold text-[#0F172A]">
                {completedToday}
              </p>
            </div>

            <div className="rounded-lg bg-green-50 p-2.5">
              <Clock3
                size={20}
                className="text-[#16A34A]"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#64748B]">
                Upcoming Today
              </p>

              <p className="mt-2 text-2xl font-bold text-[#0F172A]">
                {upcomingToday}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-2.5">
              <CalendarDays
                size={20}
                className="text-[#2563EB]"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Records */}
      <section className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm">

        {/* Filters */}
        <div className="flex flex-col gap-4 border-b border-[#E2E8F0] p-5">

          <div>
            <h2 className="text-lg font-semibold text-[#0F172A]">
              Supply Records
            </h2>

            <p className="mt-1 text-xs text-[#64748B]">
              View and update recorded water supply sessions.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row">

            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]"
              />

              <input
                type="text"
                placeholder="Search area or pump..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white pl-9 pr-3 text-sm text-[#0F172A] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
              />
            </div>

            <input
              type="date"
              value={dateFilter}
              onChange={(event) =>
                setDateFilter(event.target.value)
              }
              className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
            >
              <option value="All">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Upcoming">Upcoming</option>
              <option value="In Progress">
                In Progress
              </option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {dateFilter && (
              <button
                type="button"
                onClick={() => setDateFilter('')}
                className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-4 text-sm font-medium text-[#0F172A] hover:bg-[#F8FAFC]"
              >
                Clear Date
              </button>
            )}

          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px]">

            <thead>
              <tr className="bg-[#F8FAFC] text-left">

                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  Date
                </th>

                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  Supply Time
                </th>

                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  Area
                </th>

                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  Pump
                </th>

                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  Status
                </th>

                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  Remarks
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold text-[#64748B]">
                  Action
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-[#E2E8F0]">

              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center text-sm text-[#64748B]"
                  >
                    Loading supply records...
                  </td>
                </tr>
              ) : filteredRecords.length > 0 ? (

                filteredRecords.map((record) => {

                  const pumpName =
                    typeof record.pump === 'object'
                      ? record.pump?.name || 'Unknown pump'
                      : record.pump || '-';

                  return (
                    <tr
                      key={record._id}
                      className="transition hover:bg-[#F8FAFC]"
                    >

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-[#64748B]">
                          <CalendarDays size={15} />
                          {formatDate(record.date)}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-[#0F172A]">
                          <Clock3
                            size={15}
                            className="text-[#0284C7]"
                          />

                          {formatTime(record.startTime)} -{' '}
                          {formatTime(record.endTime)}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-[#0F172A]">
                        {record.area || '-'}
                      </td>

                      <td className="px-5 py-4 text-sm text-[#64748B]">
                        {pumpName}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${
                            statusStyles[record.status] ||
                            'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {record.status || '-'}
                        </span>
                      </td>

                      <td className="max-w-[200px] truncate px-5 py-4 text-sm text-[#64748B]">
                        {record.remarks || '-'}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            openEditForm(record)
                          }
                          className="inline-flex items-center gap-1.5 rounded-md border border-[#E2E8F0] bg-white px-3 py-1.5 text-sm font-medium text-[#0F172A] transition hover:border-[#0F766E] hover:text-[#0F766E]"
                        >
                          <Edit size={15} />
                          Edit
                        </button>
                      </td>

                    </tr>
                  );
                })

              ) : (

                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center"
                  >
                    <div className="flex flex-col items-center">

                      <Droplets
                        size={28}
                        className="text-[#64748B]"
                      />

                      <p className="mt-3 text-sm font-medium text-[#0F172A]">
                        No supply records found
                      </p>

                      <p className="mt-1 text-xs text-[#64748B]">
                        Try changing your filters or add a new record.
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
            Showing {filteredRecords.length} of{' '}
            {records.length} records
          </p>
        </div>

      </section>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">

          <div className="w-full max-w-2xl rounded-xl border border-[#E2E8F0] bg-white shadow-xl">

            <div className="border-b border-[#E2E8F0] px-6 py-4">

              <h2 className="text-lg font-semibold text-[#0F172A]">
                {editingRecord
                  ? 'Edit Supply Record'
                  : 'Record Water Supply'}
              </h2>

              <p className="mt-1 text-xs text-[#64748B]">
                Enter the details of the water supply session.
              </p>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="space-y-4 p-6">

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                  <div>
                    <label
                      htmlFor="date"
                      className="mb-1.5 block text-sm font-medium text-[#0F172A]"
                    >
                      Supply Date
                    </label>

                    <input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="startTime"
                      className="mb-1.5 block text-sm font-medium text-[#0F172A]"
                    >
                      Start Time
                    </label>

                    <input
                      id="startTime"
                      name="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={handleChange}
                      required
                      className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="endTime"
                      className="mb-1.5 block text-sm font-medium text-[#0F172A]"
                    >
                      End Time
                    </label>

                    <input
                      id="endTime"
                      name="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={handleChange}
                      required
                      className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                    />
                  </div>

                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  <div>
                    <label
                      htmlFor="area"
                      className="mb-1.5 block text-sm font-medium text-[#0F172A]"
                    >
                      Supply Area
                    </label>

                    <input
                      id="area"
                      name="area"
                      type="text"
                      value={formData.area}
                      onChange={handleChange}
                      placeholder="e.g. Main Village"
                      required
                      className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="pump"
                      className="mb-1.5 block text-sm font-medium text-[#0F172A]"
                    >
                      Pump Used
                    </label>

                    <select
                      id="pump"
                      name="pump"
                      value={formData.pump}
                      onChange={handleChange}
                      required
                      className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                    >
                      <option value="">
                        Select pump
                      </option>

                      <option value="Main Village Pump">
                        Main Village Pump
                      </option>

                      <option value="North Area Pump">
                        North Area Pump
                      </option>

                      <option value="School Pump">
                        School Pump
                      </option>

                      <option value="Community Pump">
                        Community Pump
                      </option>
                    </select>
                  </div>

                </div>

                <div>
                  <label
                    htmlFor="status"
                    className="mb-1.5 block text-sm font-medium text-[#0F172A]"
                  >
                    Supply Status
                  </label>

                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                  >
                    <option value="Upcoming">
                      Upcoming
                    </option>

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Completed">
                      Completed
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="remarks"
                    className="mb-1.5 block text-sm font-medium text-[#0F172A]"
                  >
                    Remarks
                  </label>

                  <textarea
                    id="remarks"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    placeholder="Add any relevant supply notes..."
                    rows="3"
                    className="w-full resize-none rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#0F172A] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                  />
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
                  {editingRecord
                    ? 'Save Changes'
                    : 'Record Supply'}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default WaterSupply;
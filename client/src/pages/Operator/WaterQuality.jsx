import React, { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';

import {
  Activity,
  CalendarDays,
  Edit,
  FlaskConical,
  Plus,
  Search,
} from 'lucide-react';

const statusStyles = {
  Safe: 'bg-green-50 text-green-700',
  'Attention Required': 'bg-orange-50 text-orange-700',
  Unsafe: 'bg-red-50 text-red-700',
};

const formatDate = (date) => {
  if (!date) return '-';

  return new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const WaterQuality = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const [formData, setFormData] = useState({
    date: '',
    location: '',
    pump: '',
    ph: '',
    turbidity: '',
    tds: '',
    chlorine: '',
    status: 'Safe',
    remarks: '',
  });

  // ================================
  // FETCH RECORDS
  // ================================

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);

      const res = await api.get('/water-quality');

      console.log('Water quality API response:', res.data);

      // Make sure records is always an array
      setRecords(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch quality records:', err);

      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // FILTER RECORDS
  // ================================

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        (record.location || '').toLowerCase().includes(searchText) ||
        (record.pump || '').toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === 'All' ||
        record.status === statusFilter;

      const matchesDate =
        !dateFilter || record.date === dateFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [records, search, statusFilter, dateFilter]);

  // ================================
  // SUMMARY COUNTS
  // ================================

  const safeCount = records.filter(
    (record) => record.status === 'Safe'
  ).length;

  const attentionCount = records.filter(
    (record) => record.status === 'Attention Required'
  ).length;

  // ================================
  // OPEN ADD FORM
  // ================================

  const openAddForm = () => {
    setEditingRecord(null);

    setFormData({
      date: '',
      location: '',
      pump: '',
      ph: '',
      turbidity: '',
      tds: '',
      chlorine: '',
      status: 'Safe',
      remarks: '',
    });

    setShowForm(true);
  };

  // ================================
  // OPEN EDIT FORM
  // ================================

  const openEditForm = (record) => {
    setEditingRecord(record);

    setFormData({
      date: record.date || '',
      location: record.location || '',
      pump: record.pump || '',
      ph: record.ph ?? '',
      turbidity: record.turbidity ?? '',
      tds: record.tds ?? '',
      chlorine: record.chlorine ?? '',
      status: record.status || 'Safe',
      remarks: record.remarks || '',
    });

    setShowForm(true);
  };

  // ================================
  // CLOSE FORM
  // ================================

  const closeForm = () => {
    setShowForm(false);
    setEditingRecord(null);
  };

  // ================================
  // HANDLE INPUT CHANGE
  // ================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ================================
  // HANDLE SUBMIT
  // ================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const {
      date,
      location,
      pump,
      ph,
      turbidity,
      tds,
      chlorine,
    } = formData;

    // Required field validation
    if (
      !date ||
      !location.trim() ||
      !pump ||
      !ph ||
      !turbidity ||
      !tds ||
      !chlorine
    ) {
      alert('Please fill all required fields.');
      return;
    }

    // Convert values to numbers
    const phValue = Number(ph);
    const turbidityValue = Number(turbidity);
    const tdsValue = Number(tds);
    const chlorineValue = Number(chlorine);

    // Number validation
    if (
      Number.isNaN(phValue) ||
      Number.isNaN(turbidityValue) ||
      Number.isNaN(tdsValue) ||
      Number.isNaN(chlorineValue)
    ) {
      alert('Water quality values must be valid numbers.');
      return;
    }

    // Range validation
    if (
      phValue < 0 ||
      phValue > 14 ||
      turbidityValue < 0 ||
      tdsValue < 0 ||
      chlorineValue < 0
    ) {
      alert('Please enter valid water quality values.');
      return;
    }

    try {
      const payload = {
        ...formData,

        location: formData.location.trim(),
        remarks: formData.remarks.trim(),

        ph: phValue,
        turbidity: turbidityValue,
        tds: tdsValue,
        chlorine: chlorineValue,
      };

      // EDIT
      if (editingRecord) {
        await api.put(
          `/water-quality/${editingRecord._id}`,
          payload
        );
      }

      // CREATE
      else {
        await api.post(
          '/water-quality',
          payload
        );
      }

      // Refresh records from MongoDB
      await fetchRecords();

      // Close modal
      closeForm();
    } catch (err) {
      console.error(
        'Failed to save quality record:',
        err
      );

      alert(
        'Something went wrong while saving.'
      );
    }
  };

  return (
    <div className="min-h-full bg-[#F8FAFC] p-6">

      {/* ================================
          HEADER
      ================================= */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">
            Water Quality
          </h1>

          <p className="mt-1 text-sm text-[#64748B]">
            Record and monitor water quality test results.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#0F766E] px-4 text-sm font-medium text-white transition hover:bg-[#115E59]"
        >
          <Plus size={18} />
          Record Test
        </button>

      </div>

      {/* ================================
          SUMMARY CARDS
      ================================= */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

        {/* Total Tests */}

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-[#64748B]">
                Total Tests
              </p>

              <p className="mt-2 text-2xl font-bold text-[#0F172A]">
                {records.length}
              </p>
            </div>

            <div className="rounded-lg bg-[#E0F2FE] p-2.5">
              <FlaskConical
                size={20}
                className="text-[#0284C7]"
              />
            </div>

          </div>

        </div>

        {/* Safe Results */}

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-[#64748B]">
                Safe Results
              </p>

              <p className="mt-2 text-2xl font-bold text-[#0F172A]">
                {safeCount}
              </p>
            </div>

            <div className="rounded-lg bg-green-50 p-2.5">
              <Activity
                size={20}
                className="text-[#16A34A]"
              />
            </div>

          </div>

        </div>

        {/* Attention Required */}

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-[#64748B]">
                Attention Required
              </p>

              <p className="mt-2 text-2xl font-bold text-[#0F172A]">
                {attentionCount}
              </p>
            </div>

            <div className="rounded-lg bg-orange-50 p-2.5">
              <Activity
                size={20}
                className="text-[#D97706]"
              />
            </div>

          </div>

        </div>

      </div>

      {/* ================================
          MAIN CARD
      ================================= */}

      <section className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm">

        {/* Filters */}

        <div className="flex flex-col gap-4 border-b border-[#E2E8F0] p-5">

          <div>
            <h2 className="text-lg font-semibold text-[#0F172A]">
              Quality Test Records
            </h2>

            <p className="mt-1 text-xs text-[#64748B]">
              Review recorded water quality measurements.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row">

            {/* Search */}

            <div className="relative flex-1">

              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]"
              />

              <input
                type="text"
                placeholder="Search location or pump..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white pl-9 pr-3 text-sm text-[#0F172A] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
              />

            </div>

            {/* Date Filter */}

            <input
              type="date"
              value={dateFilter}
              onChange={(event) =>
                setDateFilter(event.target.value)
              }
              className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
            />

            {/* Status Filter */}

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
            >
              <option value="All">
                All Status
              </option>

              <option value="Safe">
                Safe
              </option>

              <option value="Attention Required">
                Attention Required
              </option>

              <option value="Unsafe">
                Unsafe
              </option>
            </select>

            {/* Clear Date */}

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

        {/* ================================
            TABLE
        ================================= */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1200px]">

            <thead>

              <tr className="bg-[#F8FAFC] text-left">

                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  Date
                </th>

                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  Location
                </th>

                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  Pump
                </th>

                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  pH
                </th>

                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  Turbidity
                </th>

                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  TDS
                </th>

                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  Chlorine
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

              {/* Loading */}

              {loading ? (

                <tr>

                  <td
                    colSpan="9"
                    className="px-5 py-12 text-center text-sm text-[#64748B]"
                  >
                    Loading quality records...
                  </td>

                </tr>

              ) : filteredRecords.length > 0 ? (

                /* Records */

                filteredRecords.map((record) => (

                  <tr
                    key={record._id}
                    className="transition hover:bg-[#F8FAFC]"
                  >

                    {/* Date */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2 text-sm text-[#64748B]">

                        <CalendarDays size={15} />

                        {formatDate(record.date)}

                      </div>

                    </td>

                    {/* Location */}

                    <td className="px-5 py-4 text-sm font-medium text-[#0F172A]">
                      {record.location || '-'}
                    </td>

                    {/* Pump */}

                    <td className="px-5 py-4 text-sm text-[#64748B]">
                      {record.pump || '-'}
                    </td>

                    {/* pH */}

                    <td className="px-5 py-4 text-sm font-medium text-[#0F172A]">
                      {record.ph ?? '-'}
                    </td>

                    {/* Turbidity */}

                    <td className="px-5 py-4 text-sm text-[#0F172A]">
                      {record.turbidity ?? '-'}
                    </td>

                    {/* TDS */}

                    <td className="px-5 py-4 text-sm text-[#0F172A]">
                      {record.tds ?? '-'}
                    </td>

                    {/* Chlorine */}

                    <td className="px-5 py-4 text-sm text-[#0F172A]">
                      {record.chlorine ?? '-'}
                    </td>

                    {/* Status */}

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

                    {/* Edit */}

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

                ))

              ) : (

                /* No Records */

                <tr>

                  <td
                    colSpan="9"
                    className="px-5 py-12 text-center"
                  >

                    <div className="flex flex-col items-center">

                      <FlaskConical
                        size={28}
                        className="text-[#64748B]"
                      />

                      <p className="mt-3 text-sm font-medium text-[#0F172A]">
                        No quality records found
                      </p>

                      <p className="mt-1 text-xs text-[#64748B]">
                        Try changing your filters or record a new test.
                      </p>

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* Record Count */}

        <div className="border-t border-[#E2E8F0] px-5 py-3">

          <p className="text-xs text-[#64748B]">
            Showing {filteredRecords.length} of {records.length} records
          </p>

        </div>

      </section>

      {/* ================================
          ADD / EDIT MODAL
      ================================= */}

      {showForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">

          <div className="w-full max-w-2xl rounded-xl border border-[#E2E8F0] bg-white shadow-xl">

            {/* Modal Header */}

            <div className="border-b border-[#E2E8F0] px-6 py-4">

              <h2 className="text-lg font-semibold text-[#0F172A]">

                {editingRecord
                  ? 'Edit Quality Record'
                  : 'Record Water Quality Test'}

              </h2>

              <p className="mt-1 text-xs text-[#64748B]">
                Enter the measurements from the water quality test.
              </p>

            </div>

            {/* Form */}

            <form onSubmit={handleSubmit}>

              <div className="space-y-4 p-6">

                {/* Date / Location */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  <div>

                    <label
                      htmlFor="quality-date"
                      className="mb-1.5 block text-sm font-medium text-[#0F172A]"
                    >
                      Test Date
                    </label>

                    <input
                      id="quality-date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="h-10 w-full rounded-lg border border-[#E2E8F0] px-3 text-sm outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                    />

                  </div>

                  <div>

                    <label
                      htmlFor="quality-location"
                      className="mb-1.5 block text-sm font-medium text-[#0F172A]"
                    >
                      Test Location
                    </label>

                    <input
                      id="quality-location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Main Village Tank"
                      required
                      className="h-10 w-full rounded-lg border border-[#E2E8F0] px-3 text-sm outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                    />

                  </div>

                </div>

                {/* Pump */}

                <div>

                  <label
                    htmlFor="quality-pump"
                    className="mb-1.5 block text-sm font-medium text-[#0F172A]"
                  >
                    Water Source / Pump
                  </label>

                  <select
                    id="quality-pump"
                    name="pump"
                    value={formData.pump}
                    onChange={handleChange}
                    required
                    className="h-10 w-full rounded-lg border border-[#E2E8F0] px-3 text-sm outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
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

                {/* Measurements */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  {/* pH */}

                  <div>

                    <label
                      htmlFor="quality-ph"
                      className="mb-1.5 block text-sm font-medium text-[#0F172A]"
                    >
                      pH
                    </label>

                    <input
                      id="quality-ph"
                      name="ph"
                      type="number"
                      step="0.1"
                      min="0"
                      max="14"
                      value={formData.ph}
                      onChange={handleChange}
                      placeholder="e.g. 7.2"
                      required
                      className="h-10 w-full rounded-lg border border-[#E2E8F0] px-3 text-sm outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                    />

                  </div>

                  {/* Turbidity */}

                  <div>

                    <label
                      htmlFor="quality-turbidity"
                      className="mb-1.5 block text-sm font-medium text-[#0F172A]"
                    >
                      Turbidity
                    </label>

                    <input
                      id="quality-turbidity"
                      name="turbidity"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.turbidity}
                      onChange={handleChange}
                      placeholder="e.g. 1.4"
                      required
                      className="h-10 w-full rounded-lg border border-[#E2E8F0] px-3 text-sm outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                    />

                  </div>

                  {/* TDS */}

                  <div>

                    <label
                      htmlFor="quality-tds"
                      className="mb-1.5 block text-sm font-medium text-[#0F172A]"
                    >
                      TDS
                    </label>

                    <input
                      id="quality-tds"
                      name="tds"
                      type="number"
                      min="0"
                      value={formData.tds}
                      onChange={handleChange}
                      placeholder="e.g. 280"
                      required
                      className="h-10 w-full rounded-lg border border-[#E2E8F0] px-3 text-sm outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                    />

                  </div>

                  {/* Chlorine */}

                  <div>

                    <label
                      htmlFor="quality-chlorine"
                      className="mb-1.5 block text-sm font-medium text-[#0F172A]"
                    >
                      Chlorine
                    </label>

                    <input
                      id="quality-chlorine"
                      name="chlorine"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.chlorine}
                      onChange={handleChange}
                      placeholder="e.g. 0.5"
                      required
                      className="h-10 w-full rounded-lg border border-[#E2E8F0] px-3 text-sm outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                    />

                  </div>

                </div>

                {/* Status */}

                <div>

                  <label
                    htmlFor="quality-status"
                    className="mb-1.5 block text-sm font-medium text-[#0F172A]"
                  >
                    Overall Status
                  </label>

                  <select
                    id="quality-status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-[#E2E8F0] px-3 text-sm outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                  >

                    <option value="Safe">
                      Safe
                    </option>

                    <option value="Attention Required">
                      Attention Required
                    </option>

                    <option value="Unsafe">
                      Unsafe
                    </option>

                  </select>

                </div>

                {/* Remarks */}

                <div>

                  <label
                    htmlFor="quality-remarks"
                    className="mb-1.5 block text-sm font-medium text-[#0F172A]"
                  >
                    Remarks
                  </label>

                  <textarea
                    id="quality-remarks"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    placeholder="Add observations or follow-up notes..."
                    rows="3"
                    className="w-full resize-none rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                  />

                </div>

              </div>

              {/* Modal Footer */}

              <div className="flex justify-end gap-3 border-t border-[#E2E8F0] px-6 py-4">

                <button
                  type="button"
                  onClick={closeForm}
                  className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-4 text-sm font-medium text-[#0F172A] hover:bg-[#F8FAFC]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="h-10 rounded-lg bg-[#0F766E] px-4 text-sm font-medium text-white hover:bg-[#115E59]"
                >
                  {editingRecord
                    ? 'Save Changes'
                    : 'Record Test'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default WaterQuality;